import React, { memo } from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

import { useStakeholderTab } from '../hooks/useStakeholderTab';
import StakeholderFormModal from './StakeholderFormModal';
import StakeholderList from './StakeholderList';

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
    <div className="animate-in fade-in flex h-full flex-1 flex-col space-y-6 duration-500">
      <Card className="flex min-h-0 flex-1 flex-col !p-4 sm:!p-8 2xl:h-auto">
        <DataTableToolbar
          className="mb-6 !border-0 !p-0"
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

        {total > 0 && (
          <div className="border-border/50 mt-6 border-t pt-6">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
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
