'use client';

import React from 'react';

import { USER_ROLE } from '@/constants/common/enums';
import { PROFILE_UI } from '@/constants/user/uiText';

import InfoItem from './InfoItem';

export default function ProfileGeneralInfo({ userInfo }) {
  const isStudent = [USER_ROLE.STUDENT, String(USER_ROLE.STUDENT), 'student'].includes(
    String(userInfo?.role || userInfo?.Role).toLowerCase()
  );

  const isRoleWithUnit = ![
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.MODERATOR,
    String(USER_ROLE.SUPER_ADMIN),
    String(USER_ROLE.MODERATOR),
    'superadmin',
    'moderator',
  ].includes(String(userInfo?.role || userInfo?.Role).toLowerCase());

  const unitLabel = [
    USER_ROLE.MENTOR,
    USER_ROLE.HR,
    USER_ROLE.ENTERPRISE_ADMIN,
    String(USER_ROLE.MENTOR),
    String(USER_ROLE.HR),
    String(USER_ROLE.ENTERPRISE_ADMIN),
    'mentor',
    'hr',
    'enterpriseadmin',
  ].includes(String(userInfo?.role || userInfo?.Role).toLowerCase())
    ? PROFILE_UI.LABELS.ENTERPRISE
    : PROFILE_UI.LABELS.UNIVERSITY;

  const dateOfBirthStr =
    (userInfo?.dateOfBirth ?? userInfo?.DateOfBirth)
      ? new Date(userInfo.dateOfBirth ?? userInfo.DateOfBirth).toLocaleDateString('en-GB')
      : '—';

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3">
      <InfoItem
        label={PROFILE_UI.LABELS.PHONE}
        value={userInfo?.phoneNumber || userInfo?.PhoneNumber || '—'}
      />
      <InfoItem
        label={isStudent ? PROFILE_UI.LABELS.STUDENT_CODE : PROFILE_UI.LABELS.USER_CODE}
        value={userInfo?.userCode || userInfo?.UserCode || '—'}
      />
      <InfoItem
        label={PROFILE_UI.LABELS.GENDER}
        value={
          PROFILE_UI.GENDER_LABELS[userInfo?.gender] ||
          PROFILE_UI.GENDER_LABELS[userInfo?.Gender] ||
          PROFILE_UI.GENDER_LABELS[String(userInfo?.gender)] ||
          PROFILE_UI.GENDER_LABELS[String(userInfo?.Gender)] ||
          '—'
        }
      />
      <InfoItem label={PROFILE_UI.LABELS.DATE_OF_BIRTH} value={dateOfBirthStr} />
      <InfoItem
        label={PROFILE_UI.LABELS.ADDRESS}
        value={userInfo?.address || userInfo?.Address || '—'}
      />
      {isRoleWithUnit && (
        <InfoItem label={unitLabel} value={userInfo?.unitName || userInfo?.UnitName || '—'} />
      )}
    </div>
  );
}
