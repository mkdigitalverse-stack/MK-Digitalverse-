/**
 * MK DIGITALVERSE — ADM-09 Follow-Up Scheduling & Timezone Utility
 * 
 * Ensures consistent parsing, comparison, and formatting of follow-up dates and times.
 * Avoids browser-shifting anomalies across navigation, reloads, and database updates.
 */

/**
 * Combines standard YYYY-MM-DD date and HH:mm time into an ISO-8601 UTC string.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) {
    throw new Error('Both date and time are required to schedule a follow-up.');
  }

  // Parse year, month (0-indexed), day
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const [hoursStr, minutesStr] = timeStr.split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const dateObj = new Date(year, month, day, hours, minutes, 0, 0);
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date/time value: "${dateStr} ${timeStr}"`);
  }

  return dateObj.toISOString();
}

/**
 * Extracts YYYY-MM-DD from an ISO string for HTML <input type="date">
 */
export function getDateInputValue(isoStr?: string | null): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch (_) {
    return '';
  }
}

/**
 * Extracts HH:mm from an ISO string for HTML <input type="time">
 */
export function getTimeInputValue(isoStr?: string | null): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch (_) {
    return '';
  }
}

/**
 * Checks if a given date and time is in the past compared to current time.
 */
export function isPastDateTime(dateStr: string, timeStr: string, now: Date = new Date()): boolean {
  try {
    const combinedIso = combineDateAndTime(dateStr, timeStr);
    return new Date(combinedIso).getTime() < now.getTime();
  } catch (_) {
    return false;
  }
}

/**
 * Formats date into readable string, e.g. "30 Sep 2026"
 */
export function formatFollowUpDate(isoStr?: string | null): string {
  if (!isoStr) return 'Unscheduled';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (_) {
    return 'Invalid Date';
  }
}

/**
 * Formats time into readable 12-hour string, e.g. "11:30 AM"
 */
export function formatFollowUpTime(isoStr?: string | null): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (_) {
    return '';
  }
}

/**
 * Formats full date and time, e.g. "30 Sep 2026 · 11:30 AM"
 */
export function formatFollowUpDateTime(isoStr?: string | null): string {
  if (!isoStr) return 'Unscheduled';
  const datePart = formatFollowUpDate(isoStr);
  const timePart = formatFollowUpTime(isoStr);
  if (!timePart) return datePart;
  return `${datePart} · ${timePart}`;
}

/**
 * Evaluates follow-up status according to ADM-09:
 * OVERDUE: next_follow_up_at < current time
 * DUE TODAY: Follow-up occurs today but has not yet passed
 * UPCOMING: Future date/time
 * UNSCHEDULED: next_follow_up_at IS NULL
 */
export function getFollowUpStatus(
  isoStr?: string | null,
  now: Date = new Date()
): 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING' | 'UNSCHEDULED' {
  if (!isoStr || typeof isoStr !== 'string' || !isoStr.trim()) {
    return 'UNSCHEDULED';
  }

  try {
    const targetDate = new Date(isoStr.trim());
    const targetMs = targetDate.getTime();
    if (isNaN(targetMs)) return 'UNSCHEDULED';

    const nowMs = now.getTime();
    if (targetMs < nowMs) {
      // Timestamp earlier than now -> Overdue
      return 'OVERDUE';
    }

    // Check if on today's local calendar date
    const isToday =
      targetDate.getFullYear() === now.getFullYear() &&
      targetDate.getMonth() === now.getMonth() &&
      targetDate.getDate() === now.getDate();

    if (isToday) {
      // Timestamp later than now but on today's local calendar date -> Due Today
      return 'DUE_TODAY';
    }

    // Timestamp on a later calendar date -> Upcoming
    return 'UPCOMING';
  } catch (_) {
    return 'UNSCHEDULED';
  }
}
