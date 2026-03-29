'use client';

import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ProjectOutlined,
  StarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Skeleton, Tabs } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { STUDENT_ACTIVITY_UI } from '../constants/student-activity.constants';
import { useStudentActivity } from '../hooks/useStudentActivity';
import EvaluationsTab from './tabs/EvaluationsTab';
import OverviewTab from './tabs/OverviewTab';
import ViolationsTab from './tabs/ViolationsTab';

const HeaderSummaryCard = ({ title, value, subValue, icon, variant = 'neutral', loading = false, progress }) => {
  const colorMap = {
    neutral: '#94a3b8',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  };

  const color = colorMap[variant] || colorMap.neutral;

  return (
    <div className="group relative flex flex-1 h-[84px] items-center overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-lg">
      <div className="relative z-10 flex h-full w-full items-center justify-between">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2 overflow-hidden">
            <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <span className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              {title}
            </span>
          </div>

          <div className="flex items-baseline gap-2 overflow-hidden">
            <h2 className="m-0 text-xl font-black leading-none tracking-tighter text-slate-900">
              {loading ? '...' : value}
            </h2>
            {progress !== undefined && (
              <span className="text-[10px] font-black tracking-tight" style={{ color }}>
                {progress}%
              </span>
            )}
            {!progress && subValue && (
              <span className="truncate text-[9px] font-bold italic tracking-tight text-slate-400 opacity-60">
                {subValue}
              </span>
            )}
          </div>
          
          {progress !== undefined && (
            <div className="mt-1.5 w-full max-w-[120px]">
              <Progress
                type="line"
                percent={progress}
                strokeColor={color}
                size={['100%', 3]}
                showInfo={false}
              />
            </div>
          )}
        </div>

        <div
          className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
          style={{
            background: `color-mix(in srgb, ${color}, transparent 94%)`,
            color: color,
            border: `1px solid color-mix(in srgb, ${color}, transparent 88%)`,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function StudentActivityDetail() {
  const { studentId } = useParams();
  const router = useRouter();
  const { DETAIL } = STUDENT_ACTIVITY_UI;
  const [activeTab, setActiveTab] = useState('overview');

  const {
    studentDetail,
    evaluations,
    violations,
    detailLoading,
    fetchStudentDetail,
  } = useStudentActivity();

  useEffect(() => {
    if (studentId) {
      fetchStudentDetail(studentId);
    }
  }, [studentId, fetchStudentDetail]);

  const handleBack = () => {
    router.push('/internship/students');
  };

  const isUnplaced = studentDetail?.derivedStatus?.value === 'UNPLACED';

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span className="flex items-center gap-2">
          <ProjectOutlined /> OVERVIEW
        </span>
      ),
      children: <OverviewTab student={studentDetail} loading={detailLoading} />,
    },
    {
      key: 'violations',
      label: (
        <span className="flex items-center gap-2">
          <ExclamationCircleOutlined /> 
          VIOLATIONS
          {violations.length > 0 && (
            <span className="size-4 rounded-full bg-error text-[10px] text-white flex items-center justify-center font-black leading-none">
              {violations.length}
            </span>
          )}
        </span>
      ),
      children: <ViolationsTab violations={violations} loading={detailLoading} />,
    },
    {
      key: 'evaluations',
      label: (
        <span className="flex items-center gap-2">
          <StarOutlined /> EVALUATIONS
          {evaluations.length > 0 && (
            <span className="size-4 rounded-full bg-warning text-[10px] text-white flex items-center justify-center font-black leading-none">
              {evaluations.length}
            </span>
          )}
        </span>
      ),
      children: <EvaluationsTab evaluations={evaluations} loading={detailLoading} />,
    },
  ];

  if (!detailLoading && !studentDetail) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="size-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 text-3xl">
          <ExclamationCircleOutlined />
        </div>
        <p className="text-slate-500 font-bold tracking-tight">Student information not found.</p>
        <button onClick={handleBack} className="bg-primary text-white py-2 px-6 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 relative bg-slate-100/30 min-h-screen">
      {/* HEADER SECTION (NON-STICKY) */}
      <div className="bg-white border-b border-slate-200/60 shadow-sm transition-all shadow-slate-200/50">
        <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[2200px] pt-4 px-6 md:px-10 pb-2">
          {/* Top Bar - Back Button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 group text-slate-400 hover:text-primary transition-all py-1.5 px-3 rounded-xl hover:bg-slate-50 -ml-3"
            >
              <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Back to Student List {studentDetail && `— ${studentDetail.studentFullName}`}
              </span>
            </button>
            <Badge variant="info-soft" size="xs" className="font-black uppercase tracking-[0.2em] opacity-80 ring-1 ring-info/20">Read-Only Mode</Badge>
          </div>

          {/* Student Profile Info */}
          <div className="flex items-center gap-6 mb-8 mt-2">
            <div className="size-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-3xl font-black text-primary border-4 border-slate-50 ring-1 ring-primary/5 shrink-0 transition-transform hover:rotate-3">
              {studentDetail?.studentFullName?.charAt(0) || 'S'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-black tracking-tight text-slate-800">
                  {detailLoading ? <Skeleton.Input active className="!w-48 !h-9" /> : studentDetail?.studentFullName}
                </h1>
                {!detailLoading && (
                  <Badge variant={studentDetail?.derivedStatus?.variant} size="sm" className="font-black uppercase tracking-widest text-[10px] py-1 px-3">
                    {studentDetail?.derivedStatus?.label}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-x-5 gap-y-1.5 flex-wrap text-[13px] font-bold text-slate-400 mt-1 italic leading-none">
                <span className="flex items-center gap-1.5"><TeamOutlined className="text-primary/40 size-3" /> {studentDetail?.studentCode}</span>
                <span className="opacity-20">•</span>
                <span className="text-slate-500 font-extrabold not-italic">{isUnplaced ? 'UNPLACED' : studentDetail?.enterpriseName}</span>
                {!isUnplaced && studentDetail?.mentorName && (
                  <>
                    <span className="opacity-20">•</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded text-[11px] not-italic border border-slate-200/50 font-black uppercase tracking-wider text-slate-400">Mentor: {studentDetail?.mentorName}</span>
                  </>
                )}
                <span className="opacity-20">•</span>
                <span className="text-primary/60 font-black uppercase tracking-tighter">Term: {studentDetail?.termName}</span>
              </div>
            </div>
          </div>

          {/* Activity Summary Cards */}
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
            {!isUnplaced && (
              <HeaderSummaryCard
                title="LOGBOOK PROGRESS"
                value={`${studentDetail?.activity?.submitted - studentDetail?.activity?.missing}/${studentDetail?.activity?.submitted}`}
                subValue={`${studentDetail?.activity?.missing} missing logs`}
                progress={studentDetail?.activity?.progress}
                icon={<FileTextOutlined />}
                variant="info"
                loading={detailLoading}
              />
            )}
            
            {(violations.length > 0 || !isUnplaced) && (
              <HeaderSummaryCard
                title="VIOLATIONS"
                value={`${violations.length} RECORDED`}
                subValue={violations.length > 0 ? "Under disciplinary review" : "No violations found"}
                icon={<ExclamationCircleOutlined />}
                variant={violations.length > 0 ? "danger" : "success"}
                loading={detailLoading}
              />
            )}

            <HeaderSummaryCard
              title="EVALUATIONS"
              value={evaluations.length > 0 
                ? `${evaluations.length} CYCLES PUBLISHED`
                : "NO EVALUATION"
              }
              subValue={evaluations.length > 0 ? `Latest: ${evaluations[0].createdAt}` : 'Pending evaluation cycle'}
              icon={<StarOutlined />}
              variant="warning"
              loading={detailLoading}
            />
          </div>

          {/* Tab Navigation Wrapper (Now it can be sticky if desired, but here we just keep it clean) */}
          <div className="detail-tabs-wrapper -mb-[1px]">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems.map(t => ({ ...t, children: null }))}
              className="student-activity-tabs"
            />
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[2200px] p-6 md:p-10 transition-all">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tabItems.find(t => t.key === activeTab)?.children}
        </div>
      </div>

      <style jsx global>{`
        .student-activity-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .student-activity-tabs .ant-tabs-nav:before {
          border-bottom: none !important;
        }
        .student-activity-tabs .ant-tabs-tab {
          padding: 12px 32px !important;
          margin: 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .student-activity-tabs .ant-tabs-tab-btn {
          font-family: inherit !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.12em !important;
          font-size: 11px !important;
          color: #94a3b8 !important;
        }
        .student-activity-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #2563eb !important;
        }
        .student-activity-tabs .ant-tabs-ink-bar {
          height: 3px !important;
          border-radius: 3px 3px 0 0 !important;
          background: #2563eb !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
