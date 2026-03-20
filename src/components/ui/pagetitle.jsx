'use client';

import React from 'react';

const PageTitle = ({ title, subtitle, extra }) => {
  return (
    <header className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>

      {extra && <div className="flex items-center gap-3">{extra}</div>}
    </header>
  );
};

export default PageTitle;
