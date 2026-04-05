'use client';

import { CalendarOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Card, Select, Space, Spin } from 'antd';
import React, { useState } from 'react';

import StudentInternshipTable from '@/components/features/internship-placement/components/StudentInternshipTable';
import { TermService } from '@/components/features/internship-term-management/services/term.service';
import SchoolTopNav from '@/components/layout/SchoolTopNav';
import {
  PLACEMENT_UI_TEXT,
  SEMESTER_STATUS,
} from '@/constants/internship-placement/placement.constants';

export default function PlacementPage() {
  const [selectedTermId, setSelectedTermId] = useState(undefined);
  const UI = PLACEMENT_UI_TEXT.PAGE;

  // Fetch all terms to let Admin select which one to manage placements for
  const { data: termsRes, isLoading: isLoadingTerms } = useQuery({
    queryKey: ['school-terms'],
    queryFn: () => TermService.getAll({ PageSize: 100 }),
  });

  const terms = termsRes?.data?.items || termsRes?.items || [];

  // Determine which term to display (default to active term if none selected)
  const defaultTermId =
    terms.length > 0
      ? (terms.find((t) => t.status === SEMESTER_STATUS.ACTIVE) || terms[0]).id
      : undefined;

  const currentTermId = selectedTermId || defaultTermId;
  const currentTerm = terms.find((t) => t.id === currentTermId);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <SchoolTopNav />

      <main className="flex-1 overflow-auto p-4 2xl:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{UI.TITLE}</h1>
              <p className="text-sm text-slate-500">{UI.SUBTITLE}</p>
            </div>

            <Card size="small" className="shadow-sm border-slate-200 min-w-[280px]">
              <Space orientation="vertical" size={2} className="w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {UI.TERM_LABEL}
                </span>
                <Select
                  className="w-full"
                  placeholder={UI.SELECT_TERM_PLACEHOLDER}
                  loading={isLoadingTerms}
                  value={currentTermId}
                  onChange={setSelectedTermId}
                  suffixIcon={<CalendarOutlined className="text-slate-400" />}
                >
                  {terms.map((term) => (
                    <Select.Option key={term.id} value={term.id}>
                      {term.name} {term.status === SEMESTER_STATUS.ACTIVE && UI.ACTIVE_SUFFIX}
                    </Select.Option>
                  ))}
                </Select>
              </Space>
            </Card>
          </div>

          {/* Content Section */}
          <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
            {currentTermId ? (
              <StudentInternshipTable
                semesterId={currentTermId}
                semesterStatus={currentTerm?.status}
              />
            ) : (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Spin size="large" />
                <span className="text-slate-400 animate-pulse">{UI.INITIALIZING}</span>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
