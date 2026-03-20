import Link from 'next/link';

import { UI_TEXT } from '@/lib/UI_Text';

export const metadata = {
  title: 'Unauthorized',
  description: 'Access denied',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-xl space-y-4 p-10">
      <h1 className="text-2xl font-black text-slate-900">{UI_TEXT.COMMON.UNAUTHORIZED}</h1>
      <p className="text-slate-600">{UI_TEXT.COMMON.UNAUTHORIZED_DESC}</p>
      <Link
        href="/login"
        className="inline-flex rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        {UI_TEXT.COMMON.BACK_TO_LOGIN}
      </Link>
    </div>
  );
}
