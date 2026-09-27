/**
 * Safe Reporting Date Range Engine
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * ADM-04: Sales & Business Reporting System
 * 
 * Provides deterministic, boundary-safe calendar date math for CRM reporting:
 * - Safe calendar boundaries (e.g. This Month = 1st of month to now, Prev Month = 1st to last day)
 * - Safe matching previous comparison periods (e.g. This Month vs Previous Month)
 * - Percentage change calculations with strict validation (never fabricates 0% or +∞% on empty prior data)
 */

export type ReportingPeriod =
  | 'today'
  | '7days'
  | '30days'
  | 'this_week'
  | 'prev_week'
  | 'this_month'
  | 'prev_month'
  | 'this_year'
  | 'prev_year'
  | 'custom'
  | 'all';

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

export interface ReportingDateContext {
  period: ReportingPeriod;
  currentRange: DateRange;
  previousRange: DateRange | null;
  customStartDate?: string;
  customEndDate?: string;
}

export interface PercentageChangeResult {
  percent: number | null;
  direction: 'up' | 'down' | 'flat' | 'none';
  formattedText: string;
  hasValidComparison: boolean;
}

export class ReportingDateService {
  /**
   * Resolves the current date range and safe prior comparison date range
   * for a given reporting period.
   */
  public static resolveDateContext(
    period: ReportingPeriod,
    customStart?: string,
    customEnd?: string,
    referenceDate: Date = new Date()
  ): ReportingDateContext {
    const now = new Date(referenceDate);
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const day = now.getDate();

    let currentStart: Date;
    let currentEnd: Date = new Date(now);
    let currentLabel = '';

    let prevStart: Date | null = null;
    let prevEnd: Date | null = null;
    let prevLabel = '';

    switch (period) {
      case 'today': {
        currentStart = new Date(year, month, day, 0, 0, 0, 0);
        currentEnd = new Date(year, month, day, 23, 59, 59, 999);
        currentLabel = this.formatDate(currentStart);

        prevStart = new Date(year, month, day - 1, 0, 0, 0, 0);
        prevEnd = new Date(year, month, day - 1, 23, 59, 59, 999);
        prevLabel = 'Yesterday';
        break;
      }

      case '7days': {
        currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        currentStart.setHours(0, 0, 0, 0);
        currentLabel = `${this.formatDate(currentStart)} – ${this.formatDate(currentEnd)}`;

        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(currentStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevLabel = 'Prior 7 Days';
        break;
      }

      case '30days': {
        currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        currentStart.setHours(0, 0, 0, 0);
        currentLabel = `${this.formatDate(currentStart)} – ${this.formatDate(currentEnd)}`;

        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(currentStart.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevLabel = 'Prior 30 Days';
        break;
      }

      case 'this_week': {
        // Week starts Monday (ISO)
        const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        currentStart = new Date(year, month, day + diffToMonday, 0, 0, 0, 0);
        currentLabel = `This Week (${this.formatDate(currentStart)} – Today)`;

        prevStart = new Date(year, month, day + diffToMonday - 7, 0, 0, 0, 0);
        prevEnd = new Date(year, month, day + diffToMonday - 1, 23, 59, 59, 999);
        prevLabel = 'Previous Week';
        break;
      }

      case 'prev_week': {
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        currentStart = new Date(year, month, day + diffToMonday - 7, 0, 0, 0, 0);
        currentEnd = new Date(year, month, day + diffToMonday - 1, 23, 59, 59, 999);
        currentLabel = `Previous Week (${this.formatDate(currentStart)} – ${this.formatDate(currentEnd)})`;

        prevStart = new Date(year, month, day + diffToMonday - 14, 0, 0, 0, 0);
        prevEnd = new Date(year, month, day + diffToMonday - 8, 23, 59, 59, 999);
        prevLabel = '2 Weeks Ago';
        break;
      }

      case 'this_month': {
        currentStart = new Date(year, month, 1, 0, 0, 0, 0);
        currentLabel = `This Month (${currentStart.toLocaleString('default', { month: 'short' })} 1 – Today)`;

        // Previous month calendar bounds
        prevStart = new Date(year, month - 1, 1, 0, 0, 0, 0);
        prevEnd = new Date(year, month, 0, 23, 59, 59, 999); // last day of previous month
        prevLabel = prevStart.toLocaleString('default', { month: 'short', year: 'numeric' });
        break;
      }

      case 'prev_month': {
        currentStart = new Date(year, month - 1, 1, 0, 0, 0, 0);
        currentEnd = new Date(year, month, 0, 23, 59, 59, 999);
        currentLabel = currentStart.toLocaleString('default', { month: 'long', year: 'numeric' });

        prevStart = new Date(year, month - 2, 1, 0, 0, 0, 0);
        prevEnd = new Date(year, month - 1, 0, 23, 59, 59, 999);
        prevLabel = prevStart.toLocaleString('default', { month: 'short', year: 'numeric' });
        break;
      }

      case 'this_year': {
        currentStart = new Date(year, 0, 1, 0, 0, 0, 0);
        currentLabel = `Year to Date (${year})`;

        prevStart = new Date(year - 1, 0, 1, 0, 0, 0, 0);
        prevEnd = new Date(year - 1, 11, 31, 23, 59, 59, 999);
        prevLabel = `Full Year ${year - 1}`;
        break;
      }

      case 'prev_year': {
        currentStart = new Date(year - 1, 0, 1, 0, 0, 0, 0);
        currentEnd = new Date(year - 1, 11, 31, 23, 59, 59, 999);
        currentLabel = `Full Year ${year - 1}`;

        prevStart = new Date(year - 2, 0, 1, 0, 0, 0, 0);
        prevEnd = new Date(year - 2, 11, 31, 23, 59, 59, 999);
        prevLabel = `Full Year ${year - 2}`;
        break;
      }

      case 'custom': {
        if (customStart && customEnd) {
          currentStart = new Date(customStart);
          currentStart.setHours(0, 0, 0, 0);
          currentEnd = new Date(customEnd);
          currentEnd.setHours(23, 59, 59, 999);
        } else {
          // Fallback to last 30 days if not set
          currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          currentStart.setHours(0, 0, 0, 0);
        }

        const durationMs = currentEnd.getTime() - currentStart.getTime();
        currentLabel = `${this.formatDate(currentStart)} – ${this.formatDate(currentEnd)}`;

        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - durationMs);
        prevLabel = 'Prior Equivalent Period';
        break;
      }

      case 'all':
      default: {
        currentStart = new Date(2020, 0, 1, 0, 0, 0, 0);
        currentEnd = new Date(now);
        currentLabel = 'All Time';
        prevStart = null;
        prevEnd = null;
        prevLabel = '';
        break;
      }
    }

    return {
      period,
      currentRange: {
        start: currentStart,
        end: currentEnd,
        label: currentLabel
      },
      previousRange: prevStart && prevEnd ? {
        start: prevStart,
        end: prevEnd,
        label: prevLabel
      } : null,
      customStartDate: customStart,
      customEndDate: customEnd
    };
  }

  /**
   * Filters records whose createdAt timestamp falls within the date range.
   */
  public static filterRecordsByRange<T extends { createdAt?: string }>(
    records: T[],
    range: DateRange | null
  ): T[] {
    if (!range) return [];
    const startTime = range.start.getTime();
    const endTime = range.end.getTime();

    return records.filter((rec) => {
      if (!rec.createdAt) return false;
      const recTime = new Date(rec.createdAt).getTime();
      return !isNaN(recTime) && recTime >= startTime && recTime <= endTime;
    });
  }

  /**
   * Strictly calculates percentage change between two values.
   * If previousValue is 0 or null/undefined, or there is no previous period,
   * returns hasValidComparison: false and no fake % change.
   */
  public static calculatePercentageChange(
    currentVal: number,
    previousVal: number | null | undefined
  ): PercentageChangeResult {
    if (previousVal === null || previousVal === undefined || previousVal === 0 || isNaN(previousVal)) {
      return {
        percent: null,
        direction: 'none',
        formattedText: 'No prior data',
        hasValidComparison: false
      };
    }

    const change = ((currentVal - previousVal) / previousVal) * 100;
    const rounded = Math.round(change * 10) / 10;

    let direction: 'up' | 'down' | 'flat' = 'flat';
    let sign = '';

    if (rounded > 0) {
      direction = 'up';
      sign = '+';
    } else if (rounded < 0) {
      direction = 'down';
    }

    return {
      percent: rounded,
      direction,
      formattedText: `${sign}${rounded}%`,
      hasValidComparison: true
    };
  }

  /**
   * Formats a date into a clean, human-readable string (e.g. 'Sep 27, 2026').
   */
  public static formatDate(d: Date): string {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
