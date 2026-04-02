import React, { memo } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

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
  } = useStakeholderTab();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: STAKEHOLDER_UI.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'max-w-md',
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

        <PageLayout.Content className="px-0">
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
        </PageLayout.Content>

        {total > 0 && (
          <PageLayout.Footer className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
              {UI_TEXT.COMMON.TOTAL}: <span className="font-extrabold text-slate-800">{total}</span>
            </span>
            <PageLayout.Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
      </PageLayout.Card>
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
