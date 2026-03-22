'use client';

import { EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { Empty, Input, InputNumber, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../../services/evaluation.service';
import IndividualGrading from './IndividualGrading';

export default function BatchGrading({ cycle, internshipId, onBatchGrade, onPublish }) {
  const { LABELS, BUTTONS, MESSAGES, STATUS, TABLE_COLUMNS } = EVALUATION_UI;
  const toast = useToast();
  const [data, setData] = useState({ criteria: [], students: [] });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [scores, setScores] = useState({});
  const [originalScores, setOriginalScores] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await EvaluationService.getGradingGrid(cycle.cycleId, internshipId);
      const grid = res?.data || { criteria: [], students: [] };
      setData(grid);

      const initialScores = {};
      grid.students.forEach((student) => {
        initialScores[student.studentId] = {};
        student.details?.forEach((s) => {
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
      const evaluationsInput = Object.keys(scores).map((studentId) => ({
        studentId,
        note: '',
        details: Object.keys(scores[studentId]).map((criteriaId) => ({
          criteriaId,
          score: scores[studentId][criteriaId] || 0,
        })),
      }));

      await onBatchGrade(cycle.cycleId, { evaluations: evaluationsInput });
      toast.success(MESSAGES.GRADE_SUCCESS);
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
        <p className="text-sm text-gray-500 text-center">{LABELS.BATCH_GRADING_SUBTITLE}</p>
      </div>
    );
  }

  const filteredStudents = data.students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentCode?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: LABELS.STUDENT,
      key: 'student',
      fixed: 'left',
      width: 250,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
            {student.fullName?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm">{student.fullName}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {student.studentCode}
            </span>
          </div>
        </div>
      ),
    },
    ...data.criteria.map((crit) => ({
      title: (
        <div className="flex flex-col items-center py-1">
          <span className="w-24 truncate text-center text-[11px] font-black text-gray-600 uppercase tracking-tight">
            {crit.name}
          </span>
          <span className="text-[10px] text-gray-400 font-bold">MAX: {crit.maxScore}</span>
        </div>
      ),
      key: crit.criteriaId,
      align: 'center',
      width: 120,
      render: (_, student) => (
        <div className="group relative px-2">
          <InputNumber
            min={0}
            max={crit.maxScore}
            precision={1}
            value={scores[student.studentId]?.[crit.criteriaId]}
            onChange={(val) => handleScoreChange(student.studentId, crit.criteriaId, val)}
            className={`w-full text-center transition-all border-none bg-transparent hover:bg-white focus:bg-white focus:shadow-md ${
              scores[student.studentId]?.[crit.criteriaId] > crit.maxScore
                ? 'text-red-600 font-black'
                : ''
            }`}
            controls={false}
          />
          <div className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 bg-gray-200 group-hover:bg-primary transition-all rounded-full" />
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
      title: TABLE_COLUMNS.STATUS,
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const config = {
          Pending: { label: STATUS.PENDING, variant: 'secondary' },
          Draft: { label: STATUS.DRAFT, variant: 'warning' },
          Submitted: { label: STATUS.SUBMITTED, variant: 'primary' },
          Published: { label: STATUS.PUBLISHED, variant: 'success' },
        }[status] || { label: STATUS.PENDING, variant: 'secondary' };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
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
          className="hover:bg-primary/5 text-gray-300 hover:text-primary transition-colors"
        >
          <EyeOutlined className="text-lg" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Premium SaaS Header Toolbar */}
      <div className="border-b bg-gray-50/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col border-r pr-6 border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.1em]">
              {TABLE_COLUMNS.GRADING_BOARD}
            </h3>
            <span className="text-sm font-bold text-gray-800">
              {filteredStudents.length} {LABELS.STUDENT}
            </span>
          </div>

          <div className="relative w-64">
            <Input
              placeholder="Search students..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-10 rounded-full bg-gray-100 border-none px-4 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary/20"
              allowClear
            />
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 border border-primary/10">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                {MESSAGES.UNSAVED_CHANGES}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdits}
              className="text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              {BUTTONS.CANCEL}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitBatch}
            loading={sending}
            disabled={!hasChanges && !sending}
            className="h-10 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <SaveOutlined /> {BUTTONS.SAVE_ALL}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="studentId"
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content', y: 'calc(100vh - 440px)' }}
          className="grading-grid-premium rounded-2xl border overflow-hidden shadow-sm"
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

      <style jsx global>{`
        .grading-grid-premium .ant-table-thead > tr > th {
          background: #fafafa !important;
          border-bottom: 1px solid #f0f0f0 !important;
          padding: 16px 12px !important;
        }
        .grading-grid-premium .ant-table-cell {
          padding: 12px !important;
          border-bottom: 1px solid #f5f5f5 !important;
        }
        .grading-grid-premium .ant-table-row:hover > td {
          background: #fafafa !important;
        }
        .grading-grid-premium .ant-input-number-focused {
          border-bottom: 2px solid #d52020 !important;
          background: white !important;
        }
        .grading-grid-premium .ant-input-number-input {
          font-weight: 700 !important;
          font-size: 14px !important;
        }
      `}</style>
    </div>
  );
}
