import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helper,
    className = '',
    containerClassName = '',
    id,
    disabled = false,
    required = false,
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
        >
          {label} {required && <span className="text-gold-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`w-full appearance-none bg-obsidian-900/90 text-slate-100 text-sm rounded-xl border px-3.5 py-2.5 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-gold-500/60 focus:ring-gold-400/20 hover:border-slate-700'
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={typeof opt === 'string' ? opt : opt.value}
                  value={typeof opt === 'string' ? opt : opt.value}
                  className="bg-obsidian-950 text-slate-100 py-1"
                >
                  {typeof opt === 'string' ? opt : opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
      ) : helper ? (
        <p className="text-xs text-slate-500 mt-1">{helper}</p>
      ) : null}
    </div>
  );
});

export default Select;
