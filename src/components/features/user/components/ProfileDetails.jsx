'use client';

import {
  Building2,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';

import Card from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { USER_ROLE } from '@/constants/common/enums';
import { PROFILE_UI } from '@/constants/user/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

import InfoItem from './InfoItem';

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon size={18} />
    </div>
    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{children}</h3>
  </div>
);

export default function ProfileDetails({ userInfo, loadingUser, onDownloadCV }) {
  if (loadingUser) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Spinner size="lg" className="border-primary" />
        <span className="ml-3 font-medium text-slate-500">{PROFILE_UI.LOADING}</span>
      </div>
    );
  }

  const roleValue = userInfo?.role ?? userInfo?.Role;
  const isStudent = [USER_ROLE.STUDENT, String(USER_ROLE.STUDENT), '7', 'student'].includes(
    String(roleValue).toLowerCase()
  );

  const isProfessional =
    [USER_ROLE.MENTOR, USER_ROLE.HR, USER_ROLE.ENTERPRISE_ADMIN, 6, 5, 4].includes(roleValue) ||
    ['mentor', 'hr', 'enterpriseadmin'].includes(String(roleValue).toLowerCase());

  const isSchoolAdmin =
    roleValue === USER_ROLE.SCHOOL_ADMIN ||
    3 === roleValue ||
    String(roleValue).toLowerCase() === 'schooladmin';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Main Column: Personal Details */}
      <div className="space-y-6 lg:col-span-8">
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden h-full">
          <Card.Content className="p-8">
            <SectionTitle icon={User}>{PROFILE_UI.PERSONAL_INFO}</SectionTitle>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label={PROFILE_UI.LABELS.FULL_NAME}
                value={userInfo?.fullName || userInfo?.FullName || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                icon={User}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.EMAIL}
                value={userInfo?.email || userInfo?.Email || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                icon={Mail}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.PHONE}
                value={
                  userInfo?.phoneNumber || userInfo?.PhoneNumber || PROFILE_UI.EMPTY.NOT_AVAILABLE
                }
                icon={Phone}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.DATE_OF_BIRTH}
                value={
                  (userInfo?.dateOfBirth ?? userInfo?.DateOfBirth)
                    ? new Date(userInfo.dateOfBirth ?? userInfo.DateOfBirth).toLocaleDateString(
                        'en-GB'
                      )
                    : PROFILE_UI.EMPTY.NOT_AVAILABLE
                }
                icon={Calendar}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.GENDER}
                value={
                  PROFILE_UI.GENDER_LABELS[userInfo?.gender] ||
                  PROFILE_UI.GENDER_LABELS[userInfo?.Gender] ||
                  PROFILE_UI.GENDER_LABELS[String(userInfo?.gender)] ||
                  PROFILE_UI.GENDER_LABELS[String(userInfo?.Gender)] ||
                  PROFILE_UI.EMPTY.NOT_AVAILABLE
                }
                icon={User}
              />

              <InfoItem
                label={PROFILE_UI.LABELS.ADDRESS}
                value={userInfo?.address || userInfo?.Address || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                icon={MapPin}
              />

              {/* Portfolio & CV Unified Style */}
              {isStudent && (
                <>
                  <InfoItem label={PROFILE_UI.LABELS.PORTFOLIO} icon={ExternalLink}>
                    {userInfo?.portfolioUrl || userInfo?.PortfolioUrl ? (
                      <a
                        href={userInfo.portfolioUrl || userInfo.PortfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary flex items-center gap-1 hover:underline font-bold"
                      >
                        {UI_TEXT.USER_PROFILE.VIEW_LINK}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic font-medium">
                        {PROFILE_UI.EMPTY.NOT_AVAILABLE}
                      </span>
                    )}
                  </InfoItem>
                  <InfoItem label={PROFILE_UI.LABELS.CV} icon={FileText}>
                    {userInfo?.cvUrl || userInfo?.CvUrl ? (
                      <button
                        type="button"
                        onClick={onDownloadCV}
                        className="text-primary flex items-center gap-1 hover:underline font-bold"
                      >
                        {PROFILE_UI.CV_HELPER.DOWNLOAD_CV_ACTION}
                        <Download size={14} />
                      </button>
                    ) : (
                      <span className="text-slate-400 italic font-medium">
                        {PROFILE_UI.EMPTY.NOT_AVAILABLE}
                      </span>
                    )}
                  </InfoItem>
                </>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Bio for Professional Roles */}
        {(isProfessional || isSchoolAdmin) && (
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
            <Card.Content className="p-8">
              <SectionTitle icon={User}>{PROFILE_UI.LABELS.BIO}</SectionTitle>
              <p className="text-sm leading-relaxed text-slate-600 font-medium bg-slate-50/50 p-6 rounded-xl border border-slate-100 italic">
                {userInfo?.bio || userInfo?.Bio || PROFILE_UI.EMPTY.NO_DATA}
              </p>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Side Column: Work/Study Info */}
      <div className="space-y-6 lg:col-span-4">
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden h-full">
          <Card.Content className="p-8">
            <SectionTitle icon={Building2}>
              {isStudent ? PROFILE_UI.LABELS.UNIVERSITY : PROFILE_UI.LABELS.ENTERPRISE}
            </SectionTitle>

            <div className="space-y-8">
              <InfoItem
                label={isStudent ? PROFILE_UI.LABELS.STUDENT_CODE : PROFILE_UI.LABELS.USER_CODE}
                value={userInfo?.userCode || userInfo?.UserCode || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                icon={ShieldCheck}
              />

              {!['superadmin', 'moderator'].includes(String(roleValue).toLowerCase()) && (
                <InfoItem
                  label={
                    isProfessional ? PROFILE_UI.LABELS.ENTERPRISE : PROFILE_UI.LABELS.UNIVERSITY
                  }
                  value={userInfo?.unitName || userInfo?.UnitName || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                  icon={Building2}
                />
              )}

              {isStudent && (
                <>
                  <InfoItem
                    label={PROFILE_UI.LABELS.MAJOR}
                    value={userInfo?.major || userInfo?.Major || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                    icon={GraduationCap}
                  />
                  <InfoItem
                    label={PROFILE_UI.LABELS.CLASS}
                    value={
                      userInfo?.className || userInfo?.ClassName || PROFILE_UI.EMPTY.NOT_AVAILABLE
                    }
                    icon={GraduationCap}
                  />
                </>
              )}

              {(isProfessional || isSchoolAdmin) && (
                <InfoItem
                  label={PROFILE_UI.LABELS.POSITION}
                  value={userInfo?.position || userInfo?.Position || PROFILE_UI.EMPTY.NOT_AVAILABLE}
                  icon={ShieldCheck}
                />
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
