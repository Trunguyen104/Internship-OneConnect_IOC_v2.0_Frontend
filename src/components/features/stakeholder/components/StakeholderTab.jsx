'use client';

import SearchBar from '@/components/ui/SearchBar';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { useStakeholderTab } from '../hooks/useStakeholderTab';
import StakeholderList from './StakeholderList';
import StakeholderFormModal from './StakeholderFormModal';
import Card from '@/components/ui/Card';

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
      <section className='animate-in fade-in flex h-full flex-col space-y-6 duration-500'>
        <Card>
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
            setErrors({});
          }}
          editingId={editingStakeholderId}
          form={stakeholderForm}
          setForm={setStakeholderForm}
          errors={errors}
          setErrors={setErrors}
          onSave={handleSaveStakeholder}
        />
      </section>
    </>
  );
}
