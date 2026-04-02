'use client';

import { BarChart3, Users, Zap } from 'lucide-react';

import { LANDING_UI } from '@/constants/landing/uiText';

const icons = [Zap, BarChart3, Users];

export function SolutionsSection() {
  return (
    <section id="solutions" className="bg-white py-24 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
          {LANDING_UI.SOLUTIONS.TITLE}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
          {LANDING_UI.SOLUTIONS.DESCRIPTION}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {LANDING_UI.SOLUTIONS.ITEMS.map((solution, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center rounded-3xl border border-slate-100 bg-slate-50/50 p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{solution.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{solution.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
