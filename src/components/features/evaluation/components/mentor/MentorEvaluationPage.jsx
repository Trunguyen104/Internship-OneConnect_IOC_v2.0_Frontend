'use client';

import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
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
      {/* View Actions Toolbar (e.g., Create Cycle) */}
      <div className="px-6 pt-4 pb-2 flex-shrink-0">
        <DataTableToolbar>
          <DataTableToolbar.Filters />
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
                className="rounded-full h-9 px-5 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
              >
                <ArrowLeftOutlined className="group-hover:-translate-x-0.5 transition-transform" />{' '}
                {BUTTONS.BACK_TO_LIST}
              </Button>
            }
          />
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
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
