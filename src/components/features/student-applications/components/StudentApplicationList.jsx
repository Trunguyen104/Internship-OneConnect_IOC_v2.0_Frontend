import { App, Switch } from 'antd';
import dayjs from 'dayjs';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Info,
  TrendingUp,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

import Badge from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/emptystate';
import SearchBar from '@/components/ui/searchbar';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  APPLICATION_SOURCE,
  APPLICATION_STATUS,
} from '@/constants/applications/application.constants';

import {
  STUDENT_APPLICATION_STATUS_UI,
  TERMINAL_STATUSES,
} from '../constants/studentApplicationStatus';
import { STUDENT_APPLICATIONS_UI } from '../constants/uiText';
import { useMyApplications, useStudentApplicationActions } from '../hooks/useStudentApplications';
import StudentApplicationDetailModal from './StudentApplicationDetailModal';
import TableRowDropdown from './TableRowDropdown';

const StudentApplicationList = () => {
  const { modal } = App.useApp();
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    includeTerminal: false,
  });

  const { data: res, isLoading } = useMyApplications(filters);
  const applications = useMemo(() => res?.data?.items || res?.data || [], [res]);
  const handleViewDetail = (id) => {
    setSelectedAppId(id);
    setIsDetailOpen(true);
  };

  const applicationActions = {
    ...useStudentApplicationActions(),
    viewDetail: handleViewDetail,
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchTerm = filters.search.toLowerCase().trim();

      const matchesSearch =
        filters.search === '' ||
        app.jobTitle?.toLowerCase().includes(searchTerm) ||
        app.jobPostingTitle?.toLowerCase().includes(searchTerm) ||
        app.enterpriseName?.toLowerCase().includes(searchTerm) ||
        app.internPhaseName?.toLowerCase().includes(searchTerm) ||
        app.phaseName?.toLowerCase().includes(searchTerm);

      if (!filters.includeTerminal && TERMINAL_STATUSES.includes(app.status)) {
        return false;
      }

      return matchesSearch;
    });
  }, [applications, filters.search, filters.includeTerminal]);

  // Calculate statistics from the FULL list (before terminal filtering)
  const stats = useMemo(() => {
    return {
      total: applications.length,
      processing: applications.filter((app) =>
        [
          APPLICATION_STATUS.APPLIED,
          APPLICATION_STATUS.INTERVIEWING,
          APPLICATION_STATUS.OFFERED,
          APPLICATION_STATUS.PENDING_ASSIGNMENT,
        ].includes(app.status)
      ).length,
      placed: applications.filter((app) => app.status === APPLICATION_STATUS.PLACED).length,
      uniPending: applications.filter(
        (app) =>
          app.status === APPLICATION_STATUS.PENDING_ASSIGNMENT &&
          (app.source === APPLICATION_SOURCE.UNI_ASSIGN ||
            app.sourceLabel?.toLowerCase().includes('uni'))
      ).length,
    };
  }, [applications]);

  const renderApplicationRow = (app) => {
    const statusConfig = STUDENT_APPLICATION_STATUS_UI[app.status] || {
      variant: 'neutral',
      label: 'UNKNOWN',
    };

    return (
      <TableRow
        key={app.applicationId || app.id}
        className="group cursor-pointer border-slate-100/50 transition-all hover:bg-slate-50/80"
        onClick={() => handleViewDetail(app.applicationId)}
      >
        <TableCell className="py-6 pl-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm transition-transform group-hover:scale-105 group-hover:border-indigo-100 group-hover:shadow-md">
              {app.enterpriseLogoUrl || app.enterpriseLogo ? (
                <img
                  src={app.enterpriseLogoUrl || app.enterpriseLogo}
                  alt={app.enterpriseName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="size-6 text-slate-300" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-black tracking-tight text-slate-800 transition-colors">
                {app.jobTitle || app.jobPostingTitle || STUDENT_APPLICATIONS_UI.COMMON.GENERAL_APP}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <Building2 className="size-3" />
                {app.enterpriseName}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-black tracking-tight text-slate-700">
              {app.internPhaseName ||
                app.phaseName ||
                app.internshipPhaseName ||
                STUDENT_APPLICATIONS_UI.COMMON.N_A}
            </span>
            {(app.internPhaseStartDate || app.internPhaseEndDate) && (
              <span className="text-[11px] font-bold text-slate-400">
                {dayjs(app.internPhaseStartDate).format('DD/MM/YYYY')}
                <span className="mx-1 text-slate-300">
                  {STUDENT_APPLICATIONS_UI.COMMON.DATE_ARROW}
                </span>
                {dayjs(app.internPhaseEndDate).format('DD/MM/YYYY')}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col text-center">
            <span className="text-sm font-black text-slate-700">
              {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-GB')}
            </span>
            <span className="text-[11px] font-bold tracking-tight text-slate-400 uppercase">
              {new Date(app.appliedAt || app.createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <Badge
            variant={
              app.source === APPLICATION_SOURCE.UNI_ASSIGN ||
              app.sourceLabel?.toLowerCase().includes('uni')
                ? 'warning-soft'
                : 'info-soft'
            }
            className="px-3 py-1 text-[10px] font-black tracking-widest uppercase"
          >
            {app.sourceLabel || app.source || STUDENT_APPLICATIONS_UI.SOURCE.SELF_APPLY}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <StatusBadge
            variant={statusConfig.variant}
            className={statusConfig.className}
            showDot={statusConfig.showDot}
          >
            {statusConfig.label}
          </StatusBadge>
        </TableCell>
        <TableCell className="pr-6">
          <div className="flex justify-center">
            <TableRowDropdown application={app} handlers={applicationActions} modal={modal} />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Briefcase className="size-5" />}
          label={STUDENT_APPLICATIONS_UI.STATS.TOTAL}
          value={stats.total}
          variant="rose"
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label={STUDENT_APPLICATIONS_UI.STATS.PROCESSING}
          value={stats.processing}
          variant="indigo"
        />
        <StatCard
          icon={<CheckCircle2 className="size-5" />}
          label={STUDENT_APPLICATIONS_UI.STATS.PLACED}
          value={stats.placed}
          variant="emerald"
        />
        <StatCard
          icon={<GraduationCap className="size-5" />}
          label={STUDENT_APPLICATIONS_UI.STATS.UNI_PENDING}
          value={stats.uniPending}
          variant="amber"
        />
      </div>

      {/* Filters Section */}
      <div className="flex flex-col gap-6 rounded-4xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-2xl">
          <SearchBar
            placeholder={STUDENT_APPLICATIONS_UI.SEARCH_PLACEHOLDER}
            value={filters.search}
            onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
            width="w-full"
          />
        </div>
        <div className="flex items-center gap-6 px-6 py-1 sm:border-l sm:border-slate-100">
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              {STUDENT_APPLICATIONS_UI.INCLUDE_TERMINAL}
            </span>
            <span className="text-[10px] font-bold text-slate-300">
              {STUDENT_APPLICATIONS_UI.INCLUDE_TERMINAL_SUB}
            </span>
          </div>
          <Switch
            checked={filters.includeTerminal}
            onChange={(checked) => setFilters((prev) => ({ ...prev, includeTerminal: checked }))}
            className="h-6 w-11 transition-colors data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-slate-200"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/30">
            <TableRow className="border-slate-100/50 hover:bg-transparent">
              <TableHead className="h-16 pl-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center justify-start gap-3">
                  <Briefcase className="size-3.5" />
                  {STUDENT_APPLICATIONS_UI.COLUMNS.JOB_ENTERPRISE}
                </div>
              </TableHead>
              <TableHead className="h-16 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center justify-start gap-3">
                  <GraduationCap className="size-3" />
                  {STUDENT_APPLICATIONS_UI.COLUMNS.PHASE}
                </div>
              </TableHead>
              <TableHead className="h-16 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center justify-center gap-3">
                  <Calendar className="size-3.5" />
                  {STUDENT_APPLICATIONS_UI.COLUMNS.APPLIED_DATE}
                </div>
              </TableHead>
              <TableHead className="h-16 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center justify-center gap-3">
                  <Info className="size-3.5" />
                  {STUDENT_APPLICATIONS_UI.COLUMNS.SOURCE}
                </div>
              </TableHead>
              <TableHead className="h-16 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center justify-center gap-3">
                  <TrendingUp className="size-3.5" />
                  {STUDENT_APPLICATIONS_UI.COLUMNS.STATUS}
                </div>
              </TableHead>
              <TableHead className="h-16 w-[100px] text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex justify-center">{STUDENT_APPLICATIONS_UI.COLUMNS.ACTIONS}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="py-8">
                    <div className="space-y-3 px-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((app) => renderApplicationRow(app))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-[400px] border-none py-10 text-center">
                  <EmptyState
                    title={STUDENT_APPLICATIONS_UI.EMPTY_STATE.TITLE}
                    description={
                      filters.search
                        ? STUDENT_APPLICATIONS_UI.EMPTY_STATE.FILTERED_DESCRIPTION
                        : STUDENT_APPLICATIONS_UI.EMPTY_STATE.DESCRIPTION
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StudentApplicationDetailModal
        applicationId={selectedAppId}
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, variant }) => {
  const variants = {
    rose: 'bg-rose-50 text-rose-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
      <div className="flex items-center gap-5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${variants[variant]}`}
        >
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
      </div>
      <div
        className={`absolute bottom-0 right-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${
          variant === 'rose'
            ? 'bg-rose-500'
            : variant === 'indigo'
              ? 'bg-indigo-500'
              : variant === 'emerald'
                ? 'bg-emerald-500'
                : 'bg-amber-500'
        }`}
      />
    </div>
  );
};

export default StudentApplicationList;
