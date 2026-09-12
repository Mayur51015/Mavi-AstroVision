import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className = '',
}) {
  return (
    <div
      className={`card-saas flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-gold-400 mb-4 shadow-sm">
          <Icon size={26} />
        </div>
      )}

      <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1.5">{title}</h3>

      {description && (
        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} icon={ActionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
