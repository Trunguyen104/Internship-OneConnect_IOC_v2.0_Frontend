'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UI_TEXT } from '@/lib/UI_Text';
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

export default function AdminUsersForm({ onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // States for dynamic data
  const [role, setRole] = useState(USER_ROLE.MODERATOR);
  const [universities, setUniversities] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [fetchingUnits, setFetchingUnits] = useState(false);

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
      avatarUrl: String(formData.get('avatarUrl') || '').trim() || undefined,
      unitId: unitRequired(Number(role)) ? unitId : undefined,
    };

    if (!payload.fullName || !payload.email) {
      setError('Full name and email are required');
      setLoading(false);
      return;
    }
    
    if (unitRequired(payload.role) && !payload.unitId) {
      setError('Please select a University or Enterprise');
      setLoading(false);
      return;
    }

    try {
      setError('');
      await adminUsersService.create(payload);
      useAdminUsersStore.increment();
      onSuccess?.();
      toast.success('Successfully created');
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Create failed');
      setLoading(false);
    }
    setLoading(false);
  };

  const currentUnits = isUniversityRole(role) ? universities : isEnterpriseRole(role) ? enterprises : [];
  const unitLabel = isUniversityRole(role) ? 'University' : isEnterpriseRole(role) ? 'Enterprise' : 'Unit';

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='fullName'>Full Name</FieldLabel>
          <Input id='fullName' name='fullName' required placeholder='Enter full name' className='rounded-xl' />
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>Email Address</FieldLabel>
          <Input id='email' name='email' type='email' required placeholder='Enter email address' className='rounded-xl' />
        </Field>

        <Field>
          <FieldLabel>Assigned Role</FieldLabel>
          <Select value={String(role)} onValueChange={(val) => { setRole(Number(val)); setUnitId(''); }}>
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
          <Field className='md:col-span-2 animate-in slide-in-from-top-2 duration-300'>
            <FieldLabel>{unitLabel}</FieldLabel>
            <Select value={unitId} onValueChange={setUnitId}>
              <SelectTrigger className='rounded-xl'>
                <SelectValue placeholder={fetchingUnits ? 'Loading...' : `Select ${unitLabel}`} />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((u) => (
                  <SelectItem key={u.universityId || u.enterpriseId || u.id} value={u.universityId || u.enterpriseId || u.id} className='rounded-lg'>
                    {u.name}
                  </SelectItem>
                ))}
                {currentUnits.length === 0 && !fetchingUnits && (
                  <div className='p-2 text-center text-xs text-slate-400'>No {unitLabel.toLowerCase()}s found</div>
                )}
              </SelectContent>
            </Select>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor='phoneNumber'>Phone Number</FieldLabel>
          <Input id='phoneNumber' name='phoneNumber' placeholder='Enter phone number' className='rounded-xl' />
        </Field>

        <Field>
          <FieldLabel htmlFor='avatarUrl'>Avatar URL</FieldLabel>
          <Input id='avatarUrl' name='avatarUrl' placeholder='Enter avatar URL' className='rounded-xl' />
        </Field>
      </FieldGroup>

      {error && (
        <div className='rounded-xl bg-rose-50 p-3 text-center text-sm font-semibold text-rose-600'>
          {error}
        </div>
      )}

      <div className='flex justify-end gap-3'>
        <DialogClose asChild>
          <Button type='button' variant='ghost' className='rounded-full'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' disabled={loading || fetchingUnits} className='min-w-[120px] rounded-full bg-primary hover:bg-primary-hover'>
          {loading ? <Spinner className='mr-2' /> : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
