'use client';

import React, { memo } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { useStakeholderTab } from '../hooks/useStakeholderTab';
import StakeholderList from './StakeholderList';
import StakeholderFormModal from './StakeholderFormModal';
import Card from '@/components/ui/Card';

const StakeholderTab = memo(function StakeholderTab() {
  const {
    stakeholders,
    stakeholderLoading,
    search,
    setSearch,
    openStakeholderForm,
    setOpenStakeholderForm,
    editingStakeholderId,
    setEditingStakeholderId,
    stakeholderForm,
    setStakeholderForm,
    errors,
    setErrors,
    handleSaveStakeholder,
    handleDeleteStakeholder,
  } = useStakeholderTab();

  return (
    <div className='flex flex-col gap-6'>
      <Card className='bg-surface border-border overflow-hidden rounded-2xl border p-4 shadow-sm'>
        <SearchBar
          placeholder={STAKEHOLDER_UI.SEARCH_PLACEHOLDER}
          value={search}
          onChange={setSearch}
          showFilter
          showAction
          actionLabel={STAKEHOLDER_UI.ADD_BUTTON}
          onActionClick={() => {
            setStakeholderForm({
              name: '',
              type: 0,
              role: '',
              description: '',
              email: '',
              phoneNumber: '',
            });
            setEditingStakeholderId(null);
            setErrors({});
            setOpenStakeholderForm(true);
          }}
          className='mb-6'
        />

        <StakeholderList
          stakeholders={stakeholders}
          loading={stakeholderLoading}
          onEdit={(s) => {
            setEditingStakeholderId(s.id);
            setStakeholderForm({
              name: s.name || '',
              type: s.type || 0,
              role: s.role || '',
              description: s.description || '',
              email: s.email || '',
              phoneNumber: s.phoneNumber || '',
            });
            setErrors({});
            setOpenStakeholderForm(true);
          }}
          onDelete={handleDeleteStakeholder}
        />
      </Card>

      <StakeholderFormModal
        isOpen={openStakeholderForm}
        onClose={() => {
          setOpenStakeholderForm(false);
          setEditingStakeholderId(null);
          setErrors({});
        }}
        editingId={editingStakeholderId}
        form={stakeholderForm}
        setForm={setStakeholderForm}
        errors={errors}
        setErrors={setErrors}
        onSave={handleSaveStakeholder}
      />
    </div>
  );
});

export default StakeholderTab;
