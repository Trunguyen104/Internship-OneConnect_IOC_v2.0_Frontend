'use client';

import { Edit, Lock } from 'lucide-react';

import AvatarUploader from '@/components/ui/avataruploader';
import { Button } from '@/components/ui/button';
import { USER_ROLE } from '@/constants/common/enums';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function ProfileHeader({
  userInfo,
  avatarUrl,
  onAvatarChange,
  onEditClick,
  onChangePassClick,
}) {
  const isStudent = [USER_ROLE.STUDENT, String(USER_ROLE.STUDENT), '7', 'student'].includes(
    String(userInfo?.role || userInfo?.Role).toLowerCase()
  );

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 md:p-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Left: Avatar & Basic Info */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
          <div className="shrink-0">
            <div className="rounded-full border-4 border-slate-50 shadow-sm overflow-hidden bg-white">
              <AvatarUploader
                value={avatarUrl}
                onChange={onAvatarChange}
                fullName={
                  userInfo?.fullName || userInfo?.FullName || PROFILE_UI.AVATAR.DEFAULT_NAME
                }
                disabled={true}
                size={120}
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl tracking-tight">
              {userInfo?.fullName || userInfo?.FullName || '—'}
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {PROFILE_UI.ROLE_LABELS[userInfo?.role || userInfo?.Role] || userInfo?.role || '—'}
              </div>
              <p className="text-sm font-medium text-slate-500">
                {userInfo?.email || userInfo?.Email || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions Column */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <Button
            variant="default"
            onClick={onEditClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Edit size={18} />
            {PROFILE_UI.BUTTONS.EDIT}
          </Button>

          <Button
            variant="outline"
            onClick={onChangePassClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-11 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-all hover:border-slate-300 active:scale-95"
          >
            <Lock size={16} />
            {PROFILE_UI.CHANGE_PASSWORD.TITLE}
          </Button>
        </div>
      </div>
    </div>
  );
}
