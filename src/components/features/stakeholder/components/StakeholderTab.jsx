import React, { memo } from 'react';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { useStakeholderTab } from '../hooks/useStakeholderTab';
import StakeholderList from './StakeholderList';
import StakeholderFormModal from './StakeholderFormModal';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';

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
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
  } = useStakeholderTab();

  return (
    <div className='animate-in fade-in flex h-full flex-col space-y-6 duration-500'>
      <Card>
        <DataTableToolbar
          className='mb-6 !border-0 !p-0'
          searchProps={{
            placeholder: STAKEHOLDER_UI.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          actionProps={{
            label: STAKEHOLDER_UI.ADD_BUTTON,
            onClick: () => {
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
            },
          }}
        />

        <StakeholderList
          stakeholders={stakeholders}
          loading={stakeholderLoading}
          page={page}
          pageSize={pageSize}
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
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
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
