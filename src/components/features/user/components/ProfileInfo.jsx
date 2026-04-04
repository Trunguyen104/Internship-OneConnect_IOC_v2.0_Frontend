'use client';

// import AvatarUploader from '@/components/shared/AvatarUploader';
// import Card from '@/components/shared/Card';
import { Download, Edit2, ExternalLink, FileText } from 'lucide-react';

import AvatarUploader from '@/components/ui/avataruploader';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { USER_ROLE } from '@/constants/common/enums';
import { PROFILE_UI } from '@/constants/user/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

import InfoItem from './InfoItem';
import ProfileEditModal from './ProfileEditModal';

export default function ProfileInfo({
  userInfo,
  loadingUser,
  updatingProfile,
  avatarUrl,
  onAvatarChange,
  isEditModalOpen,
  setIsEditModalOpen,
  onSaveProfile,
  onDownloadCV,
}) {
  return (
    <>
      <h1 className="text-text text-2xl font-bold">{PROFILE_UI.PERSONAL_INFO}</h1>

      <Card className="relative">
        <div className="border-border flex items-center gap-6 border-b pb-6">
          <AvatarUploader
            value={avatarUrl}
            onChange={onAvatarChange}
            fullName={userInfo?.fullName || userInfo?.FullName || PROFILE_UI.AVATAR.DEFAULT_NAME}
          />

          <div>
            <h2 className="text-text text-lg font-bold">{PROFILE_UI.AVATAR.TITLE}</h2>
            <p className="text-muted mt-1 text-sm">{PROFILE_UI.AVATAR.HINT}</p>
          </div>

          <div className="mt-4 ml-auto">
            {[USER_ROLE.STUDENT, 'student'].includes(String(userInfo?.role).toLowerCase()) && (
              <Button variant="outline" className="gap-2">
                <FileText size={16} />
                {PROFILE_UI.BUTTONS.UPLOAD_CV}
              </Button>
            )}
          </div>
        </div>

        <div className="pt-6">
          <h3 className="mb-6 text-xl font-bold">{PROFILE_UI.PERSONAL_INFO}</h3>

          {loadingUser ? (
            <div className="flex w-full items-center justify-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-muted">{PROFILE_UI.LOADING}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-4">
              {/* Row 1 */}
              <InfoItem
                label={PROFILE_UI.LABELS.FULL_NAME}
                value={userInfo?.fullName || userInfo?.FullName || '—'}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.EMAIL}
                value={userInfo?.email || userInfo?.Email || '—'}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.PHONE}
                value={userInfo?.phoneNumber || userInfo?.PhoneNumber || '—'}
              />
              <InfoItem label={PROFILE_UI.LABELS.ROLE}>
                <Badge variant="primary">
                  {PROFILE_UI.ROLE_LABELS[userInfo?.role || userInfo?.Role] ||
                    userInfo?.role ||
                    userInfo?.Role ||
                    '—'}
                </Badge>
              </InfoItem>
              {/* Row 2 */}
              <InfoItem
                label={
                  [USER_ROLE.STUDENT, String(USER_ROLE.STUDENT), 'student'].includes(
                    String(userInfo?.role || userInfo?.Role).toLowerCase()
                  )
                    ? PROFILE_UI.LABELS.STUDENT_CODE
                    : PROFILE_UI.LABELS.USER_CODE
                }
                value={userInfo?.userCode || userInfo?.UserCode || '—'}
              />
              <InfoItem
                label={PROFILE_UI.LABELS.ADDRESS}
                value={userInfo?.address || userInfo?.Address || '—'}
              />
              {/* Unit Field - Only for non-admin/moderator */}
              {![
                USER_ROLE.SUPER_ADMIN,
                USER_ROLE.MODERATOR,
                String(USER_ROLE.SUPER_ADMIN),
                String(USER_ROLE.MODERATOR),
                'superadmin',
                'moderator',
              ].includes(String(userInfo?.role || userInfo?.Role).toLowerCase()) && (
                <InfoItem
                  label={
                    [
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
                      : PROFILE_UI.LABELS.UNIVERSITY
                  }
                  value={userInfo?.unitName || userInfo?.UnitName || '—'}
                />
              )}
              <div /> {/* Empty space to align with screenshot or add more fields later */}
              {/* Row 3 */}
              <InfoItem
                label={PROFILE_UI.LABELS.DATE_OF_BIRTH}
                value={
                  (userInfo?.dateOfBirth ?? userInfo?.DateOfBirth)
                    ? new Date(userInfo.dateOfBirth ?? userInfo.DateOfBirth).toLocaleDateString(
                        'en-GB'
                      )
                    : '—'
                }
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
              {/* Specialized Fields - Row 4+ */}
              {[USER_ROLE.STUDENT, String(USER_ROLE.STUDENT), 'student'].includes(
                String(userInfo?.role || userInfo?.Role).toLowerCase()
              ) && (
                <>
                  <InfoItem
                    label={PROFILE_UI.LABELS.MAJOR}
                    value={userInfo?.major || userInfo?.Major || '—'}
                  />
                  <InfoItem
                    label={PROFILE_UI.LABELS.CLASS}
                    value={userInfo?.className || userInfo?.ClassName || '—'}
                  />
                  <InfoItem label={PROFILE_UI.LABELS.PORTFOLIO}>
                    {userInfo?.portfolioUrl || userInfo?.PortfolioUrl ? (
                      <a
                        href={userInfo.portfolioUrl || userInfo.PortfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary flex items-center gap-1 hover:underline font-semibold"
                      >
                        {UI_TEXT.USER_PROFILE.VIEW_LINK}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      '—'
                    )}
                  </InfoItem>
                  <InfoItem label={PROFILE_UI.LABELS.CV}>
                    {userInfo?.cvUrl || userInfo?.CvUrl ? (
                      <button
                        type="button"
                        onClick={onDownloadCV}
                        className="text-primary flex items-center gap-1 hover:underline font-semibold"
                      >
                        {PROFILE_UI.CV_HELPER.DOWNLOAD_CV_ACTION}
                        <Download size={14} />
                      </button>
                    ) : (
                      '—'
                    )}
                  </InfoItem>
                </>
              )}
              {/* Professional Roles (Mentor, HR, Enterprise Admin) */}
              {[
                USER_ROLE.MENTOR,
                USER_ROLE.HR,
                USER_ROLE.ENTERPRISE_ADMIN,
                String(USER_ROLE.MENTOR),
                String(USER_ROLE.HR),
                String(USER_ROLE.ENTERPRISE_ADMIN),
                'mentor',
                'hr',
                'enterpriseadmin',
              ].includes(String(userInfo?.role || userInfo?.Role).toLowerCase()) && (
                <>
                  <InfoItem
                    label={PROFILE_UI.LABELS.POSITION}
                    value={userInfo?.position || userInfo?.Position || '—'}
                  />
                  <InfoItem
                    label={PROFILE_UI.LABELS.EXPERTISE}
                    value={userInfo?.expertise || userInfo?.Expertise || '—'}
                  />
                  <div className="md:col-span-4">
                    <InfoItem
                      label={PROFILE_UI.LABELS.BIO}
                      value={userInfo?.bio || userInfo?.Bio || '—'}
                    />
                  </div>
                </>
              )}
              {/* School Admin */}
              {[USER_ROLE.SCHOOL_ADMIN, String(USER_ROLE.SCHOOL_ADMIN), 'schooladmin'].includes(
                String(userInfo?.role || userInfo?.Role).toLowerCase()
              ) && (
                <>
                  <InfoItem
                    label={PROFILE_UI.LABELS.POSITION}
                    value={userInfo?.position || userInfo?.Position || '—'}
                  />
                  <InfoItem
                    label={PROFILE_UI.LABELS.DEPARTMENT}
                    value={userInfo?.department || userInfo?.Department || '—'}
                  />
                  <div className="md:col-span-4">
                    <InfoItem
                      label={PROFILE_UI.LABELS.BIO}
                      value={userInfo?.bio || userInfo?.Bio || '—'}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <Button
              variant="default"
              size="lg"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-2 rounded-full px-10 font-bold shadow-lg"
            >
              <Edit2 size={18} />
              {PROFILE_UI.BUTTONS.EDIT}
            </Button>
          </div>
        </div>
      </Card>

      <ProfileEditModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        userInfo={userInfo}
        onSave={onSaveProfile}
        loading={updatingProfile}
        avatarUrl={avatarUrl}
        onDownloadCV={onDownloadCV}
      />
    </>
  );
}
