'use client';

import React from 'react';

import Badge from '@/components/ui/badge';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

import { ROLE_MAP } from '../constants/roleMap';

export default function StudentRoleTag({ role }) {
  const r = ROLE_MAP[role] || {
    label: STUDENT_LIST_UI.STATUS.UNKNOWN,
    variant: 'default',
  };

  // Map role color/label to Badge variant
  const variantMap = {
    gold: 'warning',
    warning: 'warning',
    default: 'default',
  };

  return <Badge variant={variantMap[r.color] || 'default'}>{r.label}</Badge>;
}
