'use client';

import { SaveOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Divider, Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';

import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../../services/evaluation.service';

export default function IndividualGrading({
  student,
  cycle,
  internshipId,
  allCriteria = [],
  open,
  onCancel,
  onSuccess,
}) {
  const { LABELS, BUTTONS, MESSAGES, STATUS, TABLE_COLUMNS } = EVALUATION_UI;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    generalComment: '',
    scores: [],
  });

  useEffect(() => {
    if (open && student) {
      setFormData({
        generalComment: student.generalComment || '',
        scores:
          student.scores?.map((s) => ({
            criteriaId: s.criteriaId,
            score: s.score,
            comment: s.comment || '',
          })) || [],
      });
    }
  }, [open, student]);

  const handleScoreChange = (criteriaId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      scores: prev.scores.map((s) => (s.criteriaId === criteriaId ? { ...s, [field]: value } : s)),
    }));
  };

  const handleSave = async (statusOverride = null) => {
    try {
      setLoading(true);
      await EvaluationService.individualGrade(cycle.cycleId, {
        internshipId,
        studentId: student.studentId,
        generalComment: formData.generalComment,
        scores: formData.scores,
      });

      if (statusOverride === 'publish') {
        await EvaluationService.publishEvaluations(cycle.cycleId, internshipId, {
          studentIds: [student.studentId],
        });
        toast.success(`${MESSAGES.PUBLISH_SUCCESS}: ${student.fullName}`);
      } else {
        toast.success(`${MESSAGES.GRADE_SUCCESS}: ${student.fullName}`);
      }

      onSuccess();
    } catch (error) {
      toast.error(error.message || MESSAGES.VALIDATION_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const getCriteriaInfo = (id) =>
    allCriteria?.find((c) => c.criteriaId === id) || { name: STATUS.UNKNOWN, maxScore: 10 };

  return (
    <CompoundModal
      title={`${LABELS.DETAILS}: ${student?.fullName}`}
      open={open}
      onCancel={onCancel}
      className="w-full max-w-4xl"
      footer={
        <div className="flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">{TABLE_COLUMNS.STATUS}:</span>
            {(() => {
              const statusMap = {
                Pending: { label: STATUS.PENDING, variant: 'secondary' },
                Draft: { label: STATUS.DRAFT, variant: 'warning' },
                Submitted: { label: STATUS.SUBMITTED, variant: 'primary' },
                Published: { label: STATUS.PUBLISHED, variant: 'success' },
              };

              const statusInfo = statusMap[student?.status] || statusMap['Pending'];
              return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
            })()}
          </div>
          <div className="flex gap-2 py-3">
            <Button variant="outline" onClick={onCancel}>
              {BUTTONS.CANCEL}
            </Button>
            <Button variant="outline" onClick={() => handleSave()} loading={loading}>
              <SaveOutlined /> {BUTTONS.SAVE_DRAFT}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave('publish')}
              loading={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <ThunderboltOutlined /> {BUTTONS.PUBLISH_NOW}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {formData.scores.map((s) => {
            const critInfo = getCriteriaInfo(s.criteriaId);
            return (
              <div key={s.criteriaId} className="space-y-3 rounded-xl border bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="w-2/3 truncate text-sm font-bold text-gray-700">
                    {critInfo.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">
                      {LABELS.MAX_LABEL} {critInfo.maxScore}
                    </span>
                    <InputNumber
                      min={0}
                      max={critInfo.maxScore}
                      precision={2}
                      value={s.score}
                      onChange={(val) => handleScoreChange(s.criteriaId, 'score', val)}
                      className="w-20"
                    />
                  </div>
                </div>
                <Input.TextArea
                  placeholder={LABELS.COMMENT}
                  value={s.comment}
                  onChange={(e) => handleScoreChange(s.criteriaId, 'comment', e.target.value)}
                  className="text-xs"
                  rows={2}
                />
              </div>
            );
          })}
        </div>

        <Divider titlePlacement="left" className="!my-2">
          <span className="text-sm font-semibold">{LABELS.GENERAL_COMMENT}</span>
        </Divider>

        <div className="space-y-2">
          <Input.TextArea
            placeholder={LABELS.GENERAL_COMMENT}
            value={formData.generalComment}
            onChange={(e) => setFormData({ ...formData, generalComment: e.target.value })}
            rows={4}
            className="rounded-xl"
          />
        </div>
      </div>
    </CompoundModal>
  );
}
