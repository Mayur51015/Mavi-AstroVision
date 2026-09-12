import React from 'react';

/**
 * Reusable Badge / Tag Component
 * @param {'default' | 'gold' | 'iris' | 'success' | 'warning' | 'danger' | 'outline'} variant
 * @param {'sm' | 'md'} size
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-colors uppercase select-none';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantClasses = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/80',
    gold: 'bg-gold-500/10 text-gold-400 border border-gold-500/30',
    iris: 'bg-iris-500/10 text-iris-400 border border-iris-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 11 : 13} className="shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
