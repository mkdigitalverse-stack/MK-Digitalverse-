import React, { useState, useEffect } from 'react';
import { 
  CompleteLeadRecord, 
  FOLLOW_UP_REMARK_OPTIONS, 
  FollowUpRemarkOption 
} from '../../services/qualification';
import { 
  getDateInputValue, 
  getTimeInputValue, 
  isPastDateTime, 
  formatFollowUpDate, 
  formatFollowUpTime 
} from '../../utils/followUpTime';
import { 
  X, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface AdminScheduleFollowUpModalProps {
  isOpen: boolean;
  lead: CompleteLeadRecord | null;
  mode: 'schedule' | 'reschedule';
  onClose: () => void;
  onSaveSchedule: (
    leadId: string,
    payload: {
      date: string;
      time: string;
      remark: string;
      note?: string;
    }
  ) => Promise<void>;
  onSaveReschedule: (
    leadId: string,
    payload: {
      previousFollowUpAt?: string;
      previousRemark?: string;
      date: string;
      time: string;
      remark: string;
      note?: string;
    }
  ) => Promise<void>;
}

export const AdminScheduleFollowUpModal: React.FC<AdminScheduleFollowUpModalProps> = ({
  isOpen,
  lead,
  mode,
  onClose,
  onSaveSchedule,
  onSaveReschedule
}) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [remarkOption, setRemarkOption] = useState<string>('');
  const [customRemark, setCustomRemark] = useState<string>('');
  const [additionalNote, setAdditionalNote] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or reset form state when lead or modal opens
  useEffect(() => {
    if (!isOpen || !lead) {
      setValidationError(null);
      return;
    }

    setValidationError(null);
    setAdditionalNote('');

    if (mode === 'reschedule' && lead.qualification.nextFollowUpAt) {
      // Pre-fill existing date and time
      setDate(getDateInputValue(lead.qualification.nextFollowUpAt));
      setTime(getTimeInputValue(lead.qualification.nextFollowUpAt));
      
      const existingRemark = lead.qualification.nextFollowUpRemark || '';
      if ((FOLLOW_UP_REMARK_OPTIONS as readonly string[]).includes(existingRemark)) {
        setRemarkOption(existingRemark);
        setCustomRemark('');
      } else if (existingRemark) {
        setRemarkOption('Other');
        setCustomRemark(existingRemark);
      } else {
        setRemarkOption('Follow-Up on Decision');
        setCustomRemark('');
      }
    } else {
      // Default new schedule to tomorrow at 10:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      setTime('10:00');
      setRemarkOption('Call Back Requested');
      setCustomRemark('');
    }
  }, [isOpen, lead, mode]);

  if (!isOpen || !lead) return null;

  const isReschedule = mode === 'reschedule';
  const existingFollowUpAt = lead.qualification.nextFollowUpAt;
  const existingRemark = lead.qualification.nextFollowUpRemark;

  const isPast = date && time ? isPastDateTime(date, time) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validation
    if (!date) {
      setValidationError('Please select a follow-up Date.');
      return;
    }
    if (!time) {
      setValidationError('Please select a follow-up Time.');
      return;
    }
    if (!remarkOption) {
      setValidationError('Please select a Remark option.');
      return;
    }
    if (remarkOption === 'Other' && !customRemark.trim()) {
      setValidationError('Please enter a custom remark when "Other" is selected.');
      return;
    }

    const effectiveRemark = remarkOption === 'Other' ? customRemark.trim() : remarkOption;

    setIsSubmitting(true);
    try {
      if (isReschedule) {
        await onSaveReschedule(lead.leadId, {
          previousFollowUpAt: existingFollowUpAt,
          previousRemark: existingRemark,
          date,
          time,
          remark: effectiveRemark,
          note: additionalNote.trim() || undefined
        });
      } else {
        await onSaveSchedule(lead.leadId, {
          date,
          time,
          remark: effectiveRemark,
          note: additionalNote.trim() || undefined
        });
      }
      onClose();
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save follow-up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                {isReschedule ? 'Cadence Re-Scheduling' : 'Cadence Scheduling'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">#{lead.leadId.slice(0, 8)}</span>
            </div>
            <h2 id="schedule-modal-title" className="text-base font-bold text-white tracking-tight mt-0.5">
              {isReschedule ? 'Re-schedule Follow-Up' : 'Schedule Follow-Up'}
            </h2>
            <p className="text-xs text-slate-300 truncate mt-0.5">
              {lead.visitorData.organizationName || lead.visitorData.contactName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800 text-xs">
          
          {/* Section 3 Requirement: Display Existing Schedule when Re-scheduling */}
          {isReschedule && existingFollowUpAt && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Current Follow-Up Schedule</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 pt-0.5">
                <div className="font-semibold text-slate-900">
                  {formatFollowUpDate(existingFollowUpAt)} · {formatFollowUpTime(existingFollowUpAt)}
                </div>
                {existingRemark && (
                  <div className="text-slate-600 font-medium text-[11px] bg-slate-200/80 px-2 py-0.5 rounded">
                    {existingRemark}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Feedback Banner */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Past Date Warning */}
          {isPast && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Past Date/Time Selected</span>
                <span className="text-[11px] text-amber-800">
                  This target date and time has already passed. The system will immediately classify this record as <strong>Overdue</strong>.
                </span>
              </div>
            </div>
          )}

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                {isReschedule ? 'New Date *' : 'Date *'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                {isReschedule ? 'New Time *' : 'Time *'}
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Predefined Remark Option (Required) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              {isReschedule ? 'Reschedule Reason / Remark *' : 'Remark *'}
            </label>
            <select
              required
              value={remarkOption}
              onChange={(e) => {
                setRemarkOption(e.target.value);
                if (e.target.value !== 'Other') {
                  setCustomRemark('');
                }
              }}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              <option value="" disabled>-- Select predefined remark --</option>
              {FOLLOW_UP_REMARK_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Custom Remark if 'Other' is chosen */}
          {remarkOption === 'Other' && (
            <div className="animate-in fade-in duration-100">
              <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wide mb-1">
                Custom Remark Specification *
              </label>
              <input
                type="text"
                required
                placeholder="Specify specific custom remark..."
                value={customRemark}
                onChange={(e) => setCustomRemark(e.target.value)}
                className="w-full bg-amber-50/50 border border-amber-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
              />
            </div>
          )}

          {/* Additional Note (Optional) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Additional Note <span className="text-slate-400 font-normal lowercase">(optional context)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Needs revised pricing for Phase 2 implementation. Contact requested call after 3 PM."
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 min-h-[40px] flex items-center space-x-1.5"
            >
              {isReschedule ? (
                <>
                  <RotateCcw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Saving Re-schedule...' : 'Save Re-schedule'}</span>
                </>
              ) : (
                <>
                  <Calendar className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Scheduling...' : 'Schedule Follow-Up'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
