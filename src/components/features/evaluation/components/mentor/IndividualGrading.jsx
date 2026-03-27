'use client';

import { SaveOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';

import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/compoundmodal';
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
      const currentScores =
        allCriteria?.map((crit) => {
          const existing =
            student.details?.find((s) => s.criteriaId === crit.criteriaId) ||
            student.scores?.find((s) => s.criteriaId === crit.criteriaId);
          return {
            criteriaId: crit.criteriaId,
            score: existing?.score ?? null,
            comment: existing?.comment || '',
          };
        }) || [];

      setFormData({
        generalComment: student.note || student.generalComment || '',
        scores: currentScores,
      });
    }
  }, [open, student, allCriteria]);

  const handleScoreChange = (criteriaId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      scores: prev.scores.map((s) => (s.criteriaId === criteriaId ? { ...s, [field]: value } : s)),
    }));
  };

  const handleSave = async (statusOverride = null) => {
    try {
      setLoading(true);

      const evaluationsInput = formData.scores.map((s) => ({
        criteriaId: s.criteriaId,
        score: s.score ?? 0,
        comment: s.comment || '',
      }));

      await EvaluationService.individualGrade(cycle.cycleId, {
        internshipId,
        studentId: student.studentId,
        generalComment: formData.generalComment,
        scores: evaluationsInput,
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
      title={
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            {LABELS.DETAIL}
          </span>
          <span className="text-xl font-black text-text tracking-tight">{student?.fullName}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={
        <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50 backdrop-blur-sm m-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest leading-none">
              {TABLE_COLUMNS.STATUS}
            </span>
            {(() => {
              const statusMap = {
                Pending: { label: STATUS.PENDING, variant: 'secondary' },
                Draft: { label: STATUS.DRAFT, variant: 'warning' },
                Submitted: { label: STATUS.SUBMITTED, variant: 'primary' },
                Published: { label: STATUS.PUBLISHED, variant: 'success' },
              };

              const statusInfo = statusMap[student?.status] || statusMap['Pending'];
              return (
                <Badge
                  variant={statusInfo.variant}
                  className="rounded-full px-4 h-6 text-[10px] font-black uppercase tracking-widest"
                >
                  {statusInfo.label}
                </Badge>
              );
            })()}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-full h-11 px-8 font-black uppercase tracking-widest active:scale-95 transition-all text-[11px]"
            >
              {BUTTONS.CANCEL}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave()}
              loading={loading}
              className="rounded-full h-11 px-8 font-black uppercase tracking-widest active:scale-95 transition-all text-[11px] flex items-center gap-2"
            >
              <SaveOutlined /> {BUTTONS.SAVE_DRAFT}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave('publish')}
              loading={loading}
              className="rounded-full h-11 px-8 font-black uppercase tracking-widest active:scale-95 transition-all text-[11px] flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
            >
              <ThunderboltOutlined /> {BUTTONS.PUBLISH_NOW}
            </Button>
          </div>
        </div>
      }
    >
      <div className="max-h-[60vh] overflow-y-auto px-2 space-y-8 py-6 custom-scrollbar-minimal">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {formData.scores.map((s) => {
            const critInfo = getCriteriaInfo(s.criteriaId);
            return (
              <div
                key={s.criteriaId}
                className="group flex flex-col gap-4 rounded-[32px] border border-gray-100 bg-gray-50/30 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-gray-100/50 hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">
                        Criteria
                      </span>
                      <h4
                        className="line-clamp-2 text-sm font-black text-text tracking-tight h-10 overflow-hidden leading-tight"
                        title={critInfo.name}
                      >
                        {critInfo.name}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <InputNumber
                        min={0}
                        max={critInfo.maxScore}
                        precision={2}
                        value={s.score}
                        onChange={(val) => handleScoreChange(s.criteriaId, 'score', val)}
                        className="w-24 rounded-2xl border-2! border-white! bg-white shadow-sm font-black text-lg h-12 [&_.ant-input-number-input]:text-center [&_.ant-input-number-input]:h-12 [&_.ant-input-number-input]:leading-[48px] focus:ring-4 focus:ring-primary/5 focus:border-primary/20! transition-all"
                        placeholder="0.0"
                        controls={false}
                      />
                      <span className="text-[9px] font-black text-muted/30 uppercase tracking-[0.2em]">
                        {LABELS.MAX_LABEL} {critInfo.maxScore}
                      </span>
                    </div>
                  </div>
                  <Input.TextArea
                    placeholder={LABELS.COMMENT}
                    value={s.comment}
                    onChange={(e) => handleScoreChange(s.criteriaId, 'comment', e.target.value)}
                    className="rounded-2xl border-none! bg-gray-100/50 p-4 text-xs font-medium transition-all hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm"
                    rows={2}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-primary/20 rounded-full" />
            <h5 className="text-[10px] font-black text-muted/50 uppercase tracking-[0.3em] font-black">
              {LABELS.GENERAL_COMMENT}
            </h5>
            <span className="h-0.5 flex-1 bg-gray-100 rounded-full" />
          </div>
          <Input.TextArea
            placeholder={LABELS.GENERAL_COMMENT}
            value={formData.generalComment}
            onChange={(e) => setFormData({ ...formData, generalComment: e.target.value })}
            rows={5}
            className="rounded-[32px] border-none! bg-gray-50/50 p-6 text-sm font-medium transition-all hover:bg-gray-50 focus:bg-white focus:shadow-xl focus:shadow-gray-100/50"
          />
        </div>
      </div>
    </CompoundModal>
  );
}
