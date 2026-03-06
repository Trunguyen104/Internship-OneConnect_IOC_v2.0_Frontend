'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import SearchBar from '@/shared/components/SearchBar';
import Footer from '@/shared/components/Footer';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import Card from '@/shared/components/Card';
import StakeholderIssueService from '@/services/stakeholderIssue';
import { StakeholderService } from '@/services/stakeholder';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import { ISSUE_MESSAGES } from '@/constants/stakeholderIssue/messages';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useToast } from '@/providers/ToastProvider';
import { ProjectService } from '@/services/projectService';
export default function IssueTab() {
  const toast = useToast();
  const [projectId, setProjectId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [openIssueForm, setOpenIssueForm] = useState(false);

  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    stakeholderId: '',
  });

  const [issueDetail, setIssueDetail] = useState(null);

  const handleViewDetail = async (id) => {
    const res = await StakeholderIssueService.getById(id);
    setIssueDetail(res.data);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const tableBodyRef = useRef(null);

  useEffect(() => {
    tableBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);
  const handleSaveIssue = async () => {
    if (!issueForm.title?.trim() || !issueForm.stakeholderId || !issueForm.description?.trim()) {
      toast.warning(ISSUE_MESSAGES.REQUIRED_FIELDS.GENERAL);
      return;
    }

    try {
      await StakeholderIssueService.create({
        title: issueForm.title,
        description: issueForm.description,
        stakeholderId: issueForm.stakeholderId,
        projectId,
      });

      toast.success(ISSUE_MESSAGES.CREATE_SUCCESS);

      setOpenIssueForm(false);
      setIssueForm({ title: '', description: '', stakeholderId: '' });
      fetchIssues();
    } catch {
      toast.error(ISSUE_MESSAGES.CREATE_FAILED);
    }
  };
  const handleDelete = async (id) => {
    try {
      await StakeholderIssueService.delete(id);
      toast.success(ISSUE_MESSAGES.DELETE_SUCCESS);
      fetchIssues();
    } catch {
      toast.error(ISSUE_MESSAGES.DELETE_FAILED);
    }
  };

  const handleToggleStatus = async (issue) => {
    try {
      const newStatus =
        issue.status === ISSUE_UI.STATUS.RESOLVED ? 'Open' : ISSUE_UI.STATUS.RESOLVED;
      await StakeholderIssueService.updateStatus(issue.id, newStatus);

      toast.success(
        newStatus === ISSUE_UI.STATUS.RESOLVED ? ISSUE_MESSAGES.RESOLVED : ISSUE_MESSAGES.REOPENED,
      );

      fetchIssues();
    } catch {
      toast.error(ISSUE_MESSAGES.UPDATE_STATUS_FAILED);
    }
  };

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({
          PageNumber: 1,
          PageSize: 1,
        });

        if (res?.data?.items?.length > 0) {
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error(ISSUE_MESSAGES.LOAD_PROJECT_FAILED);
      }
    };

    fetchProjectId();
  }, [toast]);

  const fetchStakeholders = useCallback(async () => {
    if (!projectId) return;

    const res = await StakeholderService.getByProject(projectId);
    if (res?.data?.items) {
      setStakeholders(res.data.items);
    }
  }, [projectId]);

  const fetchIssues = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const params = {
        projectId,
        PageIndex: page,
        PageSize: pageSize,
        OrderBy: 'createdAt desc',
      };

      if (debouncedSearch) {
        params.Search = debouncedSearch;
      }

      const res = await StakeholderIssueService.getAll(params);

      if (res?.data?.items) {
        setIssues(res.data.items);
        setTotal(res.data.totalCount || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, page, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchStakeholders();
  }, [fetchStakeholders]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);
  return (
    <>
      <Card>
        <SearchBar
          placeholder={ISSUE_UI.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          showFilter
          showAction
          actionLabel={ISSUE_UI.ADD_BUTTON}
          onActionClick={() => setOpenIssueForm(true)}
        />

        <div className='flex-1 flex flex-col min-h-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-slate-400 border-r-2 border-r-transparent'></div>
            </div>
          ) : issues.length === 0 ? (
            <div className='flex-1 flex items-center justify-center'>
              <p className='text-slate-400'>{ISSUE_UI.EMPTY.NO_DATA}</p>
            </div>
          ) : (
            <div className='flex-1 flex flex-col min-h-0 mt-5'>
              <div className='flex-1 overflow-auto' ref={tableBodyRef}>
                <table className='w-full text-left border-collapse table-fixed min-w-[900px]'>
                  <thead className='bg-slate-50 sticky top-0 z-10 border-b border-slate-200'>
                    <tr>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500 w-[60px]'>
                        {ISSUE_UI.TABLE.NO}
                      </th>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                        {ISSUE_UI.TABLE.TITLE}
                      </th>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                        {ISSUE_UI.TABLE.STAKEHOLDER}
                      </th>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                        {ISSUE_UI.TABLE.DESCRIPTION}
                      </th>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                        {ISSUE_UI.TABLE.STATUS}
                      </th>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                        {ISSUE_UI.TABLE.CREATED_DATE}
                      </th>
                      <th className='px-6 py-4 text-xs font-semibold text-slate-500 text-right'>
                        {ISSUE_UI.TABLE.ACTIONS}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100'>
                    {issues.map((i, index) => (
                      <tr
                        key={i.id}
                        onClick={() => handleViewDetail(i.id)}
                        className='hover:bg-slate-50/80 transition-colors cursor-pointer'
                      >
                        <td className='px-6 py-4 text-sm text-slate-600'>
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        <td className='px-6 py-4 text-sm text-slate-600'>{i.title}</td>
                        <td className='px-6 py-4 text-sm text-slate-600 truncate'>
                          {stakeholders.find((s) => s.id === i.stakeholderId)?.name ||
                            ISSUE_UI.EMPTY.UNKNOWN}
                        </td>
                        <td className='px-6 py-4 text-sm text-slate-600'>
                          <div className='truncate max-w-[300px]' title={i.description}>
                            {i.description || '-'}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                              i.status === ISSUE_UI.STATUS.RESOLVED || i.status === 'Đã giải quyết'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}
                          >
                            {i.status === ISSUE_UI.STATUS.RESOLVED ||
                            i.status === 'Đã giải quyết' ? (
                              <CheckCircleOutlined />
                            ) : (
                              <SyncOutlined spin />
                            )}
                            {i.status || ISSUE_UI.STATUS.PROCESSING}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-slate-600'>
                          {dayjs(i.createdAt).format('DD/MM/YYYY')}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(i);
                              }}
                              className='text-slate-400 hover:text-blue-600 px-2'
                            >
                              {i.status === ISSUE_UI.STATUS.RESOLVED
                                ? ISSUE_UI.BUTTON.REOPEN
                                : ISSUE_UI.BUTTON.RESOLVE}
                            </button>
                            <Popconfirm
                              title={ISSUE_UI.BUTTON.DELETE}
                              onConfirm={(e) => {
                                e?.stopPropagation();
                                handleDelete(i.id);
                              }}
                            >
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className='text-slate-400 hover:text-red-600 px-2'
                              >
                                <DeleteOutlined />
                              </button>
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>
      {(total > 0 || page > 1) && (
        <div className='flex-none mt-5'>
          <Footer
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      )}
      {openIssueForm && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
          onClick={() => setOpenIssueForm(false)}
        >
          <div
            className='flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5'>
              <h2 className='text-lg font-semibold text-slate-800'>{ISSUE_UI.FORM.ADD_TITLE}</h2>
              <button
                onClick={() => setOpenIssueForm(false)}
                className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600'
              >
                <CloseOutlined />
              </button>
            </div>

            <div className='space-y-4 overflow-y-auto px-6 py-5'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {ISSUE_UI.TABLE.TITLE} <span className='text-red-500'>*</span>
                </label>
                <input
                  value={issueForm.title}
                  onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                  className='w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  placeholder={ISSUE_UI.FORM.TITLE_PLACEHOLDER}
                />
              </div>

              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {ISSUE_UI.TABLE.STAKEHOLDER} <span className='text-red-500'>*</span>
                </label>
                <select
                  value={issueForm.stakeholderId}
                  onChange={(e) => setIssueForm({ ...issueForm, stakeholderId: e.target.value })}
                  className='w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>{ISSUE_UI.FORM.STAKEHOLDER_PLACEHOLDER}</option>
                  {stakeholders.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                  {ISSUE_UI.TABLE.DESCRIPTION}
                </label>
                <textarea
                  rows={3}
                  value={issueForm.description}
                  onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                  className='w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  placeholder={ISSUE_UI.FORM.DESCRIPTION_PLACEHOLDER}
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4'>
              <button
                onClick={() => setOpenIssueForm(false)}
                className='rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-600'
              >
                {ISSUE_UI.BUTTON.CANCEL}
              </button>
              <button
                onClick={handleSaveIssue}
                className='rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm'
              >
                {ISSUE_UI.BUTTON.SAVE}
              </button>
            </div>
          </div>
        </div>
      )}
      {issueDetail && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-[520px] rounded-3xl bg-white shadow-2xl overflow-hidden'>
            <div className='flex items-center justify-between border-b px-6 py-4'>
              <h2 className='text-lg font-semibold'>{ISSUE_UI.DETAIL.TITLE}</h2>
              <button
                onClick={() => setIssueDetail(null)}
                className='rounded-full p-2 hover:bg-slate-100'
              >
                <CloseOutlined />
              </button>
            </div>

            <div className='space-y-4 px-6 py-5 text-sm'>
              <div>
                <p className='text-slate-500'>{ISSUE_UI.TABLE.TITLE}</p>
                <p className='font-medium'>{issueDetail.title}</p>
              </div>

              <div>
                <p className='text-slate-500'>{ISSUE_UI.TABLE.DESCRIPTION}</p>
                <p>{issueDetail.description || '-'}</p>
              </div>

              <div>
                <p className='text-slate-500'>{ISSUE_UI.TABLE.STAKEHOLDER}</p>
                <p>{issueDetail.stakeholderName || '-'}</p>
              </div>

              <div>
                <p className='text-slate-500'>{ISSUE_UI.TABLE.STATUS}</p>
                <p>{issueDetail.status}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-slate-500'>{ISSUE_UI.DETAIL.CREATED_AT}</p>
                  <p>{dayjs(issueDetail.createdAt).format('DD/MM/YYYY')}</p>
                </div>

                <div>
                  <p className='text-slate-500'>{ISSUE_UI.DETAIL.RESOLVED_AT}</p>
                  <p>
                    {issueDetail.resolvedAt
                      ? dayjs(issueDetail.resolvedAt).format('DD/MM/YYYY')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
