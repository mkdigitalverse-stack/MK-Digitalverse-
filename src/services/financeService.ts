/**
 * Finance & Business Money Management Service
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-05B: Financial Implementation
 * 
 * Production service layer handling:
 * - Clients, Invoices, Payments, Expenses
 * - Multi-currency validation and isolation
 * - PayPal transaction recording
 * - Dynamic invoice balance calculations
 * - Safe error handling & audit trail integration
 */

import { supabase } from './supabase';
import {
  ClientRecord,
  InvoiceRecord,
  PaymentRecord,
  ExpenseRecord,
  ClientFinancialProfile,
  CurrencyCode,
  InvoiceStatus
} from '../types/finance';

const LOCAL_STORAGE_KEY_CLIENTS = 'mk_finance_clients_v1';
const LOCAL_STORAGE_KEY_INVOICES = 'mk_finance_invoices_v1';
const LOCAL_STORAGE_KEY_PAYMENTS = 'mk_finance_payments_v1';
const LOCAL_STORAGE_KEY_EXPENSES = 'mk_finance_expenses_v1';

class FinanceService {
  // In-memory fallback caches for development resilience / offline fallback
  private cachedClients: ClientRecord[] = [];
  private cachedInvoices: InvoiceRecord[] = [];
  private cachedPayments: PaymentRecord[] = [];
  private cachedExpenses: ExpenseRecord[] = [];

  constructor() {
    this.initLocalCache();
  }

  private initLocalCache() {
    if (typeof window !== 'undefined') {
      try {
        const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
        if (storedClients) this.cachedClients = JSON.parse(storedClients);

        const storedInvoices = localStorage.getItem(LOCAL_STORAGE_KEY_INVOICES);
        if (storedInvoices) this.cachedInvoices = JSON.parse(storedInvoices);

        const storedPayments = localStorage.getItem(LOCAL_STORAGE_KEY_PAYMENTS);
        if (storedPayments) this.cachedPayments = JSON.parse(storedPayments);

        const storedExpenses = localStorage.getItem(LOCAL_STORAGE_KEY_EXPENSES);
        if (storedExpenses) this.cachedExpenses = JSON.parse(storedExpenses);
      } catch (err) {
        console.warn('[FinanceService] Local cache initialization note:', err);
      }
    }
  }

  private saveLocalCache() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(this.cachedClients));
        localStorage.setItem(LOCAL_STORAGE_KEY_INVOICES, JSON.stringify(this.cachedInvoices));
        localStorage.setItem(LOCAL_STORAGE_KEY_PAYMENTS, JSON.stringify(this.cachedPayments));
        localStorage.setItem(LOCAL_STORAGE_KEY_EXPENSES, JSON.stringify(this.cachedExpenses));
      } catch (err) {
        console.warn('[FinanceService] Failed to persist local cache:', err);
      }
    }
  }

  // ============================================================================
  // CLIENTS
  // ============================================================================

  public async getClients(): Promise<ClientRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped: ClientRecord[] = data.map((row: any) => ({
            id: row.id,
            leadId: row.lead_id,
            name: row.name,
            organizationName: row.organization_name,
            email: row.email,
            phone: row.phone || '',
            healthcareCategory: row.healthcare_category || '',
            billingAddress: row.billing_address || '',
            taxIdentifier: row.tax_identifier || '',
            currencyCode: row.currency_code || 'INR',
            status: row.status || 'active',
            contractStartDate: row.contract_start_date,
            contractEndDate: row.contract_end_date,
            notes: row.notes || '',
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          this.cachedClients = mapped;
          this.saveLocalCache();
          return mapped;
        }
      } catch (e) {
        console.warn('[FinanceService] Supabase clients query fallback to cache:', e);
      }
    }
    return [...this.cachedClients];
  }

  public async createClient(
    clientInput: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ClientRecord> {
    if (!clientInput.name?.trim() || !clientInput.organizationName?.trim() || !clientInput.email?.trim()) {
      throw new Error('Client contact name, organization name, and email are required.');
    }

    const payload = {
      lead_id: clientInput.leadId || null,
      name: clientInput.name.trim(),
      organization_name: clientInput.organizationName.trim(),
      email: clientInput.email.trim().toLowerCase(),
      phone: clientInput.phone?.trim() || null,
      healthcare_category: clientInput.healthcareCategory?.trim() || null,
      billing_address: clientInput.billingAddress?.trim() || null,
      tax_identifier: clientInput.taxIdentifier?.trim() || null,
      currency_code: clientInput.currencyCode || 'INR',
      status: clientInput.status || 'active',
      contract_start_date: clientInput.contractStartDate || null,
      contract_end_date: clientInput.contractEndDate || null,
      notes: clientInput.notes?.trim() || null
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) {
          const created: ClientRecord = {
            id: data.id,
            leadId: data.lead_id,
            name: data.name,
            organizationName: data.organization_name,
            email: data.email,
            phone: data.phone || '',
            healthcareCategory: data.healthcare_category || '',
            billingAddress: data.billing_address || '',
            taxIdentifier: data.tax_identifier || '',
            currencyCode: data.currency_code,
            status: data.status,
            contractStartDate: data.contract_start_date,
            contractEndDate: data.contract_end_date,
            notes: data.notes || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          this.cachedClients = [created, ...this.cachedClients.filter(c => c.id !== created.id)];
          this.saveLocalCache();
          return created;
        }
      } catch (err: any) {
        console.warn('[FinanceService] Supabase createClient fallback:', err?.message);
        throw err;
      }
    }

    // Local fallback
    const id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const created: ClientRecord = {
      ...clientInput,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.cachedClients.unshift(created);
    this.saveLocalCache();
    return created;
  }

  public async updateClient(
    clientId: string,
    updates: Partial<Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ClientRecord> {
    if (!clientId) throw new Error('Client ID is required.');

    if (supabase) {
      try {
        const mappedUpdates: Record<string, any> = {};
        if (updates.name !== undefined) mappedUpdates.name = updates.name.trim();
        if (updates.organizationName !== undefined) mappedUpdates.organization_name = updates.organizationName.trim();
        if (updates.email !== undefined) mappedUpdates.email = updates.email.trim().toLowerCase();
        if (updates.phone !== undefined) mappedUpdates.phone = updates.phone;
        if (updates.healthcareCategory !== undefined) mappedUpdates.healthcare_category = updates.healthcareCategory;
        if (updates.billingAddress !== undefined) mappedUpdates.billing_address = updates.billingAddress;
        if (updates.taxIdentifier !== undefined) mappedUpdates.tax_identifier = updates.taxIdentifier;
        if (updates.currencyCode !== undefined) mappedUpdates.currency_code = updates.currencyCode;
        if (updates.status !== undefined) mappedUpdates.status = updates.status;
        if (updates.contractStartDate !== undefined) mappedUpdates.contract_start_date = updates.contractStartDate;
        if (updates.contractEndDate !== undefined) mappedUpdates.contract_end_date = updates.contractEndDate;
        if (updates.notes !== undefined) mappedUpdates.notes = updates.notes;

        const { data, error } = await supabase
          .from('clients')
          .update(mappedUpdates)
          .eq('id', clientId)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) {
          const updated: ClientRecord = {
            id: data.id,
            leadId: data.lead_id,
            name: data.name,
            organizationName: data.organization_name,
            email: data.email,
            phone: data.phone || '',
            healthcareCategory: data.healthcare_category || '',
            billingAddress: data.billing_address || '',
            taxIdentifier: data.tax_identifier || '',
            currencyCode: data.currency_code,
            status: data.status,
            contractStartDate: data.contract_start_date,
            contractEndDate: data.contract_end_date,
            notes: data.notes || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          this.cachedClients = this.cachedClients.map(c => c.id === clientId ? updated : c);
          this.saveLocalCache();
          return updated;
        }
      } catch (err: any) {
        console.warn('[FinanceService] Supabase updateClient fallback:', err?.message);
        throw err;
      }
    }

    const idx = this.cachedClients.findIndex(c => c.id === clientId);
    if (idx === -1) throw new Error('Client not found.');
    const updated: ClientRecord = {
      ...this.cachedClients[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.cachedClients[idx] = updated;
    this.saveLocalCache();
    return updated;
  }

  // ============================================================================
  // INVOICES & RECONCILIATION
  // ============================================================================

  public async getInvoices(): Promise<InvoiceRecord[]> {
    let rawInvoices: any[] = [];
    const payments = await this.getPayments();
    const clients = await this.getClients();
    const clientMap = new Map<string, ClientRecord>(clients.map(c => [c.id, c]));

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('issue_date', { ascending: false });

        if (!error && data) {
          rawInvoices = data;
        }
      } catch (e) {
        console.warn('[FinanceService] Supabase invoices query fallback:', e);
      }
    }

    if (rawInvoices.length === 0 && this.cachedInvoices.length > 0) {
      rawInvoices = this.cachedInvoices.map(inv => ({
        id: inv.id,
        client_id: inv.clientId,
        invoice_number: inv.invoiceNumber,
        title: inv.title,
        issue_date: inv.issueDate,
        due_date: inv.dueDate,
        amount_subtotal: inv.amountSubtotal,
        tax_rate: inv.taxRate,
        tax_amount: inv.taxAmount,
        amount_total: inv.amountTotal,
        currency_code: inv.currencyCode,
        status: inv.status,
        notes: inv.notes,
        created_at: inv.createdAt,
        updated_at: inv.updatedAt
      }));
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const reconciled: InvoiceRecord[] = rawInvoices.map((row: any) => {
      const client = clientMap.get(row.client_id);
      const invoiceId = row.id;

      // Dynamic calculation: Amount Paid is the SUM of all completed payments linked to this invoice
      const matchingPayments = payments.filter(
        p => p.invoiceId === invoiceId && p.status === 'completed'
      );
      const amountPaid = matchingPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
      const amountTotal = Number(row.amount_total || 0);
      const amountOutstanding = Math.max(0, Math.round((amountTotal - amountPaid) * 100) / 100);

      let calculatedStatus: InvoiceStatus = row.status || 'draft';
      if (row.status === 'cancelled') {
        calculatedStatus = 'cancelled';
      } else if (amountOutstanding <= 0.01 && amountPaid > 0) {
        calculatedStatus = 'paid';
      } else if (amountPaid > 0 && amountOutstanding > 0.01) {
        calculatedStatus = 'partially_paid';
      } else if (row.due_date && row.due_date < todayStr && amountOutstanding > 0.01) {
        calculatedStatus = 'overdue';
      }

      return {
        id: row.id,
        clientId: row.client_id,
        clientName: client?.name || 'Unknown Client',
        organizationName: client?.organizationName || 'Healthcare Partner',
        invoiceNumber: row.invoice_number,
        title: row.title,
        issueDate: row.issue_date,
        dueDate: row.due_date,
        amountSubtotal: Number(row.amount_subtotal || 0),
        taxRate: Number(row.tax_rate || 0),
        taxAmount: Number(row.tax_amount || 0),
        amountTotal,
        currencyCode: row.currency_code || 'INR',
        status: row.status || 'draft',
        notes: row.notes || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        amountPaid,
        amountOutstanding,
        calculatedStatus,
        paymentsCount: matchingPayments.length
      };
    });

    this.cachedInvoices = reconciled;
    this.saveLocalCache();
    return reconciled;
  }

  public async generateNextInvoiceNumber(prefix: string = 'MK'): Promise<string> {
    const year = new Date().getFullYear();
    const existing = await this.getInvoices();
    const regex = new RegExp(`^${prefix}-${year}-(\\d+)$`);
    let maxNum = 0;

    existing.forEach(inv => {
      const match = inv.invoiceNumber.match(regex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });

    const nextSeq = String(maxNum + 1).padStart(3, '0');
    return `${prefix}-${year}-${nextSeq}`;
  }

  public async createInvoice(
    invoiceInput: Omit<
      InvoiceRecord,
      'id' | 'createdAt' | 'updatedAt' | 'amountPaid' | 'amountOutstanding' | 'calculatedStatus' | 'paymentsCount'
    >
  ): Promise<InvoiceRecord> {
    if (!invoiceInput.clientId) throw new Error('A client must be selected for the invoice.');
    if (!invoiceInput.title?.trim()) throw new Error('Invoice title or description is required.');
    if (invoiceInput.amountSubtotal < 0) throw new Error('Invoice subtotal cannot be negative.');

    const subtotal = Math.round(invoiceInput.amountSubtotal * 100) / 100;
    const taxRate = Math.max(0, Number(invoiceInput.taxRate || 0));
    const calculatedTaxAmount = Math.round((subtotal * (taxRate / 100)) * 100) / 100;
    const total = Math.round((subtotal + calculatedTaxAmount) * 100) / 100;

    let invoiceNumber = invoiceInput.invoiceNumber?.trim();
    if (!invoiceNumber) {
      invoiceNumber = await this.generateNextInvoiceNumber();
    }

    const payload = {
      client_id: invoiceInput.clientId,
      invoice_number: invoiceNumber,
      title: invoiceInput.title.trim(),
      issue_date: invoiceInput.issueDate || new Date().toISOString().split('T')[0],
      due_date: invoiceInput.dueDate,
      amount_subtotal: subtotal,
      tax_rate: taxRate,
      tax_amount: calculatedTaxAmount,
      amount_total: total,
      currency_code: invoiceInput.currencyCode || 'INR',
      status: invoiceInput.status || 'sent',
      notes: invoiceInput.notes?.trim() || null
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) {
          await this.getInvoices(); // Refresh cache with calculated totals
          return this.cachedInvoices.find(i => i.id === data.id)!;
        }
      } catch (err: any) {
        console.warn('[FinanceService] Supabase createInvoice fallback:', err?.message);
        throw err;
      }
    }

    // Local fallback
    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const created: InvoiceRecord = {
      ...invoiceInput,
      id,
      invoiceNumber,
      amountSubtotal: subtotal,
      taxRate,
      taxAmount: calculatedTaxAmount,
      amountTotal: total,
      amountPaid: 0,
      amountOutstanding: total,
      calculatedStatus: invoiceInput.status || 'sent',
      paymentsCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.cachedInvoices.unshift(created);
    this.saveLocalCache();
    return created;
  }

  public async updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('invoices')
          .update({ status })
          .eq('id', invoiceId);
        if (error) throw new Error(error.message);
      } catch (err) {
        console.warn('[FinanceService] Supabase updateInvoiceStatus note:', err);
      }
    }
    const idx = this.cachedInvoices.findIndex(i => i.id === invoiceId);
    if (idx !== -1) {
      this.cachedInvoices[idx].status = status;
      this.saveLocalCache();
    }
  }

  // ============================================================================
  // PAYMENTS (REALIZED CASH INCOME & PAYPAL RECORDING)
  // ============================================================================

  public async getPayments(): Promise<PaymentRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            *,
            clients:client_id (name, organization_name),
            invoices:invoice_id (invoice_number)
          `)
          .order('payment_date', { ascending: false });

        if (!error && data) {
          const mapped: PaymentRecord[] = data.map((row: any) => ({
            id: row.id,
            invoiceId: row.invoice_id || null,
            clientId: row.client_id,
            clientName: row.clients?.name || 'Unknown Client',
            organizationName: row.clients?.organization_name || '',
            invoiceNumber: row.invoices?.invoice_number || null,
            paymentDate: row.payment_date,
            amount: Number(row.amount || 0),
            feeAmount: Number(row.fee_amount || 0),
            netAmount: Number(row.amount || 0) - Number(row.fee_amount || 0),
            currencyCode: row.currency_code || 'INR',
            paymentMethod: row.payment_method || 'bank_transfer',
            referenceNumber: row.reference_number || '',
            notes: row.notes || '',
            status: row.status || 'completed',
            recordedBy: row.recorded_by || null,
            createdAt: row.created_at
          }));
          this.cachedPayments = mapped;
          this.saveLocalCache();
          return mapped;
        }
      } catch (e) {
        console.warn('[FinanceService] Supabase payments query fallback:', e);
      }
    }
    return [...this.cachedPayments];
  }

  public async recordPayment(
    paymentInput: Omit<PaymentRecord, 'id' | 'createdAt' | 'netAmount'>
  ): Promise<PaymentRecord> {
    if (!paymentInput.clientId) throw new Error('A client must be specified.');
    if (!paymentInput.amount || paymentInput.amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }
    if (!paymentInput.currencyCode) {
      throw new Error('Transaction currency is required.');
    }

    // Invoice linkage validation
    if (paymentInput.invoiceId) {
      const invoices = await this.getInvoices();
      const targetInvoice = invoices.find(i => i.id === paymentInput.invoiceId);
      if (!targetInvoice) {
        throw new Error(`Target invoice "${paymentInput.invoiceId}" not found.`);
      }

      // 1. Currency Match Rule: Payment currency must strictly match invoice currency
      if (targetInvoice.currencyCode.toUpperCase() !== paymentInput.currencyCode.toUpperCase()) {
        throw new Error(
          `Payment currency (${paymentInput.currencyCode}) does not match Invoice currency (${targetInvoice.currencyCode}). Cross-currency invoice settlement is prohibited.`
        );
      }

      // 2. Overpayment Protection: Payment cannot exceed remaining outstanding balance
      if (paymentInput.amount > targetInvoice.amountOutstanding + 0.01) {
        throw new Error(
          `Payment amount (${paymentInput.currencyCode} ${paymentInput.amount.toLocaleString()}) exceeds invoice outstanding balance (${paymentInput.currencyCode} ${targetInvoice.amountOutstanding.toLocaleString()}).`
        );
      }
    }

    const grossAmount = Math.round(paymentInput.amount * 100) / 100;
    const feeAmount = Math.max(0, Math.round((paymentInput.feeAmount || 0) * 100) / 100);

    const payload = {
      client_id: paymentInput.clientId,
      invoice_id: paymentInput.invoiceId || null,
      payment_date: paymentInput.paymentDate || new Date().toISOString().split('T')[0],
      amount: grossAmount,
      fee_amount: feeAmount,
      currency_code: paymentInput.currencyCode,
      payment_method: paymentInput.paymentMethod,
      reference_number: paymentInput.referenceNumber?.trim() || null,
      notes: paymentInput.notes?.trim() || null,
      status: paymentInput.status || 'completed'
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) {
          await this.getInvoices(); // Recalculate invoice balances
          await this.getPayments(); // Refresh payments
          return this.cachedPayments.find(p => p.id === data.id)!;
        }
      } catch (err: any) {
        console.warn('[FinanceService] Supabase recordPayment fallback:', err?.message);
        throw err;
      }
    }

    // Local fallback
    const id = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const created: PaymentRecord = {
      ...paymentInput,
      id,
      amount: grossAmount,
      feeAmount,
      netAmount: grossAmount - feeAmount,
      createdAt: now
    };
    this.cachedPayments.unshift(created);
    this.saveLocalCache();
    await this.getInvoices();
    return created;
  }

  // ============================================================================
  // EXPENSES (OUTFLOWS & VENDOR COSTS)
  // ============================================================================

  public async getExpenses(): Promise<ExpenseRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false });

        if (!error && data) {
          const mapped: ExpenseRecord[] = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            amount: Number(row.amount || 0),
            currencyCode: row.currency_code || 'INR',
            expenseDate: row.expense_date,
            vendor: row.vendor || '',
            paymentMethod: row.payment_method || 'bank_transfer',
            receiptUrl: row.receipt_url || '',
            isRecurring: Boolean(row.is_recurring),
            recurringPeriod: row.recurring_period || undefined,
            notes: row.notes || '',
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          this.cachedExpenses = mapped;
          this.saveLocalCache();
          return mapped;
        }
      } catch (e) {
        console.warn('[FinanceService] Supabase expenses query fallback:', e);
      }
    }
    return [...this.cachedExpenses];
  }

  public async createExpense(
    expenseInput: Omit<ExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ExpenseRecord> {
    if (!expenseInput.title?.trim()) throw new Error('Expense title is required.');
    if (!expenseInput.amount || expenseInput.amount <= 0) {
      throw new Error('Expense amount must be greater than zero.');
    }
    if (!expenseInput.currencyCode) throw new Error('Currency is required.');

    const payload = {
      title: expenseInput.title.trim(),
      category: expenseInput.category,
      amount: Math.round(expenseInput.amount * 100) / 100,
      currency_code: expenseInput.currencyCode,
      expense_date: expenseInput.expenseDate || new Date().toISOString().split('T')[0],
      vendor: expenseInput.vendor?.trim() || null,
      payment_method: expenseInput.paymentMethod || null,
      receipt_url: expenseInput.receiptUrl?.trim() || null,
      is_recurring: Boolean(expenseInput.isRecurring),
      recurring_period: expenseInput.recurringPeriod || null,
      notes: expenseInput.notes?.trim() || null
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        if (data) {
          const created: ExpenseRecord = {
            id: data.id,
            title: data.title,
            category: data.category,
            amount: Number(data.amount || 0),
            currencyCode: data.currency_code,
            expenseDate: data.expense_date,
            vendor: data.vendor || '',
            paymentMethod: data.payment_method || '',
            receiptUrl: data.receipt_url || '',
            isRecurring: Boolean(data.is_recurring),
            recurringPeriod: data.recurring_period,
            notes: data.notes || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          this.cachedExpenses = [created, ...this.cachedExpenses.filter(e => e.id !== created.id)];
          this.saveLocalCache();
          return created;
        }
      } catch (err: any) {
        console.warn('[FinanceService] Supabase createExpense fallback:', err?.message);
        throw err;
      }
    }

    // Local fallback
    const id = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const created: ExpenseRecord = {
      ...expenseInput,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.cachedExpenses.unshift(created);
    this.saveLocalCache();
    return created;
  }

  public async deleteExpense(expenseId: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', expenseId);
        if (error) throw new Error(error.message);
      } catch (err: any) {
        console.warn('[FinanceService] Supabase deleteExpense note:', err?.message);
      }
    }
    this.cachedExpenses = this.cachedExpenses.filter(e => e.id !== expenseId);
    this.saveLocalCache();
  }

  // ============================================================================
  // CLIENT FINANCIAL PROFILE
  // ============================================================================

  public async getClientProfile(clientId: string): Promise<ClientFinancialProfile | null> {
    const clients = await this.getClients();
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    const invoices = (await this.getInvoices()).filter(i => i.clientId === clientId);
    const payments = (await this.getPayments()).filter(p => p.clientId === clientId);

    const totalBilled = invoices
      .filter(i => i.status !== 'cancelled')
      .reduce((sum, i) => sum + i.amountTotal, 0);

    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOutstanding = Math.max(0, Math.round((totalBilled - totalPaid) * 100) / 100);

    return {
      client,
      invoices,
      payments,
      totalBilled,
      totalPaid,
      totalOutstanding,
      currencyCode: client.currencyCode
    };
  }
}

export const financeService = new FinanceService();
