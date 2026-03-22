'use client';

import React, { useState, useMemo, useCallback } from 'react';
import PageLayout from '@/components/ui/pagelayout';
import { useMentorEvaluation } from '../../hooks/useMentorEvaluation';
import CycleList from './CycleList';
import BatchGrading from './BatchGrading';
import CycleDialog from './CycleDialog';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function MentorEvaluationPage({ internshipId, termId }) {
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
    [setSelectedCycle],
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
    if (view === 'list') {
      return { title: TITLE, description: SUBTITLE };
    }
    return {
      title: `${BUTTONS.QUICK_GRADE}: ${selectedCycle?.name}`,
      description: `${LABELS.TIME}: ${new Date(selectedCycle?.startDate).toLocaleDateString()} - ${new Date(selectedCycle?.endDate).toLocaleDateString()}`,
    };
  }, [view, selectedCycle, TITLE, SUBTITLE, BUTTONS.QUICK_GRADE, LABELS.TIME]);

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
            />
          ) : (
            <BatchGrading
              cycle={selectedCycle}
              internshipId={internshipId}
              onBatchGrade={handleSaveEvaluations}
              onPublish={handlePublish}
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
      />
    </PageLayout>
  );
}
