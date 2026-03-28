'use client';

import React, { useEffect, useState } from 'react';

import AvatarUploader from '@/components/ui/avataruploader';
import CompoundModal from '@/components/ui/CompoundModal';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/select';
import { USER_ROLE, USER_STATUS, USER_STATUS_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { mediaService } from '@/services/media.service';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { userManagementService } from '../user-management.service';

const initialEditForm = {
  fullName: '',
  phoneNumber: '',
  status: '',
  dateOfBirth: '',
  gender: '',
  avatarUrl: '',
  studentClass: '',
  studentMajor: '',
  studentGpa: '',
};

export default function UserManagementUpdateModal({ open, userId, onToggle }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (!userId) return;

    let alive = true;
    setBusy(true);
    setDetail(null);

    userManagementService
      .getById(userId)
      .then((res) => {
        if (!alive) return;
        const data = res?.data ?? res;
        setDetail(data);
        setEditForm({
          fullName: data?.fullName || data?.FullName || '',
          phoneNumber: data?.phoneNumber || data?.PhoneNumber || '',
          status: (data?.status ?? data?.Status) ? String(data.status ?? data.Status) : '',
          dateOfBirth:
            (data?.dateOfBirth ?? data?.DateOfBirth)
              ? String(data.dateOfBirth ?? data.DateOfBirth)
              : '',
          gender: (data?.gender ?? data?.Gender) ? String(data.gender ?? data.Gender) : '',
          avatarUrl: data?.avatarUrl || data?.AvatarUrl || '',
          studentClass: data?.studentClass || data?.StudentClass || '',
          studentMajor: data?.studentMajor || data?.StudentMajor || '',
          studentGpa:
            (data?.studentGpa ?? data?.StudentGpa) !== null &&
            (data?.studentGpa ?? data?.StudentGpa) !== undefined
              ? String(data.studentGpa ?? data.StudentGpa)
              : '',
        });
      })
      .catch((e) => {
        toast.error(e?.data?.message || e?.message || 'Failed to load user detail');
        onToggle?.(false);
      })
      .finally(() => {
        if (alive) setBusy(false);
      });

    return () => {
      alive = false;
    };
  }, [open, toast, userId, onToggle]);

  const doUpdate = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const nextErrors = {};
    if (!editForm.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (editForm.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(editForm.dateOfBirth.trim())) {
      nextErrors.dateOfBirth = 'Date of birth must be in YYYY-MM-DD format';
    }
    if (editForm.studentGpa !== '' && Number.isNaN(Number(editForm.studentGpa))) {
      nextErrors.studentGpa = 'Student GPA must be a number';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      let finalAvatarUrl = editForm.avatarUrl;
      if (editForm.avatarUrl instanceof File) {
        const uploadRes = await mediaService.uploadImage(editForm.avatarUrl, 'Users');
        finalAvatarUrl = uploadRes?.data ?? uploadRes;
      }

      const payload = {
        fullName: editForm.fullName.trim(),
        phoneNumber: editForm.phoneNumber?.trim() || undefined,
        status: editForm.status ? Number(editForm.status) : undefined,
        dateOfBirth: editForm.dateOfBirth?.trim() || undefined,
        gender: editForm.gender ? Number(editForm.gender) : undefined,
        avatarUrl:
          typeof finalAvatarUrl === 'string' ? finalAvatarUrl.trim() : finalAvatarUrl || undefined,
        studentClass: editForm.studentClass?.trim() || undefined,
        studentMajor: editForm.studentMajor?.trim() || undefined,
        studentGpa: editForm.studentGpa !== '' ? Number(editForm.studentGpa) : undefined,
      };

      await userManagementService.update(userId, payload);
      toast.success('Updated user');
      useAdminUsersStore.increment();
      onToggle?.(false);
    } catch (e2) {
      toast.error(e2?.data?.message || e2?.message || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CompoundModal open={open} onCancel={() => onToggle?.(false)} width={560}>
      <CompoundModal.Header
        title={UI_TEXT.USER_MANAGEMENT.UPDATE_PROFILE}
        subtitle={UI_TEXT.USER_MANAGEMENT.UPDATE_INFO}
      />

      <CompoundModal.Content className="mt-4 overflow-y-auto pb-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="fullName"
                className="text-[11px] font-black uppercase tracking-widest text-muted/60"
              >
                {UI_TEXT.USER_MANAGEMENT.FULL_NAME_LABEL}
              </label>
              <Input
                id="fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                error={errors.fullName}
                className="rounded-2xl border-gray-100 h-12"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="text-[11px] font-black uppercase tracking-widest text-muted/60"
              >
                {UI_TEXT.USER_MANAGEMENT.PHONE_OPTIONAL}
              </label>
              <Input
                id="phoneNumber"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                className="rounded-2xl border-gray-100 h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted/60">
                {UI_TEXT.USER_MANAGEMENT.STATUS}
              </label>
              <Select
                value={editForm.status}
                onChange={(v) => setEditForm((p) => ({ ...p, status: v }))}
                options={[
                  { label: UI_TEXT.COMMON.MINUS, value: '' },
                  ...Object.values(USER_STATUS).map((v) => ({
                    label: USER_STATUS_LABEL[v] || String(v),
                    value: String(v),
                  })),
                ]}
                className="!h-12 !rounded-2xl !border-gray-100"
                placeholder={UI_TEXT.USER_MANAGEMENT.STATUS}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted/60">
                {UI_TEXT.USER_MANAGEMENT.GENDER}
              </label>
              <Select
                value={editForm.gender}
                onChange={(v) => setEditForm((p) => ({ ...p, gender: v }))}
                options={[
                  { label: UI_TEXT.COMMON.MINUS, value: '' },
                  { label: UI_TEXT.USER_MANAGEMENT.MALE, value: '1' },
                  { label: UI_TEXT.USER_MANAGEMENT.FEMALE, value: '2' },
                  { label: UI_TEXT.USER_MANAGEMENT.OTHER, value: '3' },
                ]}
                className="!h-12 !rounded-2xl !border-gray-100"
                placeholder={UI_TEXT.USER_MANAGEMENT.GENDER}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="text-[11px] font-black uppercase tracking-widest text-muted/60"
              >
                {UI_TEXT.USER_MANAGEMENT.DOB_LABEL}
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) => setEditForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                error={errors.dateOfBirth}
                className="rounded-2xl border-gray-100 h-12"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 py-6 border-y border-gray-50 bg-gray-50/30 rounded-3xl">
            <AvatarUploader
              value={editForm.avatarUrl}
              fullName={editForm.fullName}
              onChange={(file) => setEditForm((p) => ({ ...p, avatarUrl: file }))}
            />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted/40">
              {UI_TEXT.USER_MANAGEMENT.AVATAR_LABEL}
            </span>
          </div>

          {detail?.role === USER_ROLE.STUDENT && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="studentClass"
                  className="text-[11px] font-black uppercase tracking-widest text-muted/60"
                >
                  {UI_TEXT.USER_MANAGEMENT.CLASS_LABEL}
                </label>
                <Input
                  id="studentClass"
                  value={editForm.studentClass}
                  onChange={(e) => setEditForm((p) => ({ ...p, studentClass: e.target.value }))}
                  className="rounded-2xl border-gray-100 h-12"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="studentMajor"
                  className="text-[11px] font-black uppercase tracking-widest text-muted/60"
                >
                  {UI_TEXT.USER_MANAGEMENT.MAJOR_LABEL}
                </label>
                <Input
                  id="studentMajor"
                  value={editForm.studentMajor}
                  onChange={(e) => setEditForm((p) => ({ ...p, studentMajor: e.target.value }))}
                  className="rounded-2xl border-gray-100 h-12"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="studentGpa"
                  className="text-[11px] font-black uppercase tracking-widest text-muted/60"
                >
                  {UI_TEXT.USER_MANAGEMENT.GPA_LABEL}
                </label>
                <Input
                  id="studentGpa"
                  value={editForm.studentGpa}
                  onChange={(e) => setEditForm((p) => ({ ...p, studentGpa: e.target.value }))}
                  error={errors.studentGpa}
                  className="rounded-2xl border-gray-100 h-12"
                />
              </div>
            </div>
          )}
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={() => onToggle?.(false)}
        onConfirm={doUpdate}
        confirmText={UI_TEXT.BUTTON.SAVE_CHANGES}
        loading={busy}
      />
    </CompoundModal>
  );
}
