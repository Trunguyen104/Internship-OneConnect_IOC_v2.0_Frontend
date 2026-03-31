'use client';

import { ArrowLeftOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Card, Tabs } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

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
      label: UI_TEXT.STUDENT_ACTIVITY.TABS.OVERVIEW,
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
      label: UI_TEXT.STUDENT_ACTIVITY.TABS.LOGBOOK,
      children: <LogbookTab student={student} loading={detailLoading} />,
    },
    {
      key: 'violations',
      label: UI_TEXT.STUDENT_ACTIVITY.TABS.VIOLATIONS,
      children: <ViolationsTab violations={violations} loading={detailLoading} />,
    },
    {
      key: 'evaluations',
      label: UI_TEXT.STUDENT_ACTIVITY.TABS.EVALUATIONS,
      children: <EvaluationsTab evaluations={evaluations} loading={detailLoading} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              className="flex items-center gap-2 font-black text-slate-400 hover:text-primary transition-colors p-0 h-auto text-[10px] tracking-widest"
            >
              {UI_TEXT.STUDENT_ACTIVITY.BACK_TO_LIST}
            </Button>
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-[22px] bg-primary/10 flex items-center justify-center text-primary text-xl shadow-inner border border-primary/5">
                <ReadOutlined className="text-xs" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                {student?.fullName || UI_TEXT.STUDENT_ACTIVITY.TITLE}
              </h1>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 pl-11">
              {UI_TEXT.STUDENT_ACTIVITY.PAGE_TITLE_SUFFIX}
            </p>
          </div>
        </div>

        <Card className="!rounded-[48px] border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md overflow-hidden">
          <Tabs
            defaultActiveKey="overview"
            items={items}
            className="student-activity-tabs px-8 pb-8 pt-4"
          />
        </Card>
      </div>
    </div>
  );
}
