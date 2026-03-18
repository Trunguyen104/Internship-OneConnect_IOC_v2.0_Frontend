'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';
import { USER_ROLE, USER_STATUS, USER_STATUS_LABEL } from '@/constants/admin-users/enums';

import { adminUsersService } from '../adminUsers.service';

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

export default function AdminUserUpdateModal({ open, userId, onToggle }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);

  useEffect(() => {
    if (!open) return;
    if (!userId) return;

    let alive = true;
    setBusy(true);
    setDetail(null);

    adminUsersService
      .getById(userId)
      .then((res) => {
        if (!alive) return;
        const data = res?.data ?? res;
        setDetail(data);
        setEditForm({
          fullName: data?.fullName || '',
          phoneNumber: data?.phoneNumber || '',
          status: data?.status ? String(data.status) : '',
          dateOfBirth: data?.dateOfBirth ? String(data.dateOfBirth) : '',
          gender: data?.gender ? String(data.gender) : '',
          avatarUrl: data?.avatarUrl || '',
          studentClass: data?.studentClass || '',
          studentMajor: data?.studentMajor || '',
          studentGpa:
            data?.studentGpa !== null && data?.studentGpa !== undefined ? String(data.studentGpa) : '',
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

    const payload = {
      fullName: editForm.fullName.trim(),
      phoneNumber: editForm.phoneNumber?.trim() || undefined,
      status: editForm.status ? Number(editForm.status) : undefined,
      dateOfBirth: editForm.dateOfBirth?.trim() || undefined,
      gender: editForm.gender ? Number(editForm.gender) : undefined,
      avatarUrl: editForm.avatarUrl?.trim() || undefined,
      studentClass: editForm.studentClass?.trim() || undefined,
      studentMajor: editForm.studentMajor?.trim() || undefined,
      studentGpa: editForm.studentGpa !== '' ? Number(editForm.studentGpa) : undefined,
    };

    if (!payload.fullName) {
      toast.error('Full name is required');
      return;
    }

    setBusy(true);
    try {
      await adminUsersService.update(userId, payload);
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
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent aria-describedby={undefined}>
        <form onSubmit={doUpdate}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.ADMIN_USERS.UPDATE_PROFILE}</DialogTitle>
            <DialogDescription>Update admin user information.</DialogDescription>
          </DialogHeader>

          <FieldGroup className='mt-4 gap-4'>
            <Field>
              <FieldLabel htmlFor='fullName'>Full name</FieldLabel>
              <Input
                id='fullName'
                value={editForm.fullName}
                onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='phoneNumber'>Phone (optional)</FieldLabel>
              <Input
                id='phoneNumber'
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              />
            </Field>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Field>
                <FieldLabel>{UI_TEXT.ADMIN_USERS.STATUS}</FieldLabel>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm((p) => ({ ...p, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={UI_TEXT.ADMIN_USERS.STATUS} />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value=''>-</SelectItem>
                    {Object.values(USER_STATUS).map((v) => (
                      <SelectItem key={String(v)} value={String(v)}>
                        {USER_STATUS_LABEL[v] || String(v)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select value={editForm.gender} onValueChange={(v) => setEditForm((p) => ({ ...p, gender: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder='Gender' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value=''>-</SelectItem>
                    <SelectItem value='1'>Male</SelectItem>
                    <SelectItem value='2'>Female</SelectItem>
                    <SelectItem value='3'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor='dateOfBirth'>Date of birth (YYYY-MM-DD)</FieldLabel>
              <Input
                id='dateOfBirth'
                value={editForm.dateOfBirth}
                onChange={(e) => setEditForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='avatarUrl'>Avatar URL (optional)</FieldLabel>
              <Input
                id='avatarUrl'
                value={editForm.avatarUrl}
                onChange={(e) => setEditForm((p) => ({ ...p, avatarUrl: e.target.value }))}
              />
            </Field>

            {detail?.role === USER_ROLE.STUDENT ? (
              <>
                <Field>
                  <FieldLabel htmlFor='studentClass'>Student class (optional)</FieldLabel>
                  <Input
                    id='studentClass'
                    value={editForm.studentClass}
                    onChange={(e) => setEditForm((p) => ({ ...p, studentClass: e.target.value }))}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='studentMajor'>Student major (optional)</FieldLabel>
                  <Input
                    id='studentMajor'
                    value={editForm.studentMajor}
                    onChange={(e) => setEditForm((p) => ({ ...p, studentMajor: e.target.value }))}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='studentGpa'>Student GPA (optional)</FieldLabel>
                  <Input
                    id='studentGpa'
                    value={editForm.studentGpa}
                    onChange={(e) => setEditForm((p) => ({ ...p, studentGpa: e.target.value }))}
                  />
                </Field>
              </>
            ) : null}
          </FieldGroup>

          <DialogFooter className='mt-4'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                {UI_TEXT.BUTTON.CLOSE}
              </Button>
            </DialogClose>
            <Button type='submit' disabled={busy}>
              {UI_TEXT.BUTTON.SAVE_CHANGES}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

