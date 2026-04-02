'use client';

import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import PageLayout from '@/components/ui/pagelayout';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import { useMentorEvaluation } from '../../hooks/useMentorEvaluation';
import BatchGrading from './BatchGrading';
import CycleDialog from './CycleDialog';
import CycleList from './CycleList';

export default function MentorEvaluationPage({
  internshipId,
  groupName,
  termId,
  termDates,
  terms,
  selectedTerm,
  setSelectedTerm,
  groups,
  selectedGroup,
  setSelectedGroup,
  loading: loadingGroups,
}) {
  const { LABELS, TITLE, SUBTITLE, BUTTONS } = EVALUATION_UI;
  const {
    cycles,
    loadingCycles,
    selectedCycle,
    setSelectedCycle,
    handleCreateCycle,
    handleUpdateCycle,
    handleDeleteCycle,
    handleSaveEvaluations,
    handlePublish,
  } = useMentorEvaluation(internshipId, termId);

  const [view, setView] = useState('list'); // 'list' | 'grading'
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);

  // =========================
  // 📍 Handlers
  // =========================
  const handleOpenGrading = useCallback(
    (cycle) => {
      setSelectedCycle(cycle);
      setView('grading');
    },
    [setSelectedCycle]
  );

  const handleBackToList = useCallback(() => {
    setView('list');
    setSelectedCycle(null);
  }, [setSelectedCycle]);

  const handleOpenCreate = () => {
    setEditingCycle(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cycle) => {
    setEditingCycle(cycle);
    setIsDialogOpen(true);
  };

  const handleSaveCycle = async (data) => {
    if (editingCycle) {
      return await handleUpdateCycle(editingCycle.cycleId, data);
    } else {
      return await handleCreateCycle(data);
    }
  };

  // =========================
  // 🎨 Render Logic
  // =========================
  const headerProps = useMemo(() => {
    const groupSuffix = groupName ? ` - ${groupName}` : '';
    if (view === 'list') {
      return { title: TITLE, description: `${SUBTITLE}${groupSuffix}` };
    }
    return {
      title: `${BUTTONS.QUICK_GRADE}: ${selectedCycle?.name}`,
      description: `${LABELS.TIME}: ${new Date(selectedCycle?.startDate).toLocaleDateString()} - ${new Date(selectedCycle?.endDate).toLocaleDateString()}${groupSuffix}`,
    };
  }, [view, selectedCycle, groupName, TITLE, SUBTITLE, BUTTONS.QUICK_GRADE, LABELS.TIME]);

  const isTermPast = useMemo(() => {
    if (!termDates?.endDate) return false;
    const now = new Date();
    const end = new Date(termDates.endDate);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }, [termDates]);

  const isTermOngoing = useMemo(() => {
    if (!termDates?.startDate || !termDates?.endDate) return false;
    const now = new Date();
    const start = new Date(termDates.startDate);
    const end = new Date(termDates.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  }, [termDates]);

  return (
    <PageLayout>
      <PageLayout.Header {...headerProps} className="pb-10" />

      <div className="rounded-[40px] border border-gray-100/50 bg-white/80 backdrop-blur-md shadow-sm overflow-hidden flex flex-col min-h-0 flex-1 transition-all duration-300">
        <div className="p-8 pb-4">
          {/* Unified Filter & Action Bar */}
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center">
            {/* Term Select */}
            <div className="flex items-center gap-4 min-w-[220px]">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/50 ml-1">
                  {LABELS.TERM}
                </span>
                <Select
                  className="w-full !rounded-3xl [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:!leading-[44px] hover:[&_.ant-select-selector]:!bg-gray-100 transition-all font-bold"
                  value={selectedTerm?.id}
                  onChange={(val) => setSelectedTerm(terms.find((t) => t.id === val))}
                  options={terms.map((t) => ({
                    label: t.name,
                    value: t.id,
                  }))}
                  placeholder={LABELS.SELECT_TERM_PLACEHOLDER}
                />
              </div>
            </div>

            {/* Group Select */}
            <div className="flex items-center gap-4 flex-1 lg:max-w-md">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/50 ml-1">
                  {LABELS.GROUP}
                </span>
                <Select
                  className="w-full !rounded-3xl [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!h-11 [&_.ant-select-selection-item]:!leading-[44px] hover:[&_.ant-select-selector]:!bg-gray-100 transition-all font-bold"
                  value={selectedGroup?.internshipId || selectedGroup?.id}
                  onChange={(val) =>
                    setSelectedGroup(groups.find((g) => (g.internshipId || g.id) === val))
                  }
                  options={groups.map((g) => ({
                    label: g.groupName,
                    value: g.internshipId || g.id,
                  }))}
                  placeholder={LABELS.SELECT_GROUP_PLACEHOLDER}
                  disabled={groups.length === 0}
                  loading={loadingGroups && groups.length > 0}
                />
              </div>
            </div>

            {loadingGroups && <Spin size="small" className="hidden xl:block" />}

            {/* Actions */}
            <div className="flex justify-end lg:ml-auto pt-5">
              {view === 'list' && (
                <Button
                  variant="primary"
                  onClick={handleOpenCreate}
                  disabled={!isTermOngoing}
                  className="rounded-full h-11 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all w-full lg:w-auto flex items-center justify-center gap-2"
                >
                  <PlusOutlined /> {BUTTONS.CREATE_CYCLE}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden px-8 pb-8">
          {view === 'grading' && (
            <div className="mb-6">
              <PageLayout.Toolbar
                className="!p-0 !border-0"
                leftContent={
                  <Button
                    variant="primary"
                    onClick={handleBackToList}
                    className="rounded-full h-11 px-10 font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
                  >
                    <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />{' '}
                    {BUTTONS.BACK_TO_LIST}
                  </Button>
                }
              />
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-auto">
            {view === 'list' ? (
              <CycleList
                cycles={cycles}
                loading={loadingCycles}
                onOpenGrading={handleOpenGrading}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteCycle}
                isTermOngoing={isTermOngoing}
                isTermPast={isTermPast}
              />
            ) : (
              <BatchGrading
                cycle={selectedCycle}
                internshipId={internshipId}
                onBatchGrade={handleSaveEvaluations}
                onPublish={handlePublish}
                isTermOngoing={isTermOngoing}
              />
            )}
          </div>
        </div>
      </div>

      <CycleDialog
        key={editingCycle?.cycleId || 'new'}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCycle}
        initialData={editingCycle}
        termDates={termDates}
      />
    </PageLayout>
  );
}
