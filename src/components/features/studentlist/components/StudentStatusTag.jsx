'use client';

import React from 'react';

import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

import { STUDENT_STATUS_MAP } from '../constants/statusMap';

export default function StudentStatusTag({ status }) {
  const s = STUDENT_STATUS_MAP[status] || {
    label: STUDENT_LIST_UI.STATUS.UNKNOWN,
    dot: 'bg-gray-400',
    style: 'bg-gray-50 text-gray-500 border-gray-100',
  };

  return (
    <div
      className={`flex w-fit items-center gap-2 whitespace-nowrap rounded-lg border px-2.5 py-1 ${s.style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} animate-pulse`} />
      <span className="text-[11px] font-bold tracking-tight uppercase">{s.label}</span>
    </div>
  );
}
