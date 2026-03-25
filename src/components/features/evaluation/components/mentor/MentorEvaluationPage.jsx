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
      <PageLayout.Header {...headerProps} />

      {/* Unified Filter & Action Bar - Responsive Layout */}
      <div className="flex flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-4 lg:gap-x-6 lg:gap-y-4 rounded-xl bg-white p-4 px-4 sm:px-8 lg:px-10 xl:px-[56px] shadow-sm mb-4 transition-all">
        {/* Term Select */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider shrink-0">
            {LABELS.TERM}
          </span>
          <Select
            className="flex-1 lg:w-48 xl:w-52"
            size="middle"
            value={selectedTerm?.id}
            onChange={(val) => setSelectedTerm(terms.find((t) => t.id === val))}
            options={terms.map((t) => ({
              label: t.name,
              value: t.id,
            }))}
            placeholder={LABELS.SELECT_TERM_PLACEHOLDER}
          />
        </div>

        {/* Group Select */}
        <div className="flex items-center gap-3 lg:border-l lg:pl-6 min-w-[280px]">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider shrink-0">
            {LABELS.GROUP}
          </span>
          <Select
            className="flex-1 lg:w-64 xl:w-72"
            size="middle"
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

        {loadingGroups && <Spin size="small" className="hidden xl:block ml-2" />}

        {/* Actions */}
        <div className="flex justify-end lg:ml-auto border-t lg:border-t-0 pt-3 lg:pt-0">
          {view === 'list' && (
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              disabled={!isTermOngoing}
              className="w-full lg:w-auto flex items-center justify-center gap-2"
            >
              <PlusOutlined /> {BUTTONS.CREATE_CYCLE}
            </Button>
          )}
        </div>
      </div>

      <PageLayout.Card>
        {view === 'grading' && (
          <PageLayout.Toolbar
            actionProps={{
              label: BUTTONS.BACK_TO_LIST,
              icon: <ArrowLeftOutlined />,
              onClick: handleBackToList,
              variant: 'outline',
            }}
          />
        )}
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
