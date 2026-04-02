import Image from 'next/image';
import Link from 'next/link';

import { LANDING_UI } from '@/constants/landing/uiText';

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/30 pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 block">
              <Image src="/assets/images/logo.svg" alt="Logo" width={140} height={40} />
            </Link>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              {LANDING_UI.FOOTER.DESCRIPTION}
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              {LANDING_UI.FOOTER.COLUMNS.SOLUTIONS}
            </h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>
                <Link href="#" className="transition-colors hover:text-primary">
                  {LANDING_UI.FOOTER.LINKS.SCHOOL}
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-primary">
                  {LANDING_UI.FOOTER.LINKS.COMPANY}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              {LANDING_UI.FOOTER.COLUMNS.NAVIGATION}
            </h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  {LANDING_UI.FOOTER.LINKS.HOME}
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-primary">
                  {LANDING_UI.FOOTER.LINKS.LOGIN}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              {LANDING_UI.FOOTER.COLUMNS.SUPPORT}
            </h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>
                <Link href="#" className="transition-colors hover:text-primary">
                  {LANDING_UI.FOOTER.LINKS.HELP_CENTER}
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-primary">
                  {LANDING_UI.FOOTER.LINKS.SYSTEM_STATUS}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 text-center text-sm text-slate-500">
          <p>
            {LANDING_UI.FOOTER.COPYRIGHT_SYMBOL} {new Date().getFullYear()}{' '}
            {LANDING_UI.FOOTER.BRAND} {LANDING_UI.FOOTER.COPYRIGHT}
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="#" className="transition-colors hover:text-primary">
              {LANDING_UI.FOOTER.LINKS.PRIVACY}
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              {LANDING_UI.FOOTER.LINKS.TERMS}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
