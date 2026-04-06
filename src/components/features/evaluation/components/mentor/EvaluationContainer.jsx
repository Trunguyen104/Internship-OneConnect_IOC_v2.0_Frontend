'use client';

import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Empty, Select, Spin } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import useEvaluationGroups from '../../hooks/useEvaluationGroups';
import { useMentorEvaluation } from '../../hooks/useMentorEvaluation';
import BatchGrading from './BatchGrading';
import CycleDialog from './CycleDialog';
import CycleList from './CycleList';

export default function EvaluationContainer({ targetGroupId = null }) {
  const { LABELS, TITLE, SUBTITLE, BUTTONS, MESSAGES } = EVALUATION_UI;
  const [isMounted, setIsMounted] = React.useState(false);

  // Group & Phase management
  const {
    phases,
    selectedPhase,
    setSelectedPhase,
    groups,
    selectedGroup,
    setSelectedGroup,
    loading: loadingGroups,
  } = useEvaluationGroups(targetGroupId);

  const internshipId = selectedGroup?.internshipId || selectedGroup?.id;
  const phaseId = selectedPhase?.id;

  // Cycle management (lifted from MentorEvaluationPage)
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

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handlers
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

  // Term dates logic
  const termDates = useMemo(
    () => ({
      startDate: selectedPhase?.startDate,
      endDate: selectedPhase?.endDate,
    }),
    [selectedPhase]
  );

  const isTermOngoing = useMemo(() => {
    if (!termDates?.startDate || !termDates?.endDate) return false;
    const now = new Date();
    const start = new Date(termDates.startDate);
    const end = new Date(termDates.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  }, [termDates]);

  const isTermPast = useMemo(() => {
    if (!termDates?.endDate) return false;
    const now = new Date();
    const end = new Date(termDates.endDate);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }, [termDates]);

  // Header props logic
  const headerProps = useMemo(() => {
    const groupSuffix = selectedGroup?.groupName ? ` - ${selectedGroup.groupName}` : '';
    if (view === 'list') {
      return { title: TITLE, description: `${SUBTITLE}${groupSuffix}` };
    }
    return {
      title: `${BUTTONS.QUICK_GRADE}: ${selectedCycle?.name}`,
      description: `${LABELS.TIME}: ${new Date(selectedCycle?.startDate).toLocaleDateString()} - ${new Date(
        selectedCycle?.endDate
      ).toLocaleDateString()}${groupSuffix}`,
    };
  }, [view, selectedCycle, selectedGroup, TITLE, SUBTITLE, BUTTONS.QUICK_GRADE, LABELS.TIME]);

  if (!isMounted) return null;

  if (loadingGroups && phases.length === 0) {
    return (
      <PageLayout>
        <PageLayout.Card className="flex items-center justify-center py-20">
          <Spin size="large" description={MESSAGES.LOADING} />
        </PageLayout.Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageLayout.Header {...headerProps} className="pb-6" />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Content className="px-0 overflow-y-auto custom-scrollbar-minimal">
          {/* Universal Filter Toolbar - Standardized Padding */}
          <div className="px-2 pt-2 pb-2 flex-shrink-0 border-b border-gray-50">
            <DataTableToolbar>
              <DataTableToolbar.Filters>
                {/* Phase Select */}
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted/50 ml-1">
                    {LABELS.PHASE}
                  </span>
                  <Select
                    className="w-full !rounded-3xl [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-none! [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!h-10 [&_.ant-select-selection-item]:!leading-[40px] hover:[&_.ant-select-selector]:!bg-gray-100 [&_.ant-select-selector]:!shadow-none! focus:[&_.ant-select-selector]:!border-none! focus:[&_.ant-select-selector]:!shadow-none! transition-all font-bold"
                    value={selectedPhase?.id}
                    onChange={(val) => {
                      const phase = phases.find((p) => p.id === val);
                      setSelectedPhase(phase);
                    }}
                    options={phases.map((p) => ({
                      label: p.name,
                      value: p.id,
                    }))}
                    placeholder={LABELS.SELECT_PHASE_PLACEHOLDER}
                    style={{
                      '--antd-wave-shadow-color': 'transparent',
                    }}
                    styles={{ popup: { root: { borderRadius: '16px' } } }}
                  />
                </div>

                {/* Group Select */}
                <div className="flex flex-col gap-1 min-w-[220px] max-w-md flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted/50 ml-1">
                    {LABELS.GROUP}
                  </span>
                  <Select
                    className="w-full !rounded-3xl [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-none! [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!h-10 [&_.ant-select-selection-item]:!leading-[40px] hover:[&_.ant-select-selector]:!bg-gray-100 [&_.ant-select-selector]:!shadow-none! focus:[&_.ant-select-selector]:!border-none! focus:[&_.ant-select-selector]:!shadow-none! transition-all font-bold"
                    value={selectedGroup?.internshipId || selectedGroup?.id}
                    onChange={(val) => {
                      const group = groups.find((g) => (g.internshipId || g.id) === val);
                      setSelectedGroup(group);
                    }}
                    options={groups.map((g) => ({
                      label: g.groupName,
                      value: g.internshipId || g.id,
                    }))}
                    placeholder={LABELS.SELECT_GROUP_PLACEHOLDER}
                    disabled={groups.length === 0}
                    loading={loadingGroups && groups.length > 0}
                    // Fix: Force no border on focus/active to prevent red outline
                    style={{
                      '--antd-wave-shadow-color': 'transparent',
                    }}
                    styles={{ popup: { root: { borderRadius: '16px' } } }}
                  />
                </div>

                {loadingGroups && groups.length > 0 && <Spin size="small" className="ml-2" />}
              </DataTableToolbar.Filters>

              {/* Universal Actions (e.g., Create Cycle) - Unified row! */}
              {view === 'list' && selectedGroup && (
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
            <div className="px-2 py-3 flex-shrink-0 bg-gray-50/30 border-b border-gray-100/50">
              <PageLayout.Toolbar
                className="!p-0 !border-0"
                leftContent={
                  <Button
                    variant="primary"
                    onClick={handleBackToList}
                    className="rounded-full h-9 px-5 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
                  >
                    <ArrowLeftOutlined className="group-hover:-translate-x-0.5 transition-transform" />{' '}
                    {BUTTONS.BACK_TO_LIST}
                  </Button>
                }
              />
            </div>
          )}

          {/* Conditional Content Below Toolbar */}
          <div className="flex-1 flex flex-col pt-4">
            {loadingGroups && groups.length === 0 ? (
              <div className="flex flex-col h-96 items-center justify-center gap-4">
                <Spin size="large" />
                <span className="text-sm font-bold text-muted/60 animate-pulse uppercase tracking-widest">
                  {MESSAGES.LOADING}
                </span>
              </div>
            ) : !selectedGroup ? (
              <div className="flex h-[500px] flex-col items-center justify-center text-center">
                <div className="mb-6 rounded-[32px] bg-gray-50/50 p-10 ring-8 ring-gray-50/20 transition-transform hover:scale-105">
                  <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
                <h3 className="text-xl font-black text-text mb-2 tracking-tight max-w-md">
                  {phases.length === 0
                    ? LABELS.NO_PHASE_ASSIGNED || LABELS.NO_ASSIGNED_GROUP
                    : groups.length === 0
                      ? LABELS.NO_GROUPS
                      : LABELS.SELECT_GROUP_PROMPT}
                </h3>
              </div>
            ) : (
              <div className="px-2 pb-6 flex-1 flex flex-col">
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
            )}
          </div>
        </PageLayout.Content>
      </PageLayout.Card>

      <CycleDialog
        key={editingCycle?.cycleId || 'new'}
        open={isDialogOpen}
        onOpenChange={(val) => {
          setIsDialogOpen(val);
          if (!val) setEditingCycle(null);
        }}
        onSave={handleSaveCycle}
        initialData={editingCycle}
        termDates={termDates}
      />
    </PageLayout>
  );
}
