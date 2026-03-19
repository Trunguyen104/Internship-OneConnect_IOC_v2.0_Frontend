'use client';

import Card from '@/components/ui/card';
import SearchBar from '@/components/ui/searchbar';
import { Select } from 'antd';

import { useAdminUsersContext } from '../context/AdminUsersContext';

export default function AdminUsersFilters() {
  const {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    roleOptions,
    statusOptions,
    err,
    setCreateOpen,
    setPageNumber,
  } = useAdminUsersContext();

  return (
    <Card className='min-h-0'>
      <Card.Header className='border-b border-slate-100 pb-4'>
        <div>
          <Card.Title>Admin users</Card.Title>
          <Card.Description>Manage administrative accounts across the system</Card.Description>
        </div>
        <Card.Action>
          <button
            type='button'
            onClick={() => setCreateOpen(true)}
            className='bg-primary hover:bg-primary-hover flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white'
          >
            Create
          </button>
        </Card.Action>
      </Card.Header>

      <Card.Content className='space-y-3 pt-4'>
        <SearchBar
          placeholder='Search name/email/code'
          value={search}
          onChange={setSearch}
          showAction={false}
          showFilter
          onFilterClick={() => {}}
        />

        <div className='flex flex-wrap items-center gap-3'>
          <div className='w-56'>
            <Select
              allowClear
              placeholder='Filter role'
              value={role}
              onChange={(v) => {
                setRole(v);
                setPageNumber(1);
              }}
              options={roleOptions}
              className='w-full'
            />
          </div>

          <div className='w-56'>
            <Select
              allowClear
              placeholder='Filter status'
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPageNumber(1);
              }}
              options={statusOptions}
              className='w-full'
            />
          </div>

          {!!err && <span className='text-sm font-medium text-red-600'>{String(err)}</span>}
        </div>
      </Card.Content>
    </Card>
  );
}
