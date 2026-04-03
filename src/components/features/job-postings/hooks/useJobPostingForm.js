'use client';

import { App, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { INTERN_PHASE_STATUS } from '@/constants/intern-phase-management/intern-phase';
import { useToast } from '@/providers/ToastProvider';

import { JOB_AUDIENCE, JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';
import { useJobPostingActions, useUniversities } from '../hooks/useJobPostings';

/**
 * Custom hook to manage Job Posting Form logic (Logic-only).
 */
export const useJobPostingForm = ({ open, record, phases, onCancel, onSuccess }) => {
  const { modal: modalApi } = App.useApp();
  const toast = useToast();
  const [form] = Form.useForm();
  const isEdit = !!record;
  const actions = useJobPostingActions();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState(null);

  // State to track the ID of a newly created draft (auto-save)
  const [currentJobId, setCurrentJobId] = useState(null);

  const activeAppCount = useMemo(() => {
    if (!record) return 0;
    return (record.applicationStatusCounts || [])
      .filter((item) => [1, 2, 3].includes(item.status)) // Applied, Interviewing, Offered
      .reduce((sum, item) => sum + item.count, 0);
  }, [record]);

  const { universities } = useUniversities();
  const audience = Form.useWatch('audience', form);

  const schoolOptions = useMemo(
    () => universities.map((u) => ({ label: u.name, value: u.universityId })),
    [universities]
  );

  const phaseOptions = useMemo(() => {
    const currentPhaseId = record?.internshipPhaseId || record?.phaseId;

    return phases
      .filter((p) => {
        const isUpcomingOrActive = [
          INTERN_PHASE_STATUS.UPCOMING,
          INTERN_PHASE_STATUS.ACTIVE,
        ].includes(p.status);
        const isCurrentPhase =
          isEdit && (p.internshipPhaseId || p.phaseId || p.id) === currentPhaseId;
        return isUpcomingOrActive || isCurrentPhase;
      })
      .map((p) => ({
        label: `${p.name} [${dayjs(p.startDate).format('DD/MM')} — ${dayjs(p.endDate).format('DD/MM/YYYY')}] ${p.majors ? `— ${p.majors}` : ''}`,
        value: p.internshipPhaseId || p.phaseId || p.id,
        startDate: p.startDate,
        endDate: p.endDate,
        name: p.name,
        status: p.status,
      }));
  }, [phases, isEdit, record]);

  const handlePhaseChange = (value) => {
    if (isEdit && activeAppCount > 0 && value !== record.internshipPhaseId) {
      toast.error(
        JOB_POSTING_UI.FORM.MESSAGES.HEADERS.ERROR,
        JOB_POSTING_UI.FORM.MODALS.CHANGE_BLOCKED.CONTENT(activeAppCount)
      );
      form.setFieldsValue({ internshipPhaseId: record.internshipPhaseId });
      return;
    }

    const phase = phaseOptions.find((p) => p.value === value);
    if (phase) {
      form.setFieldsValue({
        startDate: phase.startDate,
        endDate: phase.endDate,
      });
      if (form.getFieldValue('expireDate')) {
        form.validateFields(['expireDate']);
      }
    }
  };

  const submitData = async (values, isDraft = false, forceUpdate = false) => {
    let finalDescription = (values.description || '').replace(/\n/g, '<br/>');
    if (values.jobRoleDescription) {
      const roleMarker = JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.JOB_ROLE_DESCRIPTION_LABEL;
      finalDescription += `<br/><br/><strong>${roleMarker}</strong><br/>${values.jobRoleDescription.replace(/\n/g, '<br/>')}`;
    }

    const currentStatus = record?.status;
    let targetStatus;

    if (isDraft) {
      // Manual "Save Draft" or Auto-save: PRESERVE status if it's already Published or Closed
      if (currentStatus === JOB_STATUS.PUBLISHED || currentStatus === JOB_STATUS.CLOSED) {
        targetStatus = currentStatus;
      } else {
        targetStatus = JOB_STATUS.DRAFT;
      }
    } else {
      // Manual "Publish" or "Save Changes" (while already published): transition to PUBLISHED
      targetStatus = JOB_STATUS.PUBLISHED;
    }

    // Construct payload matching Backend C# UpdateJobCommand exactly
    const payload = {
      jobId: currentJobId || record?.jobId || record?.id,
      title: values.title?.trim() || '',
      position: values.position?.trim() || null,
      description: finalDescription,
      requirements: values.requirements?.trim() || null,
      benefit: values.benefit?.trim() || null,
      location: values.location?.trim() || null,
      status: targetStatus, // MUST be included for the C# Validator
      expireDate: values.expireDate ? dayjs(values.expireDate).endOf('day').toISOString() : null,
      audience: values.audience || JOB_AUDIENCE.PUBLIC,
      internshipPhaseId: values.internshipPhaseId || null,
      universityIds:
        values.audience === JOB_AUDIENCE.TARGETED && values.universityIds?.length > 0
          ? Array.isArray(values.universityIds)
            ? values.universityIds
            : [values.universityIds]
          : [],
      forceUpdateWithApplications: forceUpdate,
    };

    const effectiveId = payload.jobId;

    if (effectiveId) {
      // UPDATE existing
      const res = await actions.updateJob.mutateAsync({ id: effectiveId, data: payload });
      return res;
    } else {
      // CREATE new
      const publishAction = isDraft ? actions.saveDraft : actions.createJob;
      const res = await publishAction.mutateAsync(payload);
      if (isDraft && res?.data?.jobId) setCurrentJobId(res.data.jobId);
      return res;
    }
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();

      const status = record?.status;
      const isDraft = status === JOB_STATUS.DRAFT;
      const isClosed = status === JOB_STATUS.CLOSED;
      const effectiveId = currentJobId || record?.jobId || record?.id;

      // AC-05 logic for Published jobs with active applications
      if (isEdit && status === JOB_STATUS.PUBLISHED && activeAppCount > 0) {
        modalApi.confirm({
          title: JOB_POSTING_UI.FORM.MODALS.CONFIRM_UPDATE.TITLE,
          content: JOB_POSTING_UI.FORM.MODALS.CONFIRM_UPDATE.CONTENT(activeAppCount),
          centered: true,
          onOk: async () => {
            setLastAutoSaved(null);
            await submitData(values, false, true); // Mutation handles SUCCESS toast
            onSuccess?.();
            form.resetFields();
          },
        });
        return;
      }

      // Case: Publish a DRAFT or Reopen a CLOSED job
      if ((isDraft || isClosed) && effectiveId) {
        if (isClosed) {
          // AC-07 Validation for Reopening
          const expireDate = values.expireDate;
          const phaseId = values.internshipPhaseId;
          const selectedPhase = phases?.find(
            (p) => (p.internshipPhaseId || p.phaseId || p.id) === phaseId
          );

          if (selectedPhase && expireDate) {
            const startDate = dayjs(selectedPhase.startDate);
            const today = dayjs().startOf('day');

            // AC-07: Deadline >= Today AND <= Phase StartDate
            const isStarted = today.isAfter(startDate);
            const endDate = dayjs(selectedPhase.endDate);
            const deadlineBound = isStarted ? endDate : startDate;

            if (dayjs(expireDate).isBefore(today) || dayjs(expireDate).isAfter(deadlineBound)) {
              toast.error(
                JOB_POSTING_UI.FORM.MESSAGES.HEADERS.VALIDATION,
                JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE_FOR_REOPEN
              );
              return;
            }
          }

          // AC-07: For CLOSED jobs, we simply update with status = PUBLISHED to reopen
          setLastAutoSaved(null);
          // Mutation 'updateJob' will show the success toast automatically
          await submitData(values, false);
          onSuccess?.();
          form.resetFields();
        } else {
          // Normal Publish for DRAFT: Save as Draft first then trigger Publish endpoint
          setLastAutoSaved(null);
          await submitData(values, true); // This will show "updated" toast
          await actions.publishDraft.mutateAsync(effectiveId); // This will show "published" toast
          onSuccess?.();
          form.resetFields();
        }
      } else if (isEdit) {
        // Standard Update for Published
        await submitData(values, false);
        onSuccess?.();
        form.resetFields();
      } else {
        // Normal Create/Publish (new job)
        await submitData(values, false);
        onSuccess?.();
        form.resetFields();
      }
    } catch (err) {
      console.error('Submit failed:', err);
      // Use standard error extractor logic if possible
      const errorMsg =
        err?.data?.errors?.[0] || err?.message || JOB_POSTING_UI.FORM.MESSAGES.GENERAL_ERROR;
      toast.error(JOB_POSTING_UI.FORM.MESSAGES.HEADERS.ERROR, errorMsg);
    }
  };

  const handleSaveDraft = async (silent = false) => {
    const title = form.getFieldValue('title');

    // AC-01: Auto-save requires at least a title. PhaseId is optional for drafts.
    if (!title || title.trim() === '') return;

    try {
      if (silent) setIsAutoSaving(true);
      const values = form.getFieldsValue();
      await submitData(values, true);
      setLastAutoSaved(dayjs().format('HH:mm:ss'));

      // If manual save (not silent auto-save), close the form
      if (!silent) {
        onSuccess?.();
        form.resetFields();
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      if (silent) setIsAutoSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    // When the drawer opens with a record (fetched via ViewDetail in onAction), populate form
    if (open && record) {
      const cleanHtml = (html) => {
        if (!html || typeof html !== 'string') return '';
        return html
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '') // Strip other tags
          .replace(/&nbsp;/g, ' ')
          .trim();
      };

      // Handle Role Description partitioning
      let displayDescription = record.description || '';
      let displayRoleDescription = record.jobRoleDescription || '';
      const marker = JOB_POSTING_UI.FORM.MESSAGES.JOB_ROLE_DESCRIPTION_LABEL;
      const markerRegex = new RegExp(
        `<br\\s*\\/?><br\\s*\\/?><strong>${marker}<\\/strong><br\\s*\\/?>`,
        'i'
      );

      if (displayDescription.includes(marker)) {
        const parts = displayDescription.split(markerRegex);
        if (parts.length > 1) {
          displayDescription = parts[0];
          displayRoleDescription = parts[1];
        }
      }

      // Map university IDs correctly
      let universityIds = record.universityIds || [];
      if (universityIds.length === 0 && record.universities) {
        universityIds = record.universities.map((u) => u.universityId || u.id);
      } else if (universityIds.length === 0 && record.universityId) {
        universityIds = [record.universityId];
      }

      const phaseId = record.internshipPhaseId || record.phaseId;

      form.setFieldsValue({
        ...record,
        internshipPhaseId: phaseId,
        description: cleanHtml(displayDescription),
        requirements: cleanHtml(record.requirements),
        benefit: cleanHtml(record.benefit),
        jobRoleDescription: cleanHtml(displayRoleDescription),
        expireDate: record.expireDate ? dayjs(record.expireDate) : null,
        universityIds: universityIds,
        audience: Number(record.audience || JOB_AUDIENCE.PUBLIC),
      });
    } else if (open && !record) {
      form.resetFields();
      setCurrentJobId(null);
    }
  }, [open, record, form]);

  return {
    form,
    isEdit,
    actions,
    isAutoSaving,
    lastAutoSaved,
    audience,
    schoolOptions,
    phaseOptions,
    handlePhaseChange,
    handlePublish,
    handleSaveDraft,
    handleCancel,
  };
};
