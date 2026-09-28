/**
 * Contract & Milestone CSV Export Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-06: Client Portal & Contract Milestones
 * 
 * Strict Read-Only Export Architecture:
 * - RFC-4180 compliant CSV formatting with UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
 * - Accurate source data export (Contracts & Milestones)
 * - Quotes escaping, null safety, and human-readable formats
 */

import { ContractRecord, ContractMilestoneRecord, CONTRACT_TYPE_LABELS, CONTRACT_STATUS_LABELS, MILESTONE_STATUS_LABELS } from '../types/contracts';

function escapeCsvField(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function triggerDownload(csvContent: string, filename: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export class ContractExportService {
  /**
   * Builds RFC-4180 CSV string with UTF-8 BOM for Contracts
   */
  public static buildContractsCsv(contracts: ContractRecord[]): string {
    const headers = [
      'Contract Number',
      'Client Contact',
      'Organization',
      'Contract Title',
      'Contract Type',
      'Status',
      'Start Date',
      'End Date',
      'Currency',
      'Contract Value',
      'Billed (Invoices)',
      'Paid (Realized)',
      'Outstanding AR',
      'Unbilled Value',
      'Overall Progress (%)',
      'Billing Frequency',
      'Payment Terms (Days)',
      'Auto Renew',
      'Renewal Date',
      'Milestones Count',
      'Completed Milestones',
      'Notes',
      'Created At'
    ];

    const rows = contracts.map(c => [
      c.contractNumber,
      c.clientName || '',
      c.organizationName || '',
      c.title,
      CONTRACT_TYPE_LABELS[c.contractType] || c.contractType,
      CONTRACT_STATUS_LABELS[c.status] || c.status,
      c.startDate || '',
      c.endDate || '',
      c.currencyCode,
      c.contractValue.toFixed(2),
      c.totalBilled.toFixed(2),
      c.totalPaid.toFixed(2),
      c.totalOutstanding.toFixed(2),
      c.unbilledContractValue.toFixed(2),
      `${c.overallProgressPercent}%`,
      c.billingFrequency,
      c.paymentTermsDays,
      c.autoRenew ? 'YES' : 'NO',
      c.renewalDate || '',
      c.milestonesCount,
      c.completedMilestonesCount,
      c.notes || '',
      c.createdAt
    ]);

    const csvBody = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.map(escapeCsvField).join(','))].join('\r\n');
    return '\uFEFF' + csvBody;
  }

  /**
   * Export Contracts to CSV (triggers browser download)
   */
  public static exportContracts(contracts: ContractRecord[]) {
    const csvWithBom = this.buildContractsCsv(contracts);
    const safeDate = new Date().toISOString().split('T')[0];
    triggerDownload(csvWithBom, `mk_digitalverse_contracts_${safeDate}.csv`);
  }

  /**
   * Builds RFC-4180 CSV string with UTF-8 BOM for Milestones
   */
  public static buildMilestonesCsv(milestones: ContractMilestoneRecord[], contractNumber: string = 'All'): string {
    const headers = [
      'Milestone Title',
      'Sequence #',
      'Contract Number',
      'Status',
      'Start Date',
      'Due Date',
      'Completed Date',
      'Completion (%)',
      'Milestone Value',
      'Currency',
      'Linked Invoice #',
      'Description',
      'Notes'
    ];

    const rows = milestones.map(m => [
      m.title,
      m.sequenceNumber,
      contractNumber,
      MILESTONE_STATUS_LABELS[m.status] || m.status,
      m.startDate || '',
      m.dueDate || '',
      m.completedAt || '',
      `${m.completionPercentage}%`,
      m.milestoneValue ? m.milestoneValue.toFixed(2) : '0.00',
      m.currencyCode || '',
      m.invoiceNumber || '',
      m.description || '',
      m.notes || ''
    ]);

    const csvBody = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.map(escapeCsvField).join(','))].join('\r\n');
    return '\uFEFF' + csvBody;
  }

  /**
   * Export Milestones to CSV (triggers browser download)
   */
  public static exportMilestones(milestones: ContractMilestoneRecord[], contractNumber: string = 'All') {
    const csvWithBom = this.buildMilestonesCsv(milestones, contractNumber);
    const safeDate = new Date().toISOString().split('T')[0];
    triggerDownload(csvWithBom, `mk_digitalverse_milestones_${safeDate}.csv`);
  }
}
