'use client';

import {
  unitRequired,
  useUserManagementForm,
} from '@/components/features/user-management/hooks/useUserManagementForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { USER_ROLE_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

export default function UserManagementForm({ onSuccess, onCancel }) {
  const {
    role,
    setRole,
    unitId,
    setUnitId,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            type="email"
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
            options={allowedRoles.map((v) => ({
              label: USER_ROLE_LABEL[v],
              value: String(v),
            }))}
            className="!h-12 !rounded-2xl !border-gray-100"
            placeholder="Select a role"
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
              placeholder={
                fetchingUnits
                  ? UI_TEXT.USER_MANAGEMENT.LOADING_DOTS
                  : `${UI_TEXT.USER_MANAGEMENT.SELECT_A} ${unitLabel}`
              }
            />
            {errors.unitId && (
              <div className="mt-1 text-xs font-semibold text-rose-600">{errors.unitId}</div>
            )}
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
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
        <Button
          type="button"
          variant="ghost"
          className="rounded-full h-11 px-6 font-bold text-muted/60 hover:text-text transition-colors"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.COMMON.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={loading || fetchingUnits}
          className="bg-primary hover:bg-primary-hover min-w-[140px] rounded-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white"
        >
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : UI_TEXT.USER_MANAGEMENT.CREATE_BTN}
        </Button>
      </div>
    </form>
  );
}
