'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/providers/ToastProvider';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';
import { USER_ROLE, USER_ROLE_LABEL } from '@/constants/admin-users/enums';

import { adminUsersService } from './adminUsers.service';
import { universityService } from '@/services/university.service';
import { enterpriseService } from '@/services/enterprise.service';

function isUniversityRole(role) {
  return role === USER_ROLE.SCHOOL_ADMIN || role === USER_ROLE.STUDENT;
}

function isEnterpriseRole(role) {
  return role === USER_ROLE.ENTERPRISE_ADMIN || role === USER_ROLE.HR || role === USER_ROLE.MENTOR;
}

function unitRequired(role) {
  return isUniversityRole(role) || isEnterpriseRole(role);
}

export default function AdminUsersForm({ onSuccess, onCancel }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // States for dynamic data
  const [role, setRole] = useState(USER_ROLE.MODERATOR);
  const [universities, setUniversities] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [fetchingUnits, setFetchingUnits] = useState(false);

  const currentUnits = isUniversityRole(role)
    ? universities
    : isEnterpriseRole(role)
      ? enterprises
      : [];
  const unitLabel = isUniversityRole(role)
    ? 'University'
    : isEnterpriseRole(role)
      ? 'Enterprise'
      : 'Unit';

  useEffect(() => {
    const fetchUnits = async () => {
      setFetchingUnits(true);
      try {
        const [uniRes, entRes] = await Promise.all([
          universityService.getAll({ PageNumber: 1, PageSize: 1000 }),
          enterpriseService.getAll({ PageNumber: 1, PageSize: 1000 }),
        ]);

        const uniData = uniRes?.data?.items ?? uniRes?.items ?? [];
        const entData = entRes?.data?.items ?? entRes?.items ?? [];

        setUniversities(uniData);
        setEnterprises(entData);
      } catch (err) {
        console.error('Failed to fetch units', err);
      } finally {
        setFetchingUnits(false);
      }
    };
    fetchUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      role: Number(role),
      phoneNumber: String(formData.get('phoneNumber') || '').trim() || undefined,
      unitId: unitRequired(Number(role)) ? unitId : undefined,
    };

    const nextErrors = {};
    if (!payload.fullName) nextErrors.fullName = 'Full name is required';
    if (!payload.email) nextErrors.email = 'Email is required';
    if (payload.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(payload.email))
      nextErrors.email = 'Invalid email';
    if (unitRequired(payload.role) && !payload.unitId)
      nextErrors.unitId = `Please select a ${unitLabel}`;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setLoading(false);
      return;
    }

    try {
      await adminUsersService.create(payload);
      useAdminUsersStore.increment();
      onSuccess?.();
      toast.success('Successfully created');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Create failed');
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='fullName'>Full Name</FieldLabel>
          <Input
            id='fullName'
            name='fullName'
            required
            placeholder='Enter full name'
            className='rounded-xl'
            error={errors.fullName}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>Email Address</FieldLabel>
          <Input
            id='email'
            name='email'
            type='email'
            required
            placeholder='Enter email address'
            className='rounded-xl'
            error={errors.email}
          />
        </Field>

        <Field>
          <FieldLabel>Assigned Role</FieldLabel>
          <Select
            value={String(role)}
            onValueChange={(val) => {
              setRole(Number(val));
              setUnitId('');
            }}
          >
            <SelectTrigger className='rounded-xl'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(USER_ROLE).map((v) => (
                <SelectItem key={v} value={String(v)} className='rounded-lg'>
                  {USER_ROLE_LABEL[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {unitRequired(role) && (
          <Field className='animate-in slide-in-from-top-2 duration-300 md:col-span-2'>
            <FieldLabel>{unitLabel}</FieldLabel>
            <Select value={unitId} onValueChange={setUnitId}>
              <SelectTrigger className='rounded-xl'>
                <SelectValue placeholder={fetchingUnits ? 'Loading...' : `Select ${unitLabel}`} />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((u) => (
                  <SelectItem
                    key={u.universityId || u.enterpriseId || u.id}
                    value={u.universityId || u.enterpriseId || u.id}
                    className='rounded-lg'
                  >
                    {u.name}
                  </SelectItem>
                ))}
                {currentUnits.length === 0 && !fetchingUnits && (
                  <div className='p-2 text-center text-xs text-slate-400'>
                    No {unitLabel.toLowerCase()}s found
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.unitId ? (
              <div className='mt-1 text-xs font-semibold text-rose-600'>{errors.unitId}</div>
            ) : null}
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor='phoneNumber'>Phone Number</FieldLabel>
          <Input
            id='phoneNumber'
            name='phoneNumber'
            placeholder='Enter phone number'
            className='rounded-xl'
          />
        </Field>
      </FieldGroup>

      <div className='flex justify-end gap-3'>
        <Button type='button' variant='ghost' className='rounded-full' onClick={() => onCancel?.()}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={loading || fetchingUnits}
          className='bg-primary hover:bg-primary-hover min-w-[120px] rounded-full'
        >
          {loading ? <Spinner className='mr-2' /> : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
