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
import React, { useEffect, useState } from 'react';

import Badge from '@/components/ui/badge';
import PageLayout from '@/components/ui/pagelayout';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

import useStudentActivity from '../hooks/useStudentActivity';
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
    studentDetail: student,
    evaluations,
    violations,
    detailLoading,
    fetchStudentDetail,
  } = useStudentActivity();

  useEffect(() => {
    if (studentId) {
      fetchStudentDetail(studentId, termIdFromUrl);
    }
  }, [studentId, termIdFromUrl, fetchStudentDetail]);

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
      children: <ViolationsTab violations={violations} loading={detailLoading} />,
    },
    {
      key: 'evaluations',
      label: (
        <span className="flex items-center gap-2 px-1">
          <LineChartOutlined className="text-xs" />
          {STUDENT_ACTIVITY_UI.TABS.EVALUATIONS}
        </span>
      ),
      children: <EvaluationsTab evaluations={evaluations} loading={detailLoading} />,
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
      {/* Detail Header Section */}
      <div className="px-2 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined className="text-[10px]" />}
          onClick={() => router.back()}
          className="flex items-center gap-2 font-black text-slate-400 hover:text-primary transition-all p-0 h-auto text-[10px] tracking-widest uppercase mb-6"
        >
          {STUDENT_ACTIVITY_UI.BACK_TO_LIST}
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="size-16 rounded-[24px] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-primary border-2 border-white overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {student?.avatarUrl ? (
                  <img src={student.avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center bg-slate-50 text-slate-300">
                    <UserOutlined className="text-2xl" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-green-500 rounded-lg border-2 border-white shadow-sm" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-slate-800">
                  {STUDENT_ACTIVITY_UI.OVERVIEW.DETAIL_TITLE_PREFIX} {student?.fullName || '...'}
                </h1>
                <Badge
                  variant={status.variant}
                  className="font-black text-[9px] uppercase tracking-widest px-3 py-1"
                >
                  {status.label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 flex-wrap text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                  <UserOutlined className="text-[10px]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {student?.studentCode || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                  <TeamOutlined className="text-[10px]" />
                  <span
                    className="text-[10px] font-black uppercase tracking-wider text-slate-600 truncate max-w-[200px]"
                    title={student?.enterpriseName}
                  >
                    {student?.enterpriseName || STUDENT_ACTIVITY_UI.OVERVIEW.NO_BUSINESS}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                  <UserOutlined className="text-[10px]" />
                  <span className="text-[10px] font-black tracking-wider whitespace-nowrap text-slate-500 uppercase">
                    {STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.MENTOR_LABEL}{' '}
                    <span className="text-slate-800 font-black">
                      {student?.mentorName || UI_TEXT.COMMON.EM_DASH}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                  <CalendarOutlined className="text-[10px]" />
                  <span className="text-[10px] font-black tracking-wider whitespace-nowrap text-slate-500 uppercase">
                    {STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.TERM_LABEL}{' '}
                    <span className="text-slate-800 font-black">
                      {student?.termName || UI_TEXT.COMMON.EM_DASH}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md pt-2 px-2 border-b border-white/40">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items.map(({ children, ...item }) => item)}
          className="student-activity-detail-tabs"
        />
      </div>

      <div className="mt-6 flex-1 min-h-0">
        <div className="max-w-[1700px] mx-auto pb-12 px-2">
          {items.find((item) => item.key === activeTab)?.children}
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
          font-weight: 900 !important;
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
