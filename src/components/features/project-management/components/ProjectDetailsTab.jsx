'use client';

import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
  getOperationalStatus,
  OPERATIONAL_STATUS,
} from '@/constants/project-management/project-management';

export default function ProjectDetailsTab({ currentProject, DETAIL, FORM, isHR, onAssign }) {
  return (
    <div className="space-y-6 pt-4">
      <section>
        <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.DESCRIPTION}
        </h4>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
          {currentProject?.description || DETAIL.SECTIONS?.DESCRIPTION_EMPTY}
        </p>
      </section>

      <Card className="min-h-0! border-none shadow-none bg-slate-50 p-4">
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          <section className="min-w-[120px]">
            <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
              {DETAIL.SECTIONS?.MENTOR}
            </h4>
            <div className="flex min-h-[32px] items-center gap-2">
              <Avatar
                size="small"
                src={currentProject?.mentorAvatar}
                icon={<UserOutlined />}
                className="bg-primary/10 text-primary border-none"
              />
              <span className="text-sm font-bold text-slate-700">
                {currentProject?.mentorName ||
                  currentProject?.groupInfo?.mentorName ||
                  FORM.LABEL.N_A}
              </span>
            </div>
          </section>
          <section className="min-w-fit">
            <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
              {DETAIL.SECTIONS?.FIELD}
            </h4>
            <div className="flex min-h-[32px] items-center">
              <Badge variant="primary-soft" size="sm">
                {currentProject?.field || FORM.LABEL.N_A}
              </Badge>
            </div>
          </section>
          <section className="min-w-[180px]">
            <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
              {DETAIL.SECTIONS?.TIMELINE}
            </h4>
            <div className="flex min-h-[32px] items-center whitespace-nowrap text-sm font-bold text-slate-700">
              {currentProject?.startDate
                ? dayjs(currentProject.startDate).format('DD/MM/YYYY')
                : DETAIL.GROUP.TBA}
              <ArrowRightOutlined className="mx-2 text-[10px] text-slate-300" />
              {currentProject?.endDate
                ? dayjs(currentProject.endDate).format('DD/MM/YYYY')
                : DETAIL.GROUP.TBA}
            </div>
          </section>
        </div>
      </Card>

      <section>
        <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.GROUP_INFO}
        </h4>
        {currentProject?.groupInfo?.groupName ||
        currentProject?.groupName ||
        currentProject?.internshipGroup?.groupName ? (
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div>
                <div className="text-lg font-bold text-slate-800">
                  {currentProject?.groupInfo?.groupName ||
                    currentProject.groupName ||
                    currentProject.internshipGroup?.groupName}
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {DETAIL.GROUP.ID}:{' '}
                    {currentProject.groupInfo?.internshipId ||
                      currentProject.internshipId ||
                      FORM.LABEL.N_A}
                  </div>
                  {isHR &&
                    (currentProject.internshipId || currentProject.groupInfo?.internshipId) && (
                      <Link
                        href={`/internship-management?groupId=${currentProject.groupInfo?.internshipId || currentProject.internshipId}`}
                        className="text-[10px] text-primary hover:text-primary-hover font-bold flex items-center gap-1.5 underline decoration-primary/30 underline-offset-4"
                      >
                        <ArrowRightOutlined className="rotate-180" /> {DETAIL.GROUP?.MANAGE_LINK}
                      </Link>
                    )}
                </div>
              </div>
              {currentProject?.groupInfo?.status === DETAIL.GROUP?.ARCHIVED_VALUE ||
              currentProject?.groupStatus === DETAIL.GROUP?.ARCHIVED_VALUE ||
              currentProject?.internshipGroup?.status === DETAIL.GROUP?.ARCHIVED_VALUE ? (
                <Badge variant="default" size="sm">
                  {DETAIL.GROUP.ARCHIVED_LABEL}
                </Badge>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="flex flex-col bg-slate-50 border border-slate-100/50 rounded-lg p-3">
                <span className="text-[9px] uppercase text-slate-400 font-bold mb-1.5 tracking-widest">
                  {DETAIL.GROUP?.MENTOR}
                </span>
                <div className="flex items-center gap-2">
                  <Avatar
                    size={20}
                    icon={<UserOutlined />}
                    className="bg-blue-50 text-blue-500 border-none"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {currentProject.groupInfo?.mentorName ||
                      currentProject.internshipGroup?.mentorName ||
                      FORM.LABEL.N_A}
                  </span>
                </div>
              </div>
              <div className="flex flex-col bg-slate-50 border border-slate-100/50 rounded-lg p-3">
                <span className="text-[9px] uppercase text-slate-400 font-bold mb-1.5 tracking-widest">
                  {DETAIL.GROUP?.STUDENT_COUNT}
                </span>
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {currentProject.groupInfo?.studentCount ??
                    currentProject.groupInfo?.numberOfMembers ??
                    currentProject.internshipGroup?.studentCount ??
                    currentProject.internshipGroup?.numberOfMembers ??
                    0}{' '}
                  {DETAIL.GROUP?.STUDENTS_SUFFIX}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-5 bg-red-50/50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <ExclamationCircleOutlined className="text-xl" />
              </div>
              <div>
                <div className="text-red-700 font-bold text-sm">
                  {currentProject?.isOrphaned ? DETAIL.GROUP?.DELETED : DETAIL.GROUP?.NOT_ASSIGNED}
                </div>
                <div className="text-[11px] text-red-500/80 font-medium">
                  {currentProject?.isOrphaned
                    ? DETAIL.GROUP?.DELETED_HINT
                    : DETAIL.GROUP?.NOT_ASSIGNED_HINT}
                </div>
              </div>
            </div>

            {!isHR &&
              onAssign &&
              getOperationalStatus(currentProject?.operationalStatus) !==
                OPERATIONAL_STATUS.COMPLETED &&
              getOperationalStatus(currentProject?.operationalStatus) !==
                OPERATIONAL_STATUS.ARCHIVED && (
                <Button
                  size="sm"
                  variant="danger"
                  className="mt-2 font-bold uppercase tracking-wider w-fit ml-[52px] shadow-sm hover:shadow-md transition-all"
                  onClick={() => onAssign(currentProject)}
                  icon={<UsergroupAddOutlined />}
                >
                  {DETAIL.GROUP.ASSIGN_BTN}
                </Button>
              )}
          </div>
        )}
      </section>

      <section>
        <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-amber-400 pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.REQUIREMENTS}
        </h4>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl text-sm border border-slate-100/50">
          {currentProject?.requirements || DETAIL.SECTIONS?.REQUIREMENTS_EMPTY}
        </p>
      </section>

      <section>
        <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-emerald-400 pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.DELIVERABLES}
        </h4>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl text-sm border border-slate-100/50">
          {currentProject?.deliverables || DETAIL.SECTIONS?.DELIVERABLES_EMPTY}
        </p>
      </section>
    </div>
  );
}
