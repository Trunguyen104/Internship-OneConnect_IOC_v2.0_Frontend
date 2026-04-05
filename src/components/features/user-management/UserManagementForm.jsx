'use client';

import { Select as AntSelect } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  unitRequired,
  useUserManagementForm,
} from '@/components/features/user-management/hooks/useUserManagementForm';
import AvatarUploader from '@/components/ui/avataruploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
  USER_ROLE,
  USER_ROLE_LABEL,
  USER_STATUS,
  USER_STATUS_LABEL,
} from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';
import { REGEX } from '@/lib/validators';
import { useToast } from '@/providers/ToastProvider';
import { mediaService } from '@/services/media.service';
import { userManagementService } from '@/services/user-management.service';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

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

function CreateForm({ onSuccess, onCancel }) {
  const {
    role,
    setRole,
    unitId,
    setUnitId,
    termId,
    setTermId,
    terms,
    fetchingTerms,
    currentUser,
    currentUnits,
    fetchingUnits,
    loading,
    allowedRoles,
    isUnitLocked,
    unitLabel,
    errors,
    handleSubmit,
  } = useUserManagementForm(onSuccess);

  if (fetchingUnits && !currentUser) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form
      id="user-create-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 h-full"
      noValidate
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 flex-1 content-start">
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="fullName"
            className="text-[11px] font-black uppercase tracking-widest text-muted/60"
          >
            {UI_TEXT.USER_MANAGEMENT.FULL_NAME}
          </label>
          <Input
            id="fullName"
            name="fullName"
            required
            placeholder={UI_TEXT.USER_MANAGEMENT.FULL_NAME_PLACEHOLDER}
            className="rounded-2xl border-gray-100 h-12"
            error={errors.fullName}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-[11px] font-black uppercase tracking-widest text-muted/60"
          >
            {UI_TEXT.USER_MANAGEMENT.EMAIL_ADDRESS}
          </label>
          <Input
            id="email"
            name="email"
            type="text"
            inputMode="email"
            required
            placeholder={UI_TEXT.USER_MANAGEMENT.EMAIL_PLACEHOLDER}
            className="rounded-2xl border-gray-100 h-12"
            error={errors.email}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted/60">
            {UI_TEXT.USER_MANAGEMENT.ASSIGNED_ROLE}
          </label>
          <Select
            value={role ? String(role) : undefined}
            onChange={(val) => {
              setRole(Number(val));
              if (!isUnitLocked) setUnitId('');
            }}
            disabled={allowedRoles.length <= 1}
            options={allowedRoles.map((v) => ({ label: USER_ROLE_LABEL[v], value: String(v) }))}
            className="!h-12 !rounded-2xl !border-gray-100"
            placeholder={UI_TEXT.USER_MANAGEMENT.ROLE_PLACEHOLDER}
            error={errors.role}
          />
        </div>

        {unitRequired(role) && !isUnitLocked && (
          <div className="animate-in slide-in-from-top-2 duration-300 space-y-2 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted/60">
              {unitLabel}
            </label>
            <Select
              value={unitId}
              onChange={setUnitId}
              disabled={isUnitLocked}
              options={currentUnits.map((u) => ({
                label: u.name,
                value: String(u.universityId || u.enterpriseId || u.id),
              }))}
              className="!h-12 !rounded-2xl !border-gray-100"
              placeholder={UI_TEXT.USER_MANAGEMENT.UNIVERSITY_PLACEHOLDER}
              error={errors.unitId}
            />
          </div>
        )}

        {/* Term selector — only shown for Student role after university is selected */}
        {role === 7 && unitId && (
          <div className="animate-in slide-in-from-top-2 duration-300 space-y-2 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted/60">
              {UI_TEXT.USER_MANAGEMENT.INTERNSHIP_TERM_LABEL}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex w-full flex-col gap-1.5">
              {(() => {
                const filteredTerms = (terms || []).filter((t) => t.status === 1 || t.status === 2);
                return (
                  <AntSelect
                    value={termId || undefined}
                    onChange={setTermId}
                    loading={fetchingTerms}
                    disabled={fetchingTerms || !filteredTerms.length}
                    options={filteredTerms.map((t) => {
                      const statusMap = {
                        1: 'Upcoming',
                        2: 'Active',
                        3: 'Ended',
                        4: 'Closed',
                      };
                      const statusLabel = statusMap[t.status] || t.status;
                      return {
                        label: statusLabel ? `${t.name} (${statusLabel})` : t.name,
                        value: t.termId || t.id,
                      };
                    })}
                    className="w-full"
                    size="large"
                    status={errors.termId ? 'error' : undefined}
                    placeholder={
                      !filteredTerms.length && !fetchingTerms
                        ? 'No active terms available'
                        : UI_TEXT.USER_MANAGEMENT.STUDENT_PLACEHOLDER
                    }
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                );
              })()}
              {errors.termId && <p className="text-xs font-medium text-red-500">{errors.termId}</p>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="text-[11px] font-black uppercase tracking-widest text-muted/60"
          >
            {UI_TEXT.USER_MANAGEMENT.PHONE_NUMBER}
          </label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder={UI_TEXT.USER_MANAGEMENT.PHONE_PLACEHOLDER}
            className="rounded-2xl border-gray-100 h-12"
            error={errors.phoneNumber}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 bg-white">
        <Button
          type="button"
          variant="ghost"
          className="rounded-full h-9 px-4 font-semibold text-sm text-muted/60 hover:text-text transition-colors"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.COMMON.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={loading || fetchingUnits}
          className="bg-primary hover:bg-primary-hover min-w-[100px] rounded-full h-9 px-5 text-sm font-bold uppercase tracking-wider shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-white"
        >
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : UI_TEXT.USER_MANAGEMENT.CREATE_BTN}
        </Button>
      </div>
    </form>
  );
}

function UpdateForm({ userId, onSuccess, onCancel }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    setBusy(true);
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
      .catch((e) =>
        toast.error(e?.data?.message || e?.message || UI_TEXT.USER_MANAGEMENT.ERR_LOAD_FAILED)
      )
      .finally(() => {
        if (alive) setBusy(false);
      });
    return () => {
      alive = false;
    };
  }, [toast, userId]);

  const doUpdate = async (e) => {
    if (e) e.preventDefault();
    const nextErrors = {};
    if (!editForm.fullName.trim()) nextErrors.fullName = UI_TEXT.USER_MANAGEMENT.ERR_FULL_NAME_REQ;
    if (editForm.fullName && !REGEX.NAME.test(editForm.fullName.trim())) {
      nextErrors.fullName = 'Name must only contain letters and spaces';
    }
    if (editForm.dateOfBirth && !REGEX.DATE.test(editForm.dateOfBirth.trim()))
      nextErrors.dateOfBirth = UI_TEXT.USER_MANAGEMENT.ERR_DOB_FORMAT;
    if (editForm.studentGpa !== '' && Number.isNaN(Number(editForm.studentGpa)))
      nextErrors.studentGpa = UI_TEXT.USER_MANAGEMENT.ERR_GPA_NUMBER;
    if (editForm.phoneNumber && !REGEX.PHONE.test(editForm.phoneNumber.trim()))
      nextErrors.phoneNumber = UI_TEXT.USER_MANAGEMENT.ERR_PHONE_INVALID;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      let finalAvatarUrl = editForm.avatarUrl;
      if (editForm.avatarUrl instanceof File) {
        const uploadRes = await mediaService.uploadImage(editForm.avatarUrl, 'Users');
        const uploadData = uploadRes?.data ?? uploadRes;
        finalAvatarUrl =
          typeof uploadData === 'string' ? uploadData : uploadData?.url || finalAvatarUrl;
      }

      const payload = {
        fullName: editForm.fullName.trim(),
        phoneNumber: editForm.phoneNumber?.trim() || undefined,
        status: editForm.status ? Number(editForm.status) : undefined,
        dateOfBirth: editForm.dateOfBirth?.trim() || undefined,
        gender: editForm.gender ? Number(editForm.gender) : undefined,
        avatarUrl: typeof finalAvatarUrl === 'string' ? finalAvatarUrl.trim() : undefined,
        studentClass: editForm.studentClass?.trim() || undefined,
        studentMajor: editForm.studentMajor?.trim() || undefined,
        studentGpa: editForm.studentGpa !== '' ? Number(editForm.studentGpa) : undefined,
      };
      await userManagementService.update(userId, payload);
      toast.success(UI_TEXT.USER_MANAGEMENT.SUCCESS_UPDATED);
      useAdminUsersStore.increment();
      onSuccess?.();
    } catch (e2) {
      toast.error(e2?.data?.message || e2?.message || UI_TEXT.USER_MANAGEMENT.ERR_UPDATE_FAILED);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-6 flex-1 content-start overflow-y-auto pb-4">
        {/* Avatar Section at the top */}
        <div className="flex flex-col items-center gap-3 py-6 border-b border-gray-50 bg-gray-50/20 rounded-3xl mb-2">
          <AvatarUploader
            value={editForm.avatarUrl}
            fullName={editForm.fullName}
            onChange={(file) => setEditForm((p) => ({ ...p, avatarUrl: file }))}
          />
          <span className="text-[11px] font-black uppercase tracking-widest text-muted/40">
            {UI_TEXT.USER_MANAGEMENT.AVATAR_LABEL}
          </span>
        </div>

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
              options={Object.values(USER_STATUS).map((v) => ({
                label: USER_STATUS_LABEL[v] || String(v),
                value: String(v),
              }))}
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

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 bg-white">
        <Button
          type="button"
          variant="ghost"
          className="rounded-full h-9 px-4 font-semibold text-sm text-muted/60 hover:text-text transition-colors"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.COMMON.CANCEL}
        </Button>
        <Button
          onClick={doUpdate}
          disabled={busy}
          className="bg-primary hover:bg-primary-hover min-w-[100px] rounded-full h-9 px-5 text-sm font-bold uppercase tracking-wider shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-white"
        >
          {busy ? <Spinner className="mr-2 h-4 w-4" /> : UI_TEXT.BUTTON.SAVE_CHANGES}
        </Button>
      </div>
    </div>
  );
}

/**
 * UserManagementForm - Universal Form for Creating/Updating users.
 */
export default function UserManagementForm({ userId, onSuccess, onCancel }) {
  if (userId) {
    return <UpdateForm userId={userId} onSuccess={onSuccess} onCancel={onCancel} />;
  }
  return <CreateForm onSuccess={onSuccess} onCancel={onCancel} />;
}

UserManagementForm.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};
