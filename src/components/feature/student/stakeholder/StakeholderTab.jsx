'use client';

import SearchBar from '@/components/shared/SearchBar';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { useStakeholderTab } from './hooks/useStakeholderTab';
import StakeholderList from './components/StakeholderList';
import StakeholderFormModal from './components/StakeholderFormModal';

export default function StakeholderTab() {
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
    <>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
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
            setErrors({});
            setOpenStakeholderForm(true);
          }}
        />
      </div>

      <div className='min-h-screen bg-slate-50/50 px-4 pt-6 pb-12 md:px-6 lg:pt-8'>
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
      </div>

      <StakeholderFormModal
        isOpen={openStakeholderForm}
        onClose={() => {
          setOpenStakeholderForm(false);
          setErrors({});
        }}
        editingId={editingStakeholderId}
        form={stakeholderForm}
        setForm={setStakeholderForm}
        errors={errors}
        setErrors={setErrors}
        onSave={handleSaveStakeholder}
      />
    </>
  );
}
