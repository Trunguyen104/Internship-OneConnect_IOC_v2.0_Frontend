'use client';
/* eslint-disable react/jsx-no-literals */

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  HistoryOutlined,
  LineChartOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import PageLayout from '@/components/ui/pagelayout';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

import { useStudentDetail } from '../hooks/useStudentDetail';
import EvaluationsTab from './tabs/EvaluationsTab';
import LogbookTab from './tabs/LogbookTab';
import OverviewTab from './tabs/OverviewTab';
import ViolationsTab from './tabs/ViolationsTab';

export default function StudentActivityDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = params?.studentId;
  const termIdFromUrl = searchParams.get('termId');
  const [activeTab, setActiveTab] = useState('overview');

  const {
    student,
    evaluations,
    violations,
    loading: detailLoading,
  } = useStudentDetail(studentId, termIdFromUrl);

  const items = [
    {
      key: 'overview',
      label: (
        <span className="flex items-center gap-2 px-1">
          <SolutionOutlined className="text-xs" />
          {STUDENT_ACTIVITY_UI.TABS.OVERVIEW}
        </span>
      ),
      children: (
        <OverviewTab
          student={student}
          loading={detailLoading}
          evaluations={evaluations}
          violations={violations}
        />
      ),
    },
    {
      key: 'logbook',
      label: (
        <span className="flex items-center gap-2 px-1">
          <ReadOutlined className="text-xs" />
          {STUDENT_ACTIVITY_UI.TABS.LOGBOOK}
        </span>
      ),
      children: <LogbookTab student={student} loading={detailLoading} />,
    },
    {
      key: 'violations',
      label: (
        <span className="flex items-center gap-2 px-1">
          <HistoryOutlined className="text-xs" />
          {STUDENT_ACTIVITY_UI.TABS.VIOLATIONS}
        </span>
      ),
      children: <ViolationsTab student={student} violations={violations} loading={detailLoading} />,
    },
    {
      key: 'evaluations',
      label: (
        <span className="flex items-center gap-2 px-1">
          <LineChartOutlined className="text-xs" />
          {STUDENT_ACTIVITY_UI.TABS.EVALUATIONS}
        </span>
      ),
      children: (
        <EvaluationsTab student={student} evaluations={evaluations} loading={detailLoading} />
      ),
    },
  ];

  const statuses = {
    1: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.ACTIVE, variant: 'success' },
    2: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.NO_GROUP, variant: 'warning' },
    3: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.COMPLETED, variant: 'info' },
    4: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.PENDING, variant: 'warning' },
    5: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.UNPLACED, variant: 'danger' },
    Active: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.ACTIVE, variant: 'success' },
    NoGroup: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.NO_GROUP, variant: 'warning' },
    Completed: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.COMPLETED, variant: 'info' },
    PendingConfirmation: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.PENDING, variant: 'warning' },
    Unplaced: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.UNPLACED, variant: 'danger' },
  };

  const status = statuses[student?.internshipStatus] || {
    label: student?.internshipStatus || '—',
    variant: 'default',
  };

  return (
    <PageLayout className="gap-0! pt-0!">
      <div className="px-2 mb-6">
        <Button
          type="text"
          icon={
            <ArrowLeftOutlined className="text-[9px] group-hover:-translate-x-1 transition-transform" />
          }
          onClick={() => router.back()}
          className="group flex items-center gap-2 font-semibold text-slate-400 hover:text-primary transition-all p-0 h-6 text-[10px] tracking-[0.2em] uppercase mb-6"
        >
          {STUDENT_ACTIVITY_UI.BACK_TO_LIST}
        </Button>

        {/* Unified Header Card */}
        <div className="bg-white overflow-hidden border border-white shadow-xl shadow-slate-200/40 rounded-[32px] transition-all duration-500">
          {/* Profile Section */}
          <div className="p-8 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="size-20 rounded-[28px] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-primary border-2 border-white overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    {student?.avatarUrl ? (
                      <img src={student.avatarUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-slate-50 text-slate-300">
                        <UserOutlined className="text-3xl" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-6 bg-green-500 rounded-xl border-4 border-white shadow-sm" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                      {STUDENT_ACTIVITY_UI.OVERVIEW.DETAIL_TITLE_PREFIX}{' '}
                      {student?.fullName || '...'}
                    </h1>
                    <Badge
                      variant={status.variant}
                      className="font-bold text-[9px] uppercase tracking-widest px-3 py-1"
                    >
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100/50">
                      <UserOutlined className="text-[10px] text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {student?.studentCode || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100/50">
                      <TeamOutlined className="text-[10px] text-slate-400" />
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-600 truncate max-w-[200px]"
                        title={student?.enterpriseName}
                      >
                        {student?.enterpriseName || STUDENT_ACTIVITY_UI.OVERVIEW.NO_BUSINESS}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100/50">
                      <SolutionOutlined className="text-[10px] text-slate-400" />
                      <span className="text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                        {STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.MENTOR_LABEL}{' '}
                        <span className="text-slate-800 font-bold">
                          {student?.mentorName || UI_TEXT.COMMON.EM_DASH}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100/50">
                      <CalendarOutlined className="text-[10px] text-slate-400" />
                      <span className="text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                        {STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.TERM_LABEL}{' '}
                        <span className="text-slate-800 font-bold">
                          {student?.termName || UI_TEXT.COMMON.EM_DASH}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Tab bar integrated into Card bottom */}
          <div className="mb-5 sticky top-0 z-30 bg-white border-t border-slate-50 px-8">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items.map(({ children, ...item }) => item)}
              className="student-activity-detail-tabs"
            />
          </div>

          {/* Tab Content Seamlessly Integrated */}
          <div className="p-8 pt-8 bg-slate-50/20 min-h-[500px]">
            <div className="max-w-[1600px] mx-auto">
              {items.find((item) => item.key === activeTab)?.children}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .student-activity-detail-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .student-activity-detail-tabs .ant-tabs-nav::before {
          display: none;
        }
        .student-activity-detail-tabs .ant-tabs-tab {
          padding: 12px 0 !important;
          margin: 0 24px 0 0 !important;
        }
        .student-activity-detail-tabs .ant-tabs-tab-btn {
          font-weight: 700 !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .student-activity-detail-tabs .ant-tabs-ink-bar {
          height: 3px !important;
          border-radius: 3px 3px 0 0 !important;
          background: var(--color-primary) !important;
        }
      `}</style>
    </PageLayout>
  );
}
