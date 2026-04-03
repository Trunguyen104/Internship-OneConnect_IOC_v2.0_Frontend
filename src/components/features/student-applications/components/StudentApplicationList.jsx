import { App, Switch } from 'antd';
import { Building2, Eye, Search } from 'lucide-react';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/emptystate';
import { Input } from '@/components/ui/input';
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
import TableRowDropdown from '@/components/ui/TableRowActions';
import {
  APPLICATION_SOURCE,
  APPLICATION_STATUS,
} from '@/constants/applications/application.constants';
import { cn } from '@/lib/cn';

import { STUDENT_APPLICATION_STATUS_UI } from '../constants/studentApplicationStatus';
import { STUDENT_APPLICATIONS_UI } from '../constants/uiText';
import { useMyApplications, useStudentApplicationActions } from '../hooks/useStudentApplications';
import StudentApplicationDetailModal from './StudentApplicationDetailModal';

const StudentApplicationList = () => {
  const { modal: modalApi } = App.useApp();
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    includeTerminal: false,
    page: 1,
    size: 10,
  });

  const { data: res, isLoading, error } = useMyApplications(filters);
  const applications = res?.data?.items || res?.data || [];

  const handleViewDetail = (id) => {
    setSelectedAppId(id);
    setIsDetailOpen(true);
  };

  if (error)
    return (
      <div className="p-8 text-center text-rose-500">
        {STUDENT_APPLICATIONS_UI.COMMON.ERROR} {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex min-w-[300px] flex-1 items-center gap-3">
          <Input
            placeholder={STUDENT_APPLICATIONS_UI.SEARCH_PLACEHOLDER}
            prefix={<Search className="size-4 text-slate-400" />}
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            className="h-11 rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 pr-2">
          <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
            {STUDENT_APPLICATIONS_UI.INCLUDE_TERMINAL}
          </span>
          <Switch
            checked={filters.includeTerminal}
            onChange={(checked) => setFilters((f) => ({ ...f, includeTerminal: checked, page: 1 }))}
            className={filters.includeTerminal ? 'bg-primary!' : 'bg-slate-300!'}
          />
        </div>
      </div>

      {/* Applications Card */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="h-14 font-black uppercase tracking-widest text-slate-400">
                {STUDENT_APPLICATIONS_UI.COLUMNS.JOB_ENTERPRISE}
              </TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-slate-400">
                {STUDENT_APPLICATIONS_UI.COLUMNS.APPLIED_DATE}
              </TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-slate-400">
                {STUDENT_APPLICATIONS_UI.COLUMNS.SOURCE}
              </TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-slate-400">
                {STUDENT_APPLICATIONS_UI.COLUMNS.STATUS}
              </TableHead>
              <TableHead className="h-14 text-center font-black uppercase tracking-widest text-slate-400">
                {STUDENT_APPLICATIONS_UI.COLUMNS.ACTIONS}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-8">
                    <div className="space-y-3 px-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <EmptyState
                    title={STUDENT_APPLICATIONS_UI.EMPTY_STATE.TITLE}
                    description={
                      filters.search || filters.includeTerminal
                        ? STUDENT_APPLICATIONS_UI.EMPTY_STATE.FILTERED_DESCRIPTION
                        : STUDENT_APPLICATIONS_UI.EMPTY_STATE.DESCRIPTION
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <ApplicationRow
                  key={app.id || app.applicationId}
                  app={app}
                  modalApi={modalApi}
                  onViewDetail={handleViewDetail}
                />
              ))
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

const ApplicationRow = ({ app, modalApi, onViewDetail }) => {
  const { withdraw, hide, isWithdrawing, isHiding } = useStudentApplicationActions(
    app.id || app.applicationId
  );

  const isUniAssign =
    app.source === APPLICATION_SOURCE.UNI_ASSIGN || app.source === 'UNI_ASSIGN' || app.isUniAssign;
  const statusUI = { ...(STUDENT_APPLICATION_STATUS_UI[app.status] || {}) };

  // Resolve dynamic label for PENDING_ASSIGNMENT (AC Logic fix)
  if (app.status === APPLICATION_STATUS.PENDING_ASSIGNMENT) {
    statusUI.label = isUniAssign
      ? STUDENT_APPLICATIONS_UI.STATUS_LABELS.UNI_ASSIGNED
      : STUDENT_APPLICATIONS_UI.STATUS_LABELS.PENDING_REVIEW;
  }

  if (!statusUI.label) {
    statusUI.label = STUDENT_APPLICATIONS_UI.COMMON.UNKNOWN;
    statusUI.variant = 'neutral';
  }

  const onWithdrawClick = () => {
    modalApi.confirm({
      title: (
        <span className="text-lg font-black tracking-tight text-slate-800">
          {STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW_TITLE}
        </span>
      ),
      content: (
        <p className="mt-2 font-medium text-slate-500">
          {STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW_CONTENT.replace(
            '{enterpriseName}',
            app.enterpriseName
          )}
        </p>
      ),
      okText: STUDENT_APPLICATIONS_UI.MODAL.WITHDRAW,
      okType: 'danger',
      cancelText: STUDENT_APPLICATIONS_UI.MODAL.CANCEL,
      centered: true,
      onOk: () => withdraw(),
      okButtonProps: { loading: isWithdrawing },
    });
  };

  const onHideClick = () => {
    modalApi.confirm({
      title: (
        <span className="text-lg font-black tracking-tight text-slate-800">
          {STUDENT_APPLICATIONS_UI.MODAL.HIDE_TITLE}
        </span>
      ),
      content: (
        <p className="mt-2 font-medium text-slate-500">
          {STUDENT_APPLICATIONS_UI.MODAL.HIDE_CONTENT}
        </p>
      ),
      okText: STUDENT_APPLICATIONS_UI.MODAL.HIDE,
      cancelText: STUDENT_APPLICATIONS_UI.MODAL.CANCEL,
      centered: true,
      onOk: () => hide(),
      okButtonProps: { loading: isHiding },
    });
  };

  const menuItems = [
    {
      key: 'view',
      label: STUDENT_APPLICATIONS_UI.ACTIONS.VIEW_DETAILS,
      icon: <Eye className="size-4" />,
      onClick: () => onViewDetail(app.applicationId),
    },
    ...(app.status === APPLICATION_STATUS.APPLIED && !isUniAssign
      ? [
          {
            key: 'withdraw',
            label: STUDENT_APPLICATIONS_UI.ACTIONS.WITHDRAW,
            onClick: onWithdrawClick,
            danger: true,
          },
        ]
      : []),
    ...(app.status === APPLICATION_STATUS.REJECTED || app.status === APPLICATION_STATUS.WITHDRAWN
      ? [
          {
            key: 'hide',
            label: STUDENT_APPLICATIONS_UI.ACTIONS.HIDE,
            onClick: onHideClick,
          },
        ]
      : []),
  ];

  return (
    <TableRow className="group border-slate-100 transition-colors hover:bg-slate-50/50">
      <TableCell className="py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm">
            {app.enterpriseLogo ? (
              <img
                src={app.enterpriseLogo}
                alt={app.enterpriseName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="size-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800">
              {app.jobPostingTitle || STUDENT_APPLICATIONS_UI.COMMON.GENERAL_APP}
            </span>
            <span className="text-xs font-bold text-slate-400">{app.enterpriseName}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm font-bold text-slate-600">
          {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-GB')}
        </span>
      </TableCell>
      <TableCell>
        <Badge
          variant={isUniAssign ? 'warning-soft' : 'info-soft'}
          className={cn(
            'text-[10px] font-black uppercase tracking-widest',
            isUniAssign && 'border-indigo-200 bg-indigo-50 text-indigo-700'
          )}
        >
          {isUniAssign
            ? STUDENT_APPLICATIONS_UI.SOURCE.UNI_ASSIGN
            : STUDENT_APPLICATIONS_UI.SOURCE.SELF_APPLY}
        </Badge>
      </TableCell>
      <TableCell>
        <StatusBadge
          variant={statusUI.variant}
          label={statusUI.label}
          showDot={statusUI.showDot}
          className={cn('font-bold', statusUI.className)}
        />
      </TableCell>
      <TableCell className="text-center">
        {menuItems.length > 0 ? (
          <TableRowDropdown items={menuItems} />
        ) : (
          <span className="text-xs font-bold text-slate-300">
            {STUDENT_APPLICATIONS_UI.ACTIONS.NO_ACTIONS}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default StudentApplicationList;
