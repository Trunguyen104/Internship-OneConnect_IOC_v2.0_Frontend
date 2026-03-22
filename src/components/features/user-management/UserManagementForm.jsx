'use client';

import {
  unitRequired,
  useUserManagementForm,
} from '@/components/features/user-management/hooks/useUserManagementForm';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="fullName">{UI_TEXT.USER_MANAGEMENT.FULL_NAME}</FieldLabel>
          <Input
            id="fullName"
            name="fullName"
            required
            placeholder={UI_TEXT.USER_MANAGEMENT.FULL_NAME_PLACEHOLDER}
            className="rounded-xl"
            error={errors.fullName}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">{UI_TEXT.USER_MANAGEMENT.EMAIL_ADDRESS}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder={UI_TEXT.USER_MANAGEMENT.EMAIL_PLACEHOLDER}
            className="rounded-xl"
            error={errors.email}
          />
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.USER_MANAGEMENT.ASSIGNED_ROLE}</FieldLabel>
          <Select
            value={String(role)}
            onValueChange={(val) => {
              setRole(Number(val));
              if (!isUnitLocked) setUnitId('');
            }}
            disabled={allowedRoles.length <= 1}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedRoles.map((v) => (
                <SelectItem key={v} value={String(v)} className="rounded-lg">
                  {USER_ROLE_LABEL[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {unitRequired(role) && (
          <Field className="animate-in slide-in-from-top-2 duration-300 md:col-span-2">
            <FieldLabel>{unitLabel}</FieldLabel>
            <Select value={unitId} onValueChange={setUnitId} disabled={isUnitLocked}>
              <SelectTrigger className="rounded-xl">
                <SelectValue
                  placeholder={
                    fetchingUnits
                      ? UI_TEXT.USER_MANAGEMENT.LOADING_DOTS
                      : `${UI_TEXT.USER_MANAGEMENT.SELECT_A} ${unitLabel}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((u) => (
                  <SelectItem
                    key={u.universityId || u.enterpriseId || u.id}
                    value={String(u.universityId || u.enterpriseId || u.id)}
                    className="rounded-lg"
                  >
                    {u.name}
                  </SelectItem>
                ))}
                {currentUnits.length === 0 && !fetchingUnits && (
                  <div className="p-2 text-center text-xs text-slate-400">
                    {UI_TEXT.USER_MANAGEMENT.NO} {unitLabel.toLowerCase()}{' '}
                    {UI_TEXT.USER_MANAGEMENT.S_FOUND_SUFFIX}
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.unitId ? (
              <div className="mt-1 text-xs font-semibold text-rose-600">{errors.unitId}</div>
            ) : null}
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="phoneNumber">{UI_TEXT.USER_MANAGEMENT.PHONE_NUMBER}</FieldLabel>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder={UI_TEXT.USER_MANAGEMENT.PHONE_PLACEHOLDER}
            className="rounded-xl"
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" className="rounded-full" onClick={() => onCancel?.()}>
          {UI_TEXT.COMMON.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={loading || fetchingUnits}
          className="bg-primary hover:bg-primary-hover min-w-[120px] rounded-full"
        >
          {loading ? <Spinner className="mr-2" /> : UI_TEXT.USER_MANAGEMENT.CREATE_BTN}
        </Button>
      </div>
    </form>
  );
}
