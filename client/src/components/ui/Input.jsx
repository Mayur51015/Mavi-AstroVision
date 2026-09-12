import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    icon: Icon,
    iconRight: IconRight,
    onRightIconClick,
    className = '',
    containerClassName = '',
    id,
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
        >
          {label} {required && <span className="text-gold-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-obsidian-900/90 text-slate-100 placeholder-slate-500 text-sm rounded-xl border px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${IconRight ? 'pr-10' : ''} ${
            error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-gold-500/60 focus:ring-gold-400/20 hover:border-slate-700'
          } ${className}`}
          {...props}
        />

        {IconRight && (
          <button
            type="button"
            onClick={onRightIconClick}
            tabIndex={onRightIconClick ? 0 : -1}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors ${
              !onRightIconClick ? 'pointer-events-none' : 'cursor-pointer'
            }`}
          >
            <IconRight size={16} />
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">{error}</p>
      ) : helper ? (
        <p className="text-xs text-slate-500 mt-1">{helper}</p>
      ) : null}
    </div>
  );
});

export default Input;
