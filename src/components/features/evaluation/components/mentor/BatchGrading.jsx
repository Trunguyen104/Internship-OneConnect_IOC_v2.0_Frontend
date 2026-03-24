'use client';

import { EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { Empty, InputNumber, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../../services/evaluation.service';
import IndividualGrading from './IndividualGrading';

const GRADING_GRID_CSS = `
  .grading-grid .ant-table-thead > tr > th {
    background: #f9fafb !important;
    color: #6b7280;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.025em;
    border-bottom: 1px solid #f3f4f6 !important;
  }
  .grading-grid .ant-table-cell {
    padding: 8px 12px !important;
  }
  .grading-grid .ant-input-number {
    transition: all 0.2s;
  }
  .grading-grid .ant-input-number-focused {
    box-shadow: none !important;
    border-bottom: 1px solid #d52020 !important;
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
      <div className="p-8">
        <SkeletonTable rows={10} columns={6} />
      </div>
    );

  if (data.criteria.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <Empty description={LABELS.NO_CRITERIA} />
        <p className="text-sm text-gray-500">{LABELS.BATCH_GRADING_SUBTITLE}</p>
      </div>
    );
  }

  const columns = [
    {
      title: LABELS.STUDENT_NAME,
      key: 'student',
      fixed: 'left',
      width: 250,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            {student.fullName?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm">{student.fullName}</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider">
              {student.studentCode}
            </span>
          </div>
        </div>
      ),
    },
    ...data.criteria.map((crit) => ({
      title: (
        <div className="flex flex-col items-center py-1">
          <span className="w-24 truncate text-center text-xs font-bold">{crit.name}</span>
          <span className="text-[9px] text-gray-400 font-medium uppercase">
            {LABELS.MAX_LABEL} {crit.maxScore}
          </span>
        </div>
      ),
      key: crit.criteriaId,
      align: 'center',
      width: 110,
      render: (_, student) => (
        <div className="group relative px-2">
          <InputNumber
            min={0}
            max={crit.maxScore}
            precision={1}
            value={scores[student.studentId]?.[crit.criteriaId]}
            onChange={(val) => handleScoreChange(student.studentId, crit.criteriaId, val)}
            className={`w-full text-center transition-all border-none bg-transparent hover:bg-white focus:bg-white focus:shadow-sm ${
              scores[student.studentId]?.[crit.criteriaId] > crit.maxScore
                ? 'text-red-600 font-bold'
                : ''
            }`}
            controls={false}
          />
        </div>
      ),
    })),
    {
      title: TABLE_COLUMNS.TOTAL_SCORE,
      key: 'totalScore',
      width: 100,
      align: 'center',
      render: (_, student) => (
        <span className="text-primary font-black text-base">{student.totalScore || '0'}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      fixed: 'right',
      width: 60,
      align: 'center',
      render: (_, student) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedStudent(student)}
          className="hover:bg-primary/5 text-gray-400 hover:text-primary"
        >
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* SaaS Toolbar */}
      <div className="border-b bg-gray-50/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">
              {TABLE_COLUMNS.GRADING_BOARD}
            </h3>
            <span className="text-[12px] text-black font-bold uppercase">
              {LABELS.TOTAL_STUDENT} : {data.students.length}
            </span>
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 border border-orange-100">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-bold text-orange-700 uppercase">
                {MESSAGES.UNSAVED_CHANGES}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdits}
              className="text-xs font-bold text-gray-500"
            >
              {BUTTONS.CANCEL}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitBatch}
            loading={sending}
            disabled={(!hasChanges && !sending) || !isTermOngoing || cycle.status !== 1}
            className="flex items-center gap-2 shadow-sm"
          >
            <SaveOutlined /> {BUTTONS.SAVE_ALL}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <Table
          columns={columns}
          dataSource={data.students}
          rowKey="studentId"
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content', y: 'calc(100vh - 430px)' }}
          className="grading-grid rounded-xl overflow-hidden"
        />
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
