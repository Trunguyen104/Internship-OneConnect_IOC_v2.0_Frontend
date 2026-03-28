'use client';

import { EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { Empty, InputNumber, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../../services/evaluation.service';
import IndividualGrading from './IndividualGrading';

const GRADING_GRID_CSS = `
  .grading-grid .ant-table-thead > tr > th {
    background: transparent !important;
    color: #94a3b8;
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.1em;
    padding: 16px 12px !important;
    border-bottom: 2px solid #f8fafc !important;
  }
  .grading-grid .ant-table-tbody > tr > td {
    padding: 12px !important;
    border-bottom: 1px solid #f8fafc !important;
    transition: all 0.3s ease;
  }
  .grading-grid .ant-table-row:hover > td {
    background: #f8fafc/50 !important;
  }
  .grading-grid .ant-input-number {
    border-radius: 12px;
    background: transparent;
    border: 1px solid transparent;
    transition: all 0.3s;
  }
  .grading-grid .ant-input-number:hover {
    background: #f1f5f9;
  }
  .grading-grid .ant-input-number-focused {
    background: white !important;
    border-color: #d52020 !important;
    box-shadow: 0 4px 12px rgba(213, 32, 32, 0.1) !important;
  }
`;

export default function BatchGrading({ cycle, internshipId, onBatchGrade, isTermOngoing }) {
  const { LABELS, BUTTONS, MESSAGES, TABLE_COLUMNS } = EVALUATION_UI;
  const toast = useToast();
  const [data, setData] = useState({ criteria: [], students: [] });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [scores, setScores] = useState({});
  const [originalScores, setOriginalScores] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await EvaluationService.getGradingGrid(cycle.cycleId, internshipId);
      const grid = res?.data || { criteria: [], students: [] };
      setData(grid);

      const initialScores = {};
      grid.students.forEach((student) => {
        initialScores[student.studentId] = {};
        const details = student.details || student.scores || [];
        details.forEach((s) => {
          initialScores[student.studentId][s.criteriaId] = s.score;
        });
      });
      setScores(initialScores);
      setOriginalScores(JSON.parse(JSON.stringify(initialScores)));
      setHasChanges(false);
    } catch {
      toast.error(MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [cycle.cycleId, internshipId, toast, MESSAGES.FETCH_ERROR]);

  useEffect(() => {
    if (cycle && internshipId) fetchData();
  }, [fetchData, cycle, internshipId]);

  useEffect(() => {
    const changed = JSON.stringify(scores) !== JSON.stringify(originalScores);
    setHasChanges(changed);
  }, [scores, originalScores]);

  const handleScoreChange = (studentId, criteriaId, value) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [criteriaId]: value,
      },
    }));
  };

  const handleCancelEdits = () => {
    setScores(JSON.parse(JSON.stringify(originalScores)));
  };

  const handleSubmitBatch = async () => {
    try {
      setSending(true);
      const evaluationsInput = data.students.map((student) => {
        const studentId = student.studentId;
        const studentScores = scores[studentId] || {};
        const originalDetails = student?.details || student?.scores || [];

        return {
          studentId,
          note: student?.note || student?.generalComment || '',
          details: data.criteria.map((crit) => ({
            criteriaId: crit.criteriaId,
            score: studentScores[crit.criteriaId] ?? 0,
            comment: originalDetails.find((d) => d.criteriaId === crit.criteriaId)?.comment || '',
          })),
        };
      });

      await onBatchGrade(cycle.cycleId, { evaluations: evaluationsInput });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || MESSAGES.VALIDATION_ERROR);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="p-12">
        <SkeletonTable rows={10} columns={6} />
      </div>
    );

  if (data.criteria.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-40 bg-gray-50/30 rounded-[32px] m-4 border border-dashed border-gray-200">
        <div className="bg-white p-8 rounded-[32px] shadow-sm ring-8 ring-gray-100/50 transition-transform hover:scale-105">
          <Empty description={false} />
        </div>
        <div className="text-center">
          <h4 className="text-xl font-black text-text mb-2 tracking-tight">{LABELS.NO_CRITERIA}</h4>
          <p className="text-sm font-bold text-muted/50 tracking-tight uppercase tracking-widest">
            {LABELS.BATCH_GRADING_SUBTITLE}
          </p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: LABELS.STUDENT_NAME,
      key: 'student',
      fixed: 'left',
      width: 280,
      render: (_, student) => (
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[18px] border border-gray-100 bg-white text-primary shadow-sm font-black text-xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            {student.fullName?.charAt(0)}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-black text-text tracking-tight text-sm leading-tight transition-colors group-hover:text-primary">
              {student.fullName}
            </span>
            <span className="text-[10px] text-muted/50 font-black uppercase tracking-widest">
              {student.studentCode}
            </span>
          </div>
        </div>
      ),
    },
    ...data.criteria.map((crit) => ({
      title: (
        <div className="flex flex-col items-center py-2">
          <span className="w-24 truncate text-center text-[11px] font-black tracking-tight text-text leading-tight">
            {crit.name}
          </span>
          <span className="text-[9px] text-muted/40 font-black uppercase tracking-widest mt-1">
            {LABELS.MAX_LABEL} {crit.maxScore}
          </span>
        </div>
      ),
      key: crit.criteriaId,
      align: 'center',
      width: 120,
      render: (_, student) => (
        <div className="px-2">
          <InputNumber
            min={0}
            max={crit.maxScore}
            precision={1}
            placeholder="0.0"
            value={scores[student.studentId]?.[crit.criteriaId]}
            onChange={(val) => handleScoreChange(student.studentId, crit.criteriaId, val)}
            className={`w-full text-center font-black text-sm h-11 rounded-2xl border-2! border-slate-100! bg-slate-50/50 hover:bg-white hover:border-primary/20! focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30! transition-all [&_.ant-input-number-input]:text-center [&_.ant-input-number-input]:h-11 [&_.ant-input-number-input]:font-black ${
              scores[student.studentId]?.[crit.criteriaId] > crit.maxScore
                ? 'text-rose-600'
                : 'text-text'
            }`}
            controls={false}
          />
        </div>
      ),
    })),
    {
      title: <span className="text-primary tracking-widest">{TABLE_COLUMNS.TOTAL_SCORE}</span>,
      key: 'totalScore',
      width: 120,
      align: 'center',
      render: (_, student) => (
        <div className="flex flex-col items-center">
          <span className="text-primary font-black text-lg tracking-tighter leading-none">
            {student.totalScore || '0'}
          </span>
          <span className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] mt-1">
            {UI_TEXT.EVALUATION.POINTS}
          </span>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (_, student) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedStudent(student)}
          className="h-10 w-10 rounded-2xl text-muted/40 transition-all hover:bg-white hover:shadow-xl hover:text-primary hover:border-gray-100 border border-transparent active:scale-95"
        >
          <EyeOutlined className="text-lg" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white/50">
      {/* SaaS Toolbar */}
      <div className="bg-gray-50/30 backdrop-blur-md px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] font-black text-muted/50 uppercase tracking-[0.2em] leading-none">
              {TABLE_COLUMNS.GRADING_BOARD}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-text tracking-tighter leading-none">
                {data.students.length}
              </span>
              <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest">
                {LABELS.TOTAL_STUDENT}
              </span>
            </div>
          </div>

          {hasChanges && (
            <div className="flex items-center gap-3 rounded-[20px] bg-amber-50 px-5 py-2.5 border border-amber-100/50 shadow-sm animate-in slide-in-from-left-4 transition-all duration-500">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse ring-4 ring-amber-500/20" />
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                {MESSAGES.UNSAVED_CHANGES}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleCancelEdits}
              className="rounded-full px-8 h-12 text-[11px] font-black uppercase tracking-widest border-gray-200 transition-all hover:bg-white active:scale-95"
            >
              {BUTTONS.CANCEL}
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitBatch}
            loading={sending}
            disabled={(!hasChanges && !sending) || !isTermOngoing || cycle.status !== 1}
            className="rounded-full px-10 h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <SaveOutlined className="text-lg" /> {BUTTONS.SAVE_ALL}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-8">
        <div className="rounded-[32px] border border-gray-100 bg-white shadow-sm overflow-hidden h-full">
          <Table
            columns={columns}
            dataSource={data.students}
            rowKey="studentId"
            pagination={false}
            size="middle"
            scroll={{ x: 'max-content', y: 'calc(100vh - 480px)' }}
            className="grading-grid"
          />
        </div>
      </div>

      {selectedStudent && (
        <IndividualGrading
          student={selectedStudent}
          cycle={cycle}
          internshipId={internshipId}
          allCriteria={data.criteria}
          open={true}
          onCancel={() => setSelectedStudent(null)}
          onSuccess={() => {
            setSelectedStudent(null);
            fetchData();
          }}
        />
      )}

      <style jsx global>
        {GRADING_GRID_CSS}
      </style>
    </div>
  );
}
