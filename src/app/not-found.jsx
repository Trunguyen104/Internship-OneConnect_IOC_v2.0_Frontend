import Link from 'next/link';

const NOT_FOUND_CODE = '404';
const NOT_FOUND_TITLE = 'Page not found';
const NOT_FOUND_DESC = 'The page may have been moved or the URL is incorrect.';
const BACK_TO_HOME = 'Back to home';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-black text-slate-900">{NOT_FOUND_CODE}</h1>
      <p className="text-lg font-semibold text-slate-700">{NOT_FOUND_TITLE}</p>
      <p className="text-sm text-slate-500">{NOT_FOUND_DESC}</p>
      <Link
        href="/"
        className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        {BACK_TO_HOME}
      </Link>
    </main>
  );
}
