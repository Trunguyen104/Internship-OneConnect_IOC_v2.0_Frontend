'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WORK_BOARD_UI } from '@/constants/work-board/uiText';

export function EmptySprintState() {
  const params = useParams();
  const internshipGroupId = params?.internshipGroupId;
  const backlogPath = internshipGroupId
    ? `/internship-groups/${internshipGroupId}/backlog`
    : '/internship-groups/backlog';

  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm'>
      <div className='bg-primary-surface text-primary mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='40'
          height='40'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M8 2v4' />
          <path d='M16 2v4' />
          <rect width='18' height='18' x='3' y='4' rx='2' />
          <path d='M3 10h18' />
          <path d='m9 16 2 2 4-4' />
        </svg>
      </div>

      <h3 className='text-text mb-2 text-xl font-bold'>{WORK_BOARD_UI.NO_ACTIVE_SPRINT}</h3>
      <p className='text-muted mb-8 max-w-md text-sm leading-relaxed'>
        {WORK_BOARD_UI.START_SPRINT_DESC}
      </p>

      <Link
        href={backlogPath}
        className='bg-primary text-surface inline-flex items-center justify-center rounded-2xl px-8 py-3 text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'
      >
        {WORK_BOARD_UI.GO_TO_BACKLOG}
      </Link>
    </div>
  );
}
