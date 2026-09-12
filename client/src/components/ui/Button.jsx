import React from 'react';

/**
 * Reusable SaaS Button Component for Mavi-AstroVision
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-semibold shadow-sm hover:from-gold-400 hover:to-gold-500 hover:shadow-gold focus-visible:ring-gold-400',
    secondary:
      'bg-slate-800/80 hover:bg-slate-750 text-slate-100 border border-slate-700 hover:border-slate-600 focus-visible:ring-slate-400 shadow-sm',
    outline:
      'bg-transparent border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500 focus-visible:ring-gold-400',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent focus-visible:ring-slate-400',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 focus-visible:ring-rose-400',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="shrink-0" />
      ) : null}
      <span>{children}</span>
      {!loading && IconRight && (
        <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="shrink-0" />
      )}
    </button>
  );
}
