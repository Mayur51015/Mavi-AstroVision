import React from 'react';
import Card from './Card';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-gold-400',
  iconBg = 'bg-gold-500/10 border-gold-500/20',
  badge,
  progress,
  className = '',
  onClick,
}) {
  return (
    <Card
      className={`p-5 sm:p-6 flex flex-col justify-between ${onClick ? 'cursor-pointer hover:border-slate-700' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-inter tracking-tight">
              {value}
            </span>
            {badge && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${iconBg} ${iconColor}`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden my-2">
          <div
            className="bg-gradient-to-r from-gold-500 to-amber-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {subtitle && (
        <p className="text-xs text-slate-400/80 mt-1 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </Card>
  );
}
