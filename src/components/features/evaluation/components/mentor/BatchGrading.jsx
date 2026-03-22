'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EvaluationService } from '../../services/evaluation.service';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/button';
import { SaveOutlined, SendOutlined, EyeOutlined } from '@ant-design/icons';
import { InputNumber, Table, Tooltip, Empty } from 'antd';
import SkeletonTable from '@/components/ui/SkeletonTable';
import Badge from '@/components/ui/badge';
import IndividualGrading from './IndividualGrading';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function BatchGrading({ cycle, internshipId, onBatchGrade, onPublish }) {
  const { LABELS, BUTTONS, MESSAGES, STATUS, TABLE_COLUMNS } = EVALUATION_UI;
  const toast = useToast();
  const [data, setData] = useState({ criteria: [], students: [] });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [scores, setScores] = useState({}); // { studentId: { criteriaId: score } }
  const [selectedStudent, setSelectedStudent] = useState(null); // for IndividualGrading modal

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await EvaluationService.getGradingGrid(cycle.cycleId, internshipId);
      const grid = res?.data || { criteria: [], students: [] };
      setData(grid);

      // Sync local state scores
      const initialScores = {};
      grid.students.forEach((student) => {
        initialScores[student.studentId] = {};
        student.scores?.forEach((s) => {
          initialScores[student.studentId][s.criteriaId] = s.score;
        });
      });
      setScores(initialScores);
    } catch {
      toast.error(MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [cycle.cycleId, internshipId, toast, MESSAGES.FETCH_ERROR]);

  useEffect(() => {
    if (cycle && internshipId) fetchData();
  }, [fetchData, cycle, internshipId]);

  const handleScoreChange = (studentId, criteriaId, value) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [criteriaId]: value,
      },
    }));
  };

  const handleSubmitBatch = async () => {
    try {
      setSending(true);
      // Transform local state to format expected by API
      const evaluations = Object.keys(scores).map((studentId) => ({
        studentId,
        scores: Object.keys(scores[studentId]).map((criteriaId) => ({
          criteriaId,
          score: scores[studentId][criteriaId],
        })),
      }));

      await onBatchGrade(cycle.cycleId, evaluations);
      fetchData(); // Refresh to get total points and status
    } finally {
      setSending(false);
    }
  };

  const handlePublishAll = async () => {
    await onPublish(cycle.cycleId, null); // null studentIds = publish all
    fetchData();
  };

  if (loading)
    return (
      <div className='p-4'>
        <SkeletonTable rows={10} columns={5} />
      </div>
    );

  if (data.criteria.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 py-20'>
        <Empty description={LABELS.NO_CRITERIA} />
        <p className='text-sm text-gray-500'>{LABELS.BATCH_GRADING_SUBTITLE}</p>
      </div>
    );
  }

  // Ant Design Table Columns for dynamic criteria
  const columns = [
    {
      title: LABELS.STUDENT,
      key: 'student',
      fixed: 'left',
      width: 250,
      render: (_, student) => (
        <div className='flex flex-col'>
          <span className='font-bold text-gray-800'>{student.fullName}</span>
          <span className='text-xs text-gray-500'>{student.studentCode}</span>
        </div>
      ),
    },
    ...data.criteria.map((crit) => ({
      title: (
        <Tooltip title={`${crit.name} (Max: ${crit.maxScore})`}>
          <div className='flex flex-col items-center'>
            <span className='w-24 truncate text-center'>{crit.name}</span>
            <span className='text-[10px] text-gray-400'>Max: {crit.maxScore}</span>
          </div>
        </Tooltip>
      ),
      key: crit.criteriaId,
      align: 'center',
      width: 120,
      render: (_, student) => (
        <InputNumber
          min={0}
          max={crit.maxScore}
          precision={2}
          value={scores[student.studentId]?.[crit.criteriaId]}
          onChange={(val) => handleScoreChange(student.studentId, crit.criteriaId, val)}
          className='w-full text-center'
        />
      ),
    })),
    {
      title: TABLE_COLUMNS.TOTAL_SCORE,
      key: 'totalScore',
      width: 100,
      align: 'center',
      render: (_, student) => (
        <span className='text-primary font-black'>{student.totalScore || '--'}</span>
      ),
    },
    {
      title: TABLE_COLUMNS.STATUS,
      key: 'status',
      width: 120,
      render: (status) => {
        const labels = [STATUS.PENDING, STATUS.DRAFT, STATUS.SUBMITTED, STATUS.PUBLISHED];
        const variants = ['gray', 'blue', 'orange', 'green'];
        return (
          <Badge variant={variants[status] || 'default'}>{labels[status] || STATUS.UNKNOWN}</Badge>
        );
      },
    },
    {
      title: TABLE_COLUMNS.DETAILS,
      key: 'actions',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (_, student) => (
        <Button variant='ghost' size='sm' onClick={() => setSelectedStudent(student)}>
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <div className='mb-2 flex items-center justify-between py-3'>
        <div className='flex gap-4 text-xs font-medium text-gray-400'>
          <span className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-blue-500' /> {STATUS.DRAFT}
          </span>
          <span className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-green-500' /> {STATUS.PUBLISHED}
          </span>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='primary'
            size='sm'
            onClick={handleSubmitBatch}
            loading={sending}
            className='flex items-center gap-2'
          >
            <SaveOutlined /> {BUTTONS.SUBMIT_ALL}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePublishAll}
            className='flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50'
          >
            <SendOutlined /> {BUTTONS.PUBLISH}
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        <Table
          columns={columns}
          dataSource={data.students}
          rowKey='studentId'
          pagination={false}
          scroll={{ x: 'max-content', y: 'calc(100vh - 420px)' }}
          className='rounded-xl border'
        />
      </div>

      {selectedStudent && (
        <IndividualGrading
          student={selectedStudent}
          cycle={cycle}
          internshipId={internshipId}
          open={true}
          onClose={() => setSelectedStudent(null)}
          onSuccess={() => {
            setSelectedStudent(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
