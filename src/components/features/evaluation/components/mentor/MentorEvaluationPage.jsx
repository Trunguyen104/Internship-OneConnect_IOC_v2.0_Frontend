'use client';

import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useMemo, useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import { useMentorEvaluation } from '../../hooks/useMentorEvaluation';
import BatchGrading from './BatchGrading';
import CycleDialog from './CycleDialog';
import CycleList from './CycleList';

export default function MentorEvaluationPage({ internshipId, groupName, termId, termDates }) {
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
      <PageLayout.Header {...headerProps} />

      <PageLayout.Card>
        <PageLayout.Toolbar
          actionProps={
            view === 'list'
              ? {
                  label: BUTTONS.CREATE_CYCLE,
                  icon: <PlusOutlined />,
                  onClick: handleOpenCreate,
                  disabled: !isTermOngoing,
                }
              : {
                  label: BUTTONS.BACK_TO_LIST,
                  icon: <ArrowLeftOutlined />,
                  onClick: handleBackToList,
                  variant: 'outline',
                }
          }
        />

        <PageLayout.Content>
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
    </PageLayout>
  );
}
