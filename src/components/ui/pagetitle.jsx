'use client';

import React from 'react';

const PageTitle = ({ title, subtitle, extra }) => {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between gap-4 overflow-hidden border-b border-transparent transition-all duration-300">
      <div className="flex flex-col justify-center space-y-0.5">
        <h1 className="text-[20px] font-black tracking-tight text-slate-900 leading-none">
          {title}
        </h1>
        {subtitle && <p className="text-[12px] font-medium text-slate-400 mt-1">{subtitle}</p>}
      </div>

      {extra && <div className="flex flex-shrink-0 items-center gap-3">{extra}</div>}
    </header>
  );
};

export default PageTitle;
