/**
 * Contracts & Milestones Service
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-06: Client Portal & Contract Milestones
 * 
 * Strict Architectural Invariants:
 * - Contract value is planned commercial value, NOT revenue.
 * - Dynamic financial reconciliation: Billed, Paid, and Outstanding are derived from finance service.
 * - Milestones track project delivery & commercial scheduling; completing a milestone does NOT auto-create an invoice.
 * - Fully auditable activity stream.
 */

import { supabase } from './supabase';
import {
  ContractRecord,
  ContractMilestoneRecord,
  ContractActivityRecord,
  ContractStatus,
  MilestoneStatus,
  ClientPortalViewData
} from '../types/contracts';
import { financeService } from './financeService';
import { ClientRecord } from '../types/finance';

const LOCAL_STORAGE_KEY_CONTRACTS = 'mk_contracts_ledger_v1';
const LOCAL_STORAGE_KEY_MILESTONES = 'mk_contract_milestones_v1';
const LOCAL_STORAGE_KEY_ACTIVITIES = 'mk_contract_activities_v1';

class ContractService {
  private cachedContracts: ContractRecord[] = [];
  private cachedMilestones: ContractMilestoneRecord[] = [];
  private cachedActivities: ContractActivityRecord[] = [];

  constructor() {
    this.initLocalCache();
  }

  private initLocalCache() {
    if (typeof window !== 'undefined') {
      try {
        const storedContracts = localStorage.getItem(LOCAL_STORAGE_KEY_CONTRACTS);
        if (storedContracts) this.cachedContracts = JSON.parse(storedContracts);

        const storedMilestones = localStorage.getItem(LOCAL_STORAGE_KEY_MILESTONES);
        if (storedMilestones) this.cachedMilestones = JSON.parse(storedMilestones);

        const storedActivities = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVITIES);
        if (storedActivities) this.cachedActivities = JSON.parse(storedActivities);
      } catch (err) {
        console.warn('[ContractService] Cache initialization note:', err);
      }
    }
  }

  private saveLocalCache() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_CONTRACTS, JSON.stringify(this.cachedContracts));
        localStorage.setItem(LOCAL_STORAGE_KEY_MILESTONES, JSON.stringify(this.cachedMilestones));
        localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVITIES, JSON.stringify(this.cachedActivities));
      } catch (err) {
        console.warn('[ContractService] Failed to persist cache:', err);
      }
    }
  }

  // ============================================================================
  // CONTRACT NUMBER GENERATION
  // ============================================================================

  public async generateNextContractNumber(prefix: string = 'MK-C'): Promise<string> {
    const year = new Date().getFullYear();
    const existing = await this.getContracts();
    const regex = new RegExp(`^${prefix}-${year}-(\\d+)$`);
    let maxNum = 0;

    existing.forEach(c => {
      const match = c.contractNumber.match(regex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });

    const nextSeq = String(maxNum + 1).padStart(3, '0');
    return `${prefix}-${year}-${nextSeq}`;
  }

  // ============================================================================
  // CONTRACTS CRUD & RECONCILIATION
  // ============================================================================

  public async getContracts(): Promise<ContractRecord[]> {
    let rawContracts: any[] = [];
    const clients = await financeService.getClients();
    const clientMap = new Map<string, ClientRecord>(clients.map(c => [c.id, c]));
    const allInvoices = await financeService.getInvoices();
    const allMilestones = await this.getMilestones();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          rawContracts = data;
        }
      } catch (e) {
        console.warn('[ContractService] Supabase contracts query fallback:', e);
      }
    }

    if (rawContracts.length === 0 && this.cachedContracts.length > 0) {
      rawContracts = this.cachedContracts.map(c => ({
        id: c.id,
        client_id: c.clientId,
        lead_id: c.leadId,
        contract_number: c.contractNumber,
        title: c.title,
        contract_type: c.contractType,
        status: c.status,
        description: c.description,
        start_date: c.startDate,
        end_date: c.endDate,
        currency_code: c.currencyCode,
        contract_value: c.contractValue,
        billing_frequency: c.billingFrequency,
        payment_terms_days: c.paymentTermsDays,
        auto_renew: c.autoRenew,
        renewal_date: c.renewalDate,
        notes: c.notes,
        created_at: c.createdAt,
        updated_at: c.updatedAt
      }));
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const reconciled: ContractRecord[] = rawContracts.map((row: any) => {
      const client = clientMap.get(row.client_id);
      const contractId = row.id;

      // Milestones for this contract
      const contractMilestones = allMilestones.filter(m => m.contractId === contractId);
      const milestonesCount = contractMilestones.length;
      const completedMilestones = contractMilestones.filter(m => m.status === 'completed');
      const completedMilestonesCount = completedMilestones.length;

      // Calculate progress percentage
      let overallProgressPercent = 0;
      if (milestonesCount > 0) {
        const sumPercent = contractMilestones.reduce((acc, m) => acc + (m.completionPercentage || 0), 0);
        overallProgressPercent = Math.round(sumPercent / milestonesCount);
      }

      // Link financial invoices associated with this contract (or matching client if explicit)
      // Check invoices that link directly to this contractId
      const linkedInvoices = allInvoices.filter(
        i => (i as any).contractId === contractId && i.status !== 'cancelled'
      );

      const totalBilled = linkedInvoices.reduce((acc, i) => acc + i.amountTotal, 0);
      const totalPaid = linkedInvoices.reduce((acc, i) => acc + i.amountPaid, 0);
      const totalOutstanding = Math.max(0, Math.round((totalBilled - totalPaid) * 100) / 100);
      const contractValue = Number(row.contract_value || 0);
      const unbilledContractValue = Math.max(0, Math.round((contractValue - totalBilled) * 100) / 100);

      const isOverdue = Boolean(
        row.end_date &&
        row.end_date < todayStr &&
        !['completed', 'terminated', 'cancelled'].includes(row.status)
      );

      return {
        id: row.id,
        clientId: row.client_id,
        clientName: client?.name || 'Client Contact',
        organizationName: client?.organizationName || 'Healthcare Organization',
        leadId: row.lead_id || null,
        contractNumber: row.contract_number,
        title: row.title,
        contractType: row.contract_type,
        status: row.status,
        description: row.description || '',
        startDate: row.start_date || undefined,
        endDate: row.end_date || undefined,
        currencyCode: row.currency_code || 'INR',
        contractValue,
        billingFrequency: row.billing_frequency || 'monthly',
        paymentTermsDays: Number(row.payment_terms_days ?? 15),
        autoRenew: Boolean(row.auto_renew),
        renewalDate: row.renewal_date || undefined,
        notes: row.notes || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        milestonesCount,
        completedMilestonesCount,
        overallProgressPercent,
        totalBilled,
        totalPaid,
        totalOutstanding,
        unbilledContractValue,
        isOverdue
      };
    });

    this.cachedContracts = reconciled;
    this.saveLocalCache();
    return reconciled;
  }

  public async createContract(
    input: Omit<
      ContractRecord,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'milestonesCount'
      | 'completedMilestonesCount'
      | 'overallProgressPercent'
      | 'totalBilled'
      | 'totalPaid'
      | 'totalOutstanding'
      | 'unbilledContractValue'
      | 'isOverdue'
    >,
    actorName: string = 'Admin Operator'
  ): Promise<ContractRecord> {
    if (!input.clientId) throw new Error('A client partner must be selected.');
    if (!input.title?.trim()) throw new Error('Contract title is required.');
    if (input.contractValue < 0) throw new Error('Contract value cannot be negative.');

    let contractNumber = input.contractNumber?.trim();
    if (!contractNumber) {
      contractNumber = await this.generateNextContractNumber();
    }

    const payload = {
      client_id: input.clientId,
      lead_id: input.leadId || null,
      contract_number: contractNumber,
      title: input.title.trim(),
      contract_type: input.contractType || 'retainer',
      status: input.status || 'draft',
      description: input.description?.trim() || null,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
      currency_code: input.currencyCode || 'INR',
      contract_value: Math.round(input.contractValue * 100) / 100,
      billing_frequency: input.billingFrequency || 'monthly',
      payment_terms_days: input.paymentTermsDays ?? 15,
      auto_renew: Boolean(input.autoRenew),
      renewal_date: input.renewalDate || null,
      notes: input.notes?.trim() || null
    };

    let createdId = `contract_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contracts')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) createdId = data.id;
      } catch (err: any) {
        console.warn('[ContractService] Supabase createContract fallback:', err?.message);
      }
    }

    const created: ContractRecord = {
      ...input,
      id: createdId,
      contractNumber,
      contractValue: Math.round(input.contractValue * 100) / 100,
      milestonesCount: 0,
      completedMilestonesCount: 0,
      overallProgressPercent: 0,
      totalBilled: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      unbilledContractValue: Math.round(input.contractValue * 100) / 100,
      isOverdue: false,
      createdAt: now,
      updatedAt: now
    };

    this.cachedContracts.unshift(created);
    this.saveLocalCache();

    // Log Activity
    await this.addContractActivity(
      createdId,
      'contract_created',
      `Contract ${contractNumber} (${created.title}) initialized with value ${created.currencyCode} ${created.contractValue.toLocaleString()}`,
      actorName
    );

    return created;
  }

  public async updateContractStatus(
    contractId: string,
    status: ContractStatus,
    actorName: string = 'Admin Operator'
  ): Promise<void> {
    const existing = this.cachedContracts.find(c => c.id === contractId);
    const oldStatus = existing?.status || 'unknown';

    if (supabase) {
      try {
        const { error } = await supabase
          .from('contracts')
          .update({ status })
          .eq('id', contractId);
        if (error) throw new Error(error.message);
      } catch (err) {
        console.warn('[ContractService] Supabase updateContractStatus note:', err);
      }
    }

    const idx = this.cachedContracts.findIndex(c => c.id === contractId);
    if (idx !== -1) {
      this.cachedContracts[idx].status = status;
      this.cachedContracts[idx].updatedAt = new Date().toISOString();
      this.saveLocalCache();
    }

    await this.addContractActivity(
      contractId,
      'status_changed',
      `Contract status updated from "${oldStatus}" to "${status}"`,
      actorName,
      { oldStatus, newStatus: status }
    );
  }

  // ============================================================================
  // MILESTONES CRUD
  // ============================================================================

  public async getMilestones(contractId?: string): Promise<ContractMilestoneRecord[]> {
    let rawMilestones: any[] = [];
    const allInvoices = await financeService.getInvoices();
    const invMap = new Map(allInvoices.map(i => [i.id, i.invoiceNumber]));

    if (supabase) {
      try {
        let query = supabase.from('contract_milestones').select('*').order('sequence_number', { ascending: true });
        if (contractId) query = query.eq('contract_id', contractId);
        const { data, error } = await query;
        if (!error && data) rawMilestones = data;
      } catch (e) {
        console.warn('[ContractService] Supabase milestones query fallback:', e);
      }
    }

    if (rawMilestones.length === 0 && this.cachedMilestones.length > 0) {
      rawMilestones = this.cachedMilestones.map(m => ({
        id: m.id,
        contract_id: m.contractId,
        title: m.title,
        description: m.description,
        sequence_number: m.sequenceNumber,
        status: m.status,
        start_date: m.startDate,
        due_date: m.dueDate,
        completed_at: m.completedAt,
        completion_percentage: m.completionPercentage,
        milestone_value: m.milestoneValue,
        currency_code: m.currencyCode,
        billing_type: m.billingType,
        invoice_id: m.invoiceId,
        notes: m.notes,
        created_at: m.createdAt,
        updated_at: m.updatedAt
      }));
    }

    const todayStr = new Date().toISOString().split('T')[0];

    let result: ContractMilestoneRecord[] = rawMilestones.map((row: any) => {
      const isOverdue = Boolean(
        row.due_date &&
        row.due_date < todayStr &&
        !['completed', 'cancelled'].includes(row.status)
      );

      return {
        id: row.id,
        contractId: row.contract_id,
        title: row.title,
        description: row.description || '',
        sequenceNumber: Number(row.sequence_number || 1),
        status: row.status || 'not_started',
        startDate: row.start_date || undefined,
        dueDate: row.due_date || undefined,
        completedAt: row.completed_at || null,
        completionPercentage: Number(row.completion_percentage || 0),
        milestoneValue: Number(row.milestone_value || 0),
        currencyCode: row.currency_code || undefined,
        billingType: row.billing_type || 'standard',
        invoiceId: row.invoice_id || null,
        invoiceNumber: row.invoice_id ? invMap.get(row.invoice_id) || 'Invoice Linked' : null,
        notes: row.notes || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isOverdue
      };
    });

    if (contractId) {
      result = result.filter(m => m.contractId === contractId);
    }

    this.cachedMilestones = result;
    this.saveLocalCache();
    return result;
  }

  public async createMilestone(
    input: Omit<ContractMilestoneRecord, 'id' | 'createdAt' | 'updatedAt' | 'isOverdue' | 'invoiceNumber'>,
    actorName: string = 'Admin Operator'
  ): Promise<ContractMilestoneRecord> {
    if (!input.contractId) throw new Error('Contract ID is required.');
    if (!input.title?.trim()) throw new Error('Milestone title is required.');

    const now = new Date().toISOString();
    let milestoneId = `ms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const payload = {
      contract_id: input.contractId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      sequence_number: input.sequenceNumber || 1,
      status: input.status || 'not_started',
      start_date: input.startDate || null,
      due_date: input.dueDate || null,
      completed_at: input.status === 'completed' ? now : null,
      completion_percentage: input.status === 'completed' ? 100 : (input.completionPercentage || 0),
      milestone_value: input.milestoneValue ? Math.round(input.milestoneValue * 100) / 100 : 0.00,
      currency_code: input.currencyCode || null,
      billing_type: input.billingType || 'standard',
      invoice_id: input.invoiceId || null,
      notes: input.notes?.trim() || null
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contract_milestones')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) milestoneId = data.id;
      } catch (err: any) {
        console.warn('[ContractService] Supabase createMilestone fallback:', err?.message);
      }
    }

    const created: ContractMilestoneRecord = {
      ...input,
      id: milestoneId,
      completionPercentage: payload.completion_percentage,
      completedAt: payload.completed_at,
      milestoneValue: payload.milestone_value,
      isOverdue: false,
      createdAt: now,
      updatedAt: now
    };

    this.cachedMilestones.push(created);
    this.saveLocalCache();

    await this.addContractActivity(
      input.contractId,
      'milestone_created',
      `Milestone #${created.sequenceNumber} "${created.title}" added to delivery roadmap`,
      actorName
    );

    return created;
  }

  public async updateMilestone(
    milestoneId: string,
    updates: Partial<Omit<ContractMilestoneRecord, 'id' | 'createdAt' | 'updatedAt' | 'isOverdue'>>,
    actorName: string = 'Admin Operator'
  ): Promise<ContractMilestoneRecord> {
    const existing = this.cachedMilestones.find(m => m.id === milestoneId);
    if (!existing) throw new Error('Milestone not found.');

    const now = new Date().toISOString();
    let completedAt = existing.completedAt;
    let completionPercentage = updates.completionPercentage !== undefined ? updates.completionPercentage : existing.completionPercentage;

    if (updates.status === 'completed' && existing.status !== 'completed') {
      completedAt = now;
      completionPercentage = 100;
    } else if (updates.status && updates.status !== 'completed' && existing.status === 'completed') {
      completedAt = null;
      if (completionPercentage === 100) completionPercentage = 75; // Re-opened milestone
    }

    const mappedUpdates = {
      ...updates,
      completedAt,
      completionPercentage,
      updatedAt: now
    };

    if (supabase) {
      try {
        const dbPayload: any = {};
        if (updates.title !== undefined) dbPayload.title = updates.title;
        if (updates.description !== undefined) dbPayload.description = updates.description;
        if (updates.sequenceNumber !== undefined) dbPayload.sequence_number = updates.sequenceNumber;
        if (updates.status !== undefined) dbPayload.status = updates.status;
        if (updates.startDate !== undefined) dbPayload.start_date = updates.startDate;
        if (updates.dueDate !== undefined) dbPayload.due_date = updates.dueDate;
        if (updates.milestoneValue !== undefined) dbPayload.milestone_value = updates.milestoneValue;
        if (updates.currencyCode !== undefined) dbPayload.currency_code = updates.currencyCode;
        if (updates.invoiceId !== undefined) dbPayload.invoice_id = updates.invoiceId;
        if (updates.notes !== undefined) dbPayload.notes = updates.notes;
        dbPayload.completed_at = completedAt;
        dbPayload.completion_percentage = completionPercentage;

        await supabase.from('contract_milestones').update(dbPayload).eq('id', milestoneId);
      } catch (e) {
        console.warn('[ContractService] Supabase updateMilestone note:', e);
      }
    }

    const updated: ContractMilestoneRecord = {
      ...existing,
      ...mappedUpdates
    };

    this.cachedMilestones = this.cachedMilestones.map(m => m.id === milestoneId ? updated : m);
    this.saveLocalCache();

    if (updates.status && updates.status !== existing.status) {
      await this.addContractActivity(
        existing.contractId,
        updates.status === 'completed' ? 'milestone_completed' : 'milestone_updated',
        `Milestone "${existing.title}" status changed to ${updates.status.toUpperCase()} (${completionPercentage}%)`,
        actorName
      );
    }

    return updated;
  }

  public async linkMilestoneInvoice(
    milestoneId: string,
    invoiceId: string | null,
    actorName: string = 'Admin Operator'
  ): Promise<void> {
    const milestone = this.cachedMilestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found.');

    await this.updateMilestone(milestoneId, { invoiceId }, actorName);

    await this.addContractActivity(
      milestone.contractId,
      invoiceId ? 'invoice_linked' : 'invoice_unlinked',
      invoiceId
        ? `Invoice linked to milestone "${milestone.title}"`
        : `Invoice unlinked from milestone "${milestone.title}"`,
      actorName
    );
  }

  // ============================================================================
  // AUDIT & ACTIVITIES
  // ============================================================================

  public async getContractActivities(contractId: string): Promise<ContractActivityRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contract_activities')
          .select('*')
          .eq('contract_id', contractId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            contractId: r.contract_id,
            type: r.type,
            description: r.description,
            actor: r.actor || 'System',
            metadata: r.metadata,
            createdAt: r.created_at
          }));
        }
      } catch (e) {
        console.warn('[ContractService] Supabase activities query fallback:', e);
      }
    }

    return this.cachedActivities
      .filter(a => a.contractId === contractId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async addContractActivity(
    contractId: string,
    type: string,
    description: string,
    actor: string = 'Admin Operator',
    metadata?: Record<string, any>
  ): Promise<void> {
    const now = new Date().toISOString();
    const act: ContractActivityRecord = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      contractId,
      type,
      description,
      actor,
      metadata,
      createdAt: now
    };

    if (supabase) {
      try {
        await supabase.from('contract_activities').insert({
          contract_id: contractId,
          type,
          description,
          actor,
          metadata
        });
      } catch (e) {
        console.warn('[ContractService] Supabase addContractActivity note:', e);
      }
    }

    this.cachedActivities.unshift(act);
    this.saveLocalCache();
  }

  // ============================================================================
  // CLIENT PORTAL SECURE VIEW (STRICT DATA BOUNDARY)
  // ============================================================================

  public async getClientPortalData(clientId: string): Promise<ClientPortalViewData | null> {
    const clients = await financeService.getClients();
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    const contracts = (await this.getContracts()).filter(c => c.clientId === clientId);
    const allMilestones = await this.getMilestones();
    const allInvoices = await financeService.getInvoices();

    return {
      organizationName: client.organizationName,
      contactName: client.name,
      email: client.email,
      contracts: contracts.map(c => {
        const cMilestones = allMilestones.filter(m => m.contractId === c.id);
        const cInvoices = allInvoices.filter(i => (i as any).contractId === c.id && i.status !== 'cancelled');

        return {
          id: c.id,
          contractNumber: c.contractNumber,
          title: c.title,
          contractType: c.contractType,
          status: c.status,
          startDate: c.startDate,
          endDate: c.endDate,
          currencyCode: c.currencyCode,
          contractValue: c.contractValue,
          overallProgressPercent: c.overallProgressPercent,
          milestones: cMilestones.map(m => ({
            id: m.id,
            title: m.title,
            sequenceNumber: m.sequenceNumber,
            status: m.status,
            dueDate: m.dueDate,
            completedAt: m.completedAt,
            completionPercentage: m.completionPercentage
          })),
          invoices: cInvoices.map(i => ({
            invoiceNumber: i.invoiceNumber,
            title: i.title,
            issueDate: i.issueDate,
            dueDate: i.dueDate,
            amountTotal: i.amountTotal,
            amountPaid: i.amountPaid,
            amountOutstanding: i.amountOutstanding,
            currencyCode: i.currencyCode,
            status: i.calculatedStatus
          }))
        };
      })
    };
  }
}

export const contractService = new ContractService();
