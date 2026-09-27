/**
 * Lead Operations & Export Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-03: Lead Operations & CSV Export
 * 
 * Strict Read-Only Export Architecture:
 * - RFC-4180 compliant CSV formatting with UTF-8 BOM for Microsoft Excel compatibility
 * - Accurate source-of-truth export using public.leads.status
 * - Never fabricates values; null/undefined values produce blank cells
 * - Preserves filtering, search, and table sort order
 */

import { CompleteLeadRecord } from './qualification';

export interface CsvColumnDefinition {
  header: string;
  getValue: (lead: CompleteLeadRecord) => string | number | null | undefined;
}

export const LEAD_EXPORT_COLUMNS: CsvColumnDefinition[] = [
  {
    header: 'Name',
    getValue: (lead) => lead.visitorData?.contactName || ''
  },
  {
    header: 'Email',
    getValue: (lead) => lead.visitorData?.email || ''
  },
  {
    header: 'Phone',
    getValue: (lead) => lead.visitorData?.phone || ''
  },
  {
    header: 'Organization',
    getValue: (lead) => lead.visitorData?.organizationName || ''
  },
  {
    header: 'Website',
    getValue: (lead) => lead.visitorData?.website || ''
  },
  {
    header: 'Location',
    getValue: (lead) => lead.visitorData?.location || ''
  },
  {
    header: 'Lead Type',
    getValue: (lead) => lead.visitorData?.leadType || ''
  },
  {
    header: 'Healthcare Category',
    getValue: (lead) => lead.visitorData?.healthcareCategory || ''
  },
  {
    header: 'Biggest Challenge',
    getValue: (lead) => lead.visitorData?.biggestChallenge || ''
  },
  {
    header: 'Growth Objective',
    getValue: (lead) => lead.visitorData?.growthObjective || ''
  },
  {
    header: 'Investment Readiness',
    getValue: (lead) => lead.visitorData?.investmentReadiness || ''
  },
  {
    header: 'Fit Status',
    getValue: (lead) => lead.qualification?.fitStatus || ''
  },
  {
    header: 'Fit Score',
    getValue: (lead) => (typeof lead.qualification?.fitScore === 'number' ? lead.qualification.fitScore : '')
  },
  {
    header: 'Intent Level',
    getValue: (lead) => lead.qualification?.intentLevel || ''
  },
  {
    header: 'Priority',
    getValue: (lead) => lead.qualification?.leadPriority || ''
  },
  {
    header: 'Growth Stage',
    getValue: (lead) => lead.qualification?.growthStage || ''
  },
  {
    header: 'Challenge Category',
    getValue: (lead) => lead.qualification?.challengeCategory || ''
  },
  {
    header: 'Pipeline Status',
    // public.leads.status is the single source of truth. Always use 'negotiations' (plural).
    getValue: (lead) => {
      const rawStatus: string = lead.status || '';
      return rawStatus === 'negotiation' ? 'negotiations' : rawStatus;
    }
  },
  {
    header: 'Assigned To',
    getValue: (lead) => lead.qualification?.assignedTo || ''
  },
  {
    header: 'UTM Source',
    getValue: (lead) => lead.visitorData?.utm_source || ''
  },
  {
    header: 'UTM Medium',
    getValue: (lead) => lead.visitorData?.utm_medium || ''
  },
  {
    header: 'UTM Campaign',
    getValue: (lead) => lead.visitorData?.utm_campaign || ''
  },
  {
    header: 'GCLID',
    getValue: (lead) => lead.visitorData?.gclid || ''
  },
  {
    header: 'FBCLID',
    getValue: (lead) => lead.visitorData?.fbclid || ''
  },
  {
    header: 'Landing Page',
    getValue: (lead) => lead.visitorData?.landingPage || ''
  },
  {
    header: 'Referrer',
    getValue: (lead) => lead.visitorData?.referrer || ''
  },
  {
    header: 'Created At',
    getValue: (lead) => lead.createdAt || ''
  },
  {
    header: 'Updated At',
    getValue: (lead) => lead.updatedAt || ''
  }
];

/**
 * Escapes a cell string for RFC-4180 compliant CSV.
 */
function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str === '') {
    return '';
  }

  // Check if quoting is needed
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an RFC-4180 CSV string from an array of CompleteLeadRecord items.
 */
export function generateLeadsCsv(leads: CompleteLeadRecord[]): string {
  const headerRow = LEAD_EXPORT_COLUMNS.map((col) => escapeCsvCell(col.header)).join(',');

  const rows = leads.map((lead) => {
    return LEAD_EXPORT_COLUMNS.map((col) => escapeCsvCell(col.getValue(lead))).join(',');
  });

  // Prepend UTF-8 Byte Order Mark (\uFEFF) for Excel compatibility
  return `\uFEFF${[headerRow, ...rows].join('\r\n')}\r\n`;
}

/**
 * Triggers a browser download of the CSV content.
 */
export function downloadCsvFile(csvContent: string, fileName: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', fileName);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Export execution helper for leads with automated sanitized timestamped filenames.
 */
export function exportLeadsToCsv(
  leads: CompleteLeadRecord[], 
  type: 'filtered' | 'selected' | 'all' = 'filtered',
  filterSummary?: string
): { success: boolean; rowCount: number; fileName: string } {
  if (!leads || leads.length === 0) {
    return { success: false, rowCount: 0, fileName: '' };
  }

  const dateStamp = new Date().toISOString().split('T')[0];
  const count = leads.length;
  
  let fileName = `mk-digitalverse-leads-${type}-${dateStamp}.csv`;
  if (type === 'selected') {
    fileName = `mk-digitalverse-leads-selected-${count}-${dateStamp}.csv`;
  } else if (type === 'filtered' && filterSummary) {
    const cleanSummary = filterSummary.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    fileName = `mk-digitalverse-leads-filtered-${cleanSummary}-${dateStamp}.csv`;
  }

  const csv = generateLeadsCsv(leads);
  downloadCsvFile(csv, fileName);

  return {
    success: true,
    rowCount: leads.length,
    fileName
  };
}
