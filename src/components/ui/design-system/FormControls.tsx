import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorMessage,
  successMessage,
  leftIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isError = Boolean(errorMessage);
  const isSuccess = Boolean(successMessage);

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full py-3 text-xs sm:text-sm bg-zinc-950 text-white placeholder-zinc-500 rounded-xl border transition-all focus:outline-none ${
            leftIcon ? 'pl-10 pr-4' : 'px-4'
          } ${
            isError
              ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
              : isSuccess
              ? 'border-emerald-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500'
              : 'border-white/15 hover:border-white/25 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
          } ${className}`}
          {...props}
        />
      </div>

      {helperText && !errorMessage && !successMessage && (
        <p className="text-[11px] font-mono text-zinc-500">{helperText}</p>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  errorMessage,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full p-4 text-xs sm:text-sm bg-zinc-950 text-white placeholder-zinc-500 rounded-xl border border-white/15 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all ${
          errorMessage ? 'border-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {helperText && <p className="text-[11px] font-mono text-zinc-500">{helperText}</p>}
      {errorMessage && <p className="text-[11px] text-rose-400">{errorMessage}</p>}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-3 text-xs sm:text-sm bg-zinc-950 text-white rounded-xl border border-white/15 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && <p className="text-[11px] font-mono text-zinc-500">{helperText}</p>}
    </div>
  );
};

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `cb-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="flex items-start gap-3 text-left">
      <input
        type="checkbox"
        id={checkboxId}
        className={`mt-0.5 w-4 h-4 rounded bg-zinc-900 border-white/20 text-amber-400 focus:ring-amber-400 accent-amber-400 cursor-pointer ${className}`}
        {...props}
      />
      <div>
        <label htmlFor={checkboxId} className="text-xs font-bold text-zinc-200 cursor-pointer">
          {label}
        </label>
        {description && <p className="text-[11px] text-zinc-400">{description}</p>}
      </div>
    </div>
  );
};
