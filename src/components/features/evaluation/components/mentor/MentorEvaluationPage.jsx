'use client';

import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import { useMentorEvaluation } from '../../hooks/useMentorEvaluation';
import BatchGrading from './BatchGrading';
import CycleDialog from './CycleDialog';
import CycleList from './CycleList';

export default function MentorEvaluationPage({
  internshipId,
  groupName,
  phaseId,
  termDates,
  phases,
  selectedPhase,
  setSelectedPhase,
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
  } = useMentorEvaluation(internshipId, phaseId);

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
    <>
      <PageLayout.Header {...headerProps} className="pb-10" />

      <PageLayout.Card className="flex flex-col min-h-0 flex-1 overflow-hidden !p-0">
        {/* Toolbar: Filters + Action */}
        <div className="px-6 pt-6 pb-2 flex-shrink-0">
          <DataTableToolbar>
            <DataTableToolbar.Filters>
              {/* Phase Select */}
              <div className="flex flex-col gap-1 min-w-[200px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/50 ml-1">
                  {LABELS.PHASE}
                </span>
                <Select
                  className="w-full !rounded-3xl [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!h-10 [&_.ant-select-selection-item]:!leading-[40px] hover:[&_.ant-select-selector]:!bg-gray-100 transition-all font-bold"
                  value={selectedPhase?.id}
                  onChange={(val) => setSelectedPhase(phases.find((p) => p.id === val))}
                  options={phases.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                  placeholder={LABELS.SELECT_PHASE_PLACEHOLDER}
                />
              </div>

              {/* Group Select */}
              <div className="flex flex-col gap-1 min-w-[220px] max-w-md flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/50 ml-1">
                  {LABELS.GROUP}
                </span>
                <Select
                  className="w-full !rounded-3xl [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!h-10 [&_.ant-select-selection-item]:!leading-[40px] hover:[&_.ant-select-selector]:!bg-gray-100 transition-all font-bold"
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

              {loadingGroups && <Spin size="small" />}
            </DataTableToolbar.Filters>

            {/* Create Cycle Action */}
            {view === 'list' && (
              <DataTableToolbar.Actions className="ml-auto">
                <Button
                  variant="primary"
                  onClick={handleOpenCreate}
                  disabled={!isTermOngoing}
                  className="rounded-full h-10 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <PlusOutlined /> {BUTTONS.CREATE_CYCLE}
                </Button>
              </DataTableToolbar.Actions>
            )}
          </DataTableToolbar>
        </div>

        {/* Back to List Toolbar (grading view only) */}
        {view === 'grading' && (
          <div className="px-6 pb-2 flex-shrink-0">
            <PageLayout.Toolbar
              className="!p-0 !border-0"
              leftContent={
                <Button
                  variant="primary"
                  onClick={handleBackToList}
                  className="rounded-full h-10 px-8 font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
                >
                  <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />{' '}
                  {BUTTONS.BACK_TO_LIST}
                </Button>
              }
            />
          </div>
        )}

        {/* Content */}
        <PageLayout.Content className="px-6 pb-6">
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
        </PageLayout.Content>
      </PageLayout.Card>

      <CycleDialog
        key={editingCycle?.cycleId || 'new'}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCycle}
        initialData={editingCycle}
        termDates={termDates}
      />
    </>
  );
}
