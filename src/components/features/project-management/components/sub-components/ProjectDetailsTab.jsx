'use client';

import { ArrowRightOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Tag } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';

export default function ProjectDetailsTab({ currentProject, DETAIL, FORM, PROJECT_STATUS, isHR }) {
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

      <div className="flex flex-wrap gap-x-8 gap-y-6 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
        <section className="min-w-[120px]">
          <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
            {DETAIL.SECTIONS?.MENTOR}
          </h4>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              src={currentProject?.mentorAvatar}
              icon={<UserOutlined />}
              className="bg-primary/10 text-primary border-none"
            />
            <span className="text-sm font-bold text-slate-700">
              {currentProject?.mentorName || currentProject?.groupInfo?.mentorName || 'N/A'}
            </span>
          </div>
        </section>
        <section className="min-w-[140px]">
          <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
            {DETAIL.SECTIONS?.FIELD_TEMPLATE}
          </h4>
          <div className="flex flex-col gap-1">
            <Tag
              color="blue"
              className="w-fit m-0 border-none font-bold text-[10px] rounded-md px-2"
            >
              {currentProject?.field || 'N/A'}
            </Tag>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              Template:{' '}
              <span className="text-primary font-bold">
                {FORM?.TEMPLATE_LABELS?.[currentProject?.template] || 'None'}
              </span>
            </span>
          </div>
        </section>
        <section className="min-w-[180px]">
          <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
            {DETAIL.SECTIONS?.TIMELINE}
          </h4>
          <div className="text-sm font-bold text-slate-700 flex items-center whitespace-nowrap">
            {currentProject?.startDate
              ? dayjs(currentProject.startDate).format('DD/MM/YYYY')
              : 'TBA'}
            <ArrowRightOutlined className="mx-2 text-[10px] text-slate-300" />
            {currentProject?.endDate ? dayjs(currentProject.endDate).format('DD/MM/YYYY') : 'TBA'}
          </div>
        </section>
      </div>

      <Divider className="my-2 opacity-50" />

      <section>
        <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.GROUP_INFO}
        </h4>
        {currentProject?.groupInfo?.groupName ||
        currentProject?.groupName ||
        currentProject?.internshipGroup?.groupName ? (
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div>
                <div className="text-lg font-bold text-slate-800">
                  {currentProject?.groupInfo?.groupName ||
                    currentProject.groupName ||
                    currentProject.internshipGroup?.groupName}
                </div>
                <div className="text-[9px] text-slate-400 mt-1 font-mono uppercase tracking-widest font-bold">
                  {DETAIL.GROUP?.ID}:{' '}
                  {currentProject.groupInfo?.internshipId || currentProject.internshipId || 'N/A'}
                </div>
              </div>
              {isHR && (currentProject.internshipId || currentProject.groupInfo?.internshipId) && (
                <Link
                  href={`/internship-groups/${currentProject.groupInfo?.internshipId || currentProject.internshipId}`}
                  className="text-[10px] bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm active:scale-95 uppercase tracking-wide"
                >
                  <ArrowRightOutlined className="rotate-180" /> {DETAIL.GROUP?.MANAGE_LINK}
                </Link>
              )}
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
                      'N/A'}
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
          <div className="flex flex-col gap-1 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <ExclamationCircleOutlined />
              {currentProject?.status === PROJECT_STATUS.DRAFT
                ? DETAIL.GROUP?.NOT_ASSIGNED
                : DETAIL.GROUP?.DELETED}
            </div>
            <span className="text-[11px] text-red-400 font-medium">
              {currentProject?.status === PROJECT_STATUS.DRAFT
                ? DETAIL.GROUP?.NOT_ASSIGNED_HINT
                : DETAIL.GROUP?.DELETED_HINT}
            </span>
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
