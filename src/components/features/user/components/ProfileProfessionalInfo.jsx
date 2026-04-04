'use client';

import { Download, ExternalLink } from 'lucide-react';
import React from 'react';

import { USER_ROLE } from '@/constants/common/enums';
import { PROFILE_UI } from '@/constants/user/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

import InfoItem from './InfoItem';

export default function ProfileProfessionalInfo({ userInfo, onDownloadCV }) {
  const roleCode = String(userInfo?.role || userInfo?.Role || '').toLowerCase();

  const isStudent = [USER_ROLE.STUDENT, String(USER_ROLE.STUDENT), 'student'].includes(roleCode);
  const isProfessional = [
    USER_ROLE.MENTOR,
    USER_ROLE.HR,
    USER_ROLE.ENTERPRISE_ADMIN,
    'mentor',
    'hr',
    'enterpriseadmin',
  ].includes(roleCode);
  const isSchoolAdmin = [
    USER_ROLE.SCHOOL_ADMIN,
    String(USER_ROLE.SCHOOL_ADMIN),
    'schooladmin',
  ].includes(roleCode);

  if (!isStudent && !isProfessional && !isSchoolAdmin) return null;

  return (
    <div className="border-t pt-8">
      <h3 className="mb-6 text-xl font-bold">{PROFILE_UI.PROFESSIONAL_INFO}</h3>
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {isStudent && (
          <>
            <InfoItem
              label={PROFILE_UI.LABELS.MAJOR}
              value={userInfo?.major || userInfo?.Major || '—'}
            />
            <InfoItem
              label={PROFILE_UI.LABELS.CLASS}
              value={userInfo?.className || userInfo?.ClassName || '—'}
            />
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <InfoItem label={PROFILE_UI.LABELS.PORTFOLIO}>
                  {userInfo?.portfolioUrl || userInfo?.PortfolioUrl ? (
                    <a
                      href={userInfo.portfolioUrl || userInfo.PortfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary flex items-center gap-1 font-semibold hover:underline"
                    >
                      {UI_TEXT.USER_PROFILE.VIEW_LINK}
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    '—'
                  )}
                </InfoItem>

                <InfoItem label={PROFILE_UI.LABELS.CV_FILE || 'CV File'}>
                  {userInfo?.cvUrl || userInfo?.CvUrl ? (
                    <button
                      type="button"
                      onClick={onDownloadCV}
                      className="text-primary flex items-center gap-1 font-semibold hover:underline"
                    >
                      {PROFILE_UI.CV_HELPER.DOWNLOAD_CV_ACTION}
                      <Download size={14} />
                    </button>
                  ) : (
                    <span className="text-muted-foreground italic">
                      {PROFILE_UI.CV_HELPER.NOT_UPLOADED || 'No CV uploaded'}
                    </span>
                  )}
                </InfoItem>
              </div>
            </div>
          </>
        )}

        {(isProfessional || isSchoolAdmin) && (
          <>
            <InfoItem
              label={PROFILE_UI.LABELS.POSITION}
              value={userInfo?.position || userInfo?.Position || '—'}
            />
            {isProfessional && (
              <InfoItem
                label={PROFILE_UI.LABELS.EXPERTISE}
                value={userInfo?.expertise || userInfo?.Expertise || '—'}
              />
            )}
            {isSchoolAdmin && (
              <InfoItem
                label={PROFILE_UI.LABELS.DEPARTMENT}
                value={userInfo?.department || userInfo?.Department || '—'}
              />
            )}
            <div className="md:col-span-2">
              <InfoItem
                label={PROFILE_UI.LABELS.BIO}
                value={userInfo?.bio || userInfo?.Bio || '—'}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
