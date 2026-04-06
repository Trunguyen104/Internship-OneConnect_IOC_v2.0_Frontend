'use client';

import { useEffect } from 'react';

const ERROR_TITLE = 'Something went wrong';
const ERROR_DESC = 'An unexpected error occurred. Please try again.';
const RETRY_LABEL = 'Try again';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-black text-slate-900">{ERROR_TITLE}</h1>
      <p className="text-sm text-slate-500">{ERROR_DESC}</p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        {RETRY_LABEL}
      </button>
    </main>
  );
}
