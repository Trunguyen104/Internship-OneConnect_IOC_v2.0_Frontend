'use client';

import { RefreshCcw } from 'lucide-react';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';
import { EmptyState, Loading } from '@/components/ui/atoms';

function normalizeEllipsis(value) {
  if (!value) return value;
  return value.replaceAll('...', '…');
}

export function ProfileLoading() {
  return (
    <div className='flex min-h-[400px] items-center justify-center'>
      <Loading text={normalizeEllipsis(ENTERPRISE_PROFILE_UI.LOADING)} />
    </div>
  );
}

export function ProfileEmpty({ onRetry }) {
  return (
    <div className='border-border/60 bg-surface rounded-3xl border p-12 shadow-sm'>
      <EmptyState
        title={ENTERPRISE_PROFILE_UI.EMPTY.NO_DATA}
        description='We couldn’t load your company profile right now. Please try again.'
        minHeightClassName='min-h-[280px]'
        action={
          <button
            type='button'
            onClick={onRetry}
            className='border-border/60 bg-surface hover:bg-bg text-text inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors'
          >
            <RefreshCcw className='h-4 w-4' />
            Try Again
          </button>
        }
      />
    </div>
  );
}
