'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { cn } from '@/lib/cn';

import { JOB_POSTING_UI } from '../constants/job-postings.constant';

/**
 * Hook to handle UI actions and confirmation modals for Job Postings.
 */
export const useJobPostingsActionsHandler = ({ actions }) => {
  const { modal: modalApi } = App.useApp();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const showConfirm = ({
    title: confirmTitle,
    content,
    onOk,
    confirmText = JOB_POSTING_UI.CONFIRM.BUTTONS.CONFIRM,
    variant = 'default',
  }) => {
    modalApi.confirm({
      title: <span className="text-text text-lg font-black tracking-tight">{confirmTitle}</span>,
      content: <p className="text-muted mt-2 font-medium">{content}</p>,
      okText: confirmText,
      cancelText: JOB_POSTING_UI.CONFIRM.BUTTONS.CANCEL,
      centered: true,
      width: 440,
      className: 'premium-confirm-modal',
      okButtonProps: {
        className: cn(
          'h-10 rounded-xl px-6 text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 active:translate-y-0',
          variant === 'danger'
            ? 'bg-danger text-white shadow-lg shadow-danger/20'
            : 'bg-primary text-white shadow-lg shadow-primary/20'
        ),
      },
      cancelButtonProps: {
        className:
          'border-border text-muted hover:bg-bg h-10 rounded-xl border px-6 text-[11px] font-bold uppercase tracking-wider transition-all',
      },
      onOk,
    });
  };

  const onAction = async (key, record) => {
    const title = record?.title || JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK;
    const id = record?.jobId || record?.id;
    if (!id) return;

    const activeAppCount = (record.applicationStatusCounts || [])
      .filter((item) => [1, 2, 3, 4].includes(Number(item.status))) // Applied, Interviewing, Offered, Pending Assignment
      .reduce((sum, item) => sum + item.count, 0);

    switch (key) {
      case 'publish':
        showConfirm({
          title: JOB_POSTING_UI.CONFIRM.PUBLISH.TITLE,
          content: JOB_POSTING_UI.CONFIRM.PUBLISH.CONTENT(title),
          onOk: () => actions.publishDraft.mutate(id),
        });
        break;
      case 'close':
        showConfirm({
          title: JOB_POSTING_UI.CONFIRM.CLOSE.TITLE,
          content: JOB_POSTING_UI.CONFIRM.CLOSE.CONTENT_INACTIVE(title),
          onOk: async () => {
            try {
              // First attempt without force flag
              await actions.closeJob.mutateAsync({
                id,
                data: { confirmWhenHasActiveApplications: false },
              });
            } catch (error) {
              // If backend detects active applicants
              const statusCode = error.status || error.response?.status;
              if (statusCode === 409) {
                const errorData = error.data || error.response?.data || {};
                showConfirm({
                  title: JOB_POSTING_UI.CONFIRM.CLOSE.TITLE,
                  content:
                    errorData.message ||
                    error.message ||
                    JOB_POSTING_UI.CONFIRM.CLOSE.CONTENT_ACTIVE(
                      title,
                      activeAppCount || JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK
                    ),
                  onOk: () =>
                    actions.closeJob.mutate({
                      id,
                      data: { confirmWhenHasActiveApplications: true },
                    }),
                });
              } else if (statusCode !== 200) {
                // If it's another error, let the mutation's default handleError do its job
                // or handle it here if mutateAsync suppressed it
                console.error('Close failed with status:', statusCode, error);
              }
            }
          },
        });
        break;
      case 'delete':
        showConfirm({
          title: JOB_POSTING_UI.CONFIRM.DELETE.TITLE,
          content:
            activeAppCount > 0
              ? JOB_POSTING_UI.CONFIRM.DELETE.CONTENT_ACTIVE(title, activeAppCount)
              : JOB_POSTING_UI.CONFIRM.DELETE.CONTENT_INACTIVE(title),
          onOk: () =>
            actions.deleteJob.mutate({
              id,
              data: { confirmWhenHasActiveApplications: true },
            }),
          confirmText: JOB_POSTING_UI.CONFIRM.DELETE.BUTTON,
          variant: 'danger',
        });
        break;
      case 'edit':
      case 'republish':
        try {
          // CALL API GET BY ID to get full fields like description, requirements...
          const res = await actions.getJobDetail.mutateAsync(id);
          // Unwrap the API response envelope (res.data.data)
          const fullRecord = res?.data?.data || res?.data || res;
          setSelectedRecord(fullRecord);
          setIsDrawerOpen(true);
        } catch (error) {
          console.error('Failed to fetch job detail:', error);
          setSelectedRecord(record); // Fallback to list record if API fails
          setIsDrawerOpen(true);
        }
        break;
      case 'view':
        router.push(`/company/jobs/${id}`);
        break;
      default:
        break;
    }
  };

  const openCreateDrawer = () => {
    setSelectedRecord(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecord(null);
  };

  return {
    isDrawerOpen,
    selectedRecord,
    onAction,
    openCreateDrawer,
    closeDrawer,
  };
};
