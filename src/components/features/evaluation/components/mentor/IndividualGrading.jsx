'use client';

import { SaveOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import StatusBadge from '@/components/ui/status-badge';
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">
            {LABELS.DETAIL}
          </span>
          <span className="text-xl font-black text-text tracking-tight">{student?.fullName}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={800}
      footer={
        <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-[24px] border border-gray-100/50 backdrop-blur-sm m-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-muted/70 uppercase tracking-widest leading-none">
              {TABLE_COLUMNS.STATUS}
            </span>
            {(() => {
              const statusMap = {
                Pending: { label: STATUS.PENDING, variant: 'neutral' },
                Draft: { label: STATUS.DRAFT, variant: 'warning' },
                Submitted: { label: STATUS.SUBMITTED, variant: 'info' },
                Published: { label: STATUS.PUBLISHED, variant: 'success' },
              };

              const currentStatus = student?.evaluationStatus || student?.status || 'Pending';
              const statusInfo = statusMap[currentStatus] || statusMap['Pending'];

              return <StatusBadge variant={statusInfo.variant} label={statusInfo.label} />;
            })()}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-full h-10 px-6 font-black uppercase tracking-widest active:scale-95 transition-all text-[10px]"
            >
              {BUTTONS.CANCEL}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave()}
              loading={loading}
              className="rounded-full h-10 px-6 font-black uppercase tracking-widest active:scale-95 transition-all text-[10px] flex items-center gap-2"
            >
              <SaveOutlined /> {BUTTONS.SAVE_DRAFT}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave('publish')}
              loading={loading}
              className="rounded-full h-10 px-6 font-black uppercase tracking-widest active:scale-95 transition-all text-[10px] flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
            >
              <ThunderboltOutlined /> {BUTTONS.PUBLISH_NOW}
            </Button>
          </div>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto px-4 space-y-4 py-4 custom-scrollbar-minimal">
        {/* Student Info Card */}
        <div className="flex items-center gap-4 p-4 rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200/50">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[16px] bg-white/10 border border-white/20 text-xl font-black">
            {student?.fullName?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-black tracking-tight truncate">{student?.fullName}</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary-foreground text-[9px] font-black uppercase tracking-widest border border-primary/30">
                {student?.studentCode}
              </span>
            </div>
            <p className="text-white/60 text-xs font-semibold truncate uppercase tracking-widest">
              {cycle?.name} {LABELS.BULLET} {LABELS.TOTAL_SCORE}: {student?.totalScore || 0}{' '}
              {LABELS.POINTS}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
              {TABLE_COLUMNS.STATUS}
            </span>
            {(() => {
              const statusMap = {
                Pending: { label: STATUS.PENDING, variant: 'neutral' },
                Draft: { label: STATUS.DRAFT, variant: 'warning' },
                Submitted: { label: STATUS.SUBMITTED, variant: 'info' },
                Published: { label: STATUS.PUBLISHED, variant: 'success' },
              };
              const currentStatus = student?.evaluationStatus || student?.status || 'Pending';
              const statusInfo = statusMap[currentStatus] || statusMap['Pending'];
              return <StatusBadge variant={statusInfo.variant} label={statusInfo.label} />;
            })()}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-primary rounded-full" />
            <h5 className="text-[9px] font-black text-text uppercase tracking-[0.2em]">
              {LABELS.DETAILED_CRITERIA}
            </h5>
            <span className="h-0.5 flex-1 bg-gray-100 rounded-full" />
          </div>
          {formData.scores.map((s) => {
            const critInfo = getCriteriaInfo(s.criteriaId);
            return (
              <div
                key={s.criteriaId}
                className="group flex flex-col gap-3 rounded-[24px] border border-gray-100 bg-gray-50/20 p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-gray-100/30"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest">
                        {LABELS.CRITERIA_NAME}
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
                        className="w-20 rounded-xl border-2! border-white! bg-white shadow-sm font-black text-base h-10 [&_.ant-input-number-input]:text-center [&_.ant-input-number-input]:h-10 [&_.ant-input-number-input]:leading-[40px] focus:ring-4 focus:ring-primary/5 focus:border-primary/20! transition-all"
                        placeholder="0.0"
                        controls={false}
                      />
                      <span className="text-[9px] font-black text-muted/60 uppercase tracking-[0.2em]">
                        {LABELS.MAX_LABEL} {critInfo.maxScore}
                      </span>
                    </div>
                  </div>
                  <Input.TextArea
                    placeholder={LABELS.COMMENT}
                    value={s.comment}
                    onChange={(e) => handleScoreChange(s.criteriaId, 'comment', e.target.value)}
                    className="rounded-xl border-none! bg-gray-100/40 p-3 text-[11px] font-semibold text-slate-700 placeholder:text-slate-300 transition-all hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm"
                    rows={1}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-primary/20 rounded-full" />
            <h5 className="text-[10px] font-black text-muted/70 uppercase tracking-[0.3em] font-black">
              {LABELS.GENERAL_COMMENT}
            </h5>
            <span className="h-0.5 flex-1 bg-gray-100 rounded-full" />
          </div>
          <Input.TextArea
            placeholder={LABELS.GENERAL_COMMENT}
            value={formData.generalComment}
            onChange={(e) => setFormData({ ...formData, generalComment: e.target.value })}
            rows={3}
            className="rounded-[24px] border-none! bg-gray-50/50 p-4 text-xs font-semibold text-slate-700 placeholder:text-slate-400 transition-all hover:bg-gray-50 focus:bg-white focus:shadow-xl focus:shadow-gray-100/50"
          />
        </div>
      </div>
    </CompoundModal>
  );
}
