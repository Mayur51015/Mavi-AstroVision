import React from 'react';

export default function PageHeader({
  badge,
  title,
  description,
  actions,
  breadcrumbs = [],
  className = '',
}) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6 sm:mb-8 ${className}`}
    >
      <div className="space-y-1.5 max-w-2xl">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label || idx}>
                {idx > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-slate-300 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-400">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {badge && <div className="mb-2">{badge}</div>}

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-inter tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center flex-wrap gap-2.5 shrink-0 pt-1 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
