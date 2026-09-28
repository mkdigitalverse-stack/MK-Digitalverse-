import React, { useState } from 'react';
import {
  X,
  Layers,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  ContractRecord,
  ContractMilestoneRecord,
  MilestoneStatus,
  MILESTONE_STATUS_LABELS
} from '../../types/contracts';

interface AdminCreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ContractMilestoneRecord, 'id' | 'createdAt' | 'updatedAt' | 'isOverdue' | 'invoiceNumber'>) => Promise<void>;
  contract: ContractRecord | null;
}

export const AdminCreateMilestoneModal: React.FC<AdminCreateMilestoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contract
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState<number>(1);
  const [status, setStatus] = useState<MilestoneStatus>('not_started');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [milestoneValue, setMilestoneValue] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !contract) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Milestone title is required.');
      return;
    }

    const numVal = milestoneValue ? parseFloat(milestoneValue) : 0;
    if (numVal < 0) {
      setErrorMessage('Milestone value cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        contractId: contract.id,
        title: title.trim(),
        description: description.trim() || undefined,
        sequenceNumber: sequenceNumber || 1,
        status,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        completedAt: status === 'completed' ? new Date().toISOString() : null,
        completionPercentage: status === 'completed' ? 100 : completionPercentage,
        milestoneValue: numVal,
        currencyCode: contract.currencyCode,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create milestone');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
              PROJECT DELIVERABLE
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Add Delivery Milestone
            </h3>
            <p className="text-xs text-slate-500 font-mono">Contract: {contract.contractNumber}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Sequence */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block font-semibold text-slate-700 mb-1">
                Sequence #
              </label>
              <input
                type="number"
                min="1"
                required
                value={sequenceNumber}
                onChange={(e) => setSequenceNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Milestone Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Website UX/UI Wireframes & Prototype"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Value & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Planned Milestone Value ({contract.currencyCode})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={milestoneValue}
                onChange={(e) => setMilestoneValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Due Date (Target Delivery)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Status & Progress */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
              >
                {Object.entries(MILESTONE_STATUS_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Progress Percentage ({completionPercentage}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={completionPercentage}
                onChange={(e) => setCompletionPercentage(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deliverables & Description
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Design review, client feedback approval, staging deployment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
