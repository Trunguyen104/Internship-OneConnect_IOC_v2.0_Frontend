'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import SearchBar from '@/shared/components/SearchBar';
import Card from '@/shared/components/Card';
import TiptapEditor from '@/shared/components/TiptapEditor';
import Footer from '@/shared/components/Footer';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import StakeholderIssueService from '@/services/stakeholderIssue';
import { Trash, CheckCircle, XCircle } from 'lucide-react';
import { StakeholderService } from '@/services/stakeholder';

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [openStakeholderForm, setOpenStakeholderForm] = useState(false);
  const [openIssueForm, setOpenIssueForm] = useState(false);

  const [issueForm, setIssueForm] = useState({
    stakeholderId: '',
    title: '',
    description: '',
    status: 'Đang xử lý',
  });

  const tableBodyRef = useRef(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderLoading, setStakeholderLoading] = useState(false);

  const fetchStakeholders = useCallback(async () => {
    if (tab !== 'stakeholder') return;

    try {
      setStakeholderLoading(true);

      const projectId = '9ec2c408-861c-4236-b1de-e338adff8cbb';

      const params = {
        PageNumber: page,
        PageSize: pageSize,
      };

      if (debouncedSearch?.trim()) {
        params.SearchTerm = debouncedSearch.trim();
      }

      const res = await StakeholderService.getByProject(projectId, params);
      console.log('STAKEHOLDER RES:', res);

      if (res && res.data && Array.isArray(res.data.items)) {
        setStakeholders(res.data.items);
        setTotal(res.data.totalCount || res.data.items.length || 0);
      }
    } catch {
      message.error('Failed to load stakeholders');
    } finally {
      setStakeholderLoading(false);
    }
  }, [tab, page, pageSize, debouncedSearch]);

  useEffect(() => {
    if (tab === 'stakeholder') {
      fetchStakeholders();
    }
  }, [fetchStakeholders, tab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchIssues = useCallback(async () => {
    if (tab !== 'issue') return;

    try {
      setLoading(true);
      const params = {
        PageNumber: page,
        PageSize: pageSize,
        SearchTerm: debouncedSearch || undefined,
      };
      if (debouncedSearch) {
        params.Search = debouncedSearch;
      }

      const res = await StakeholderIssueService.getAll(params);

      if (res?.isSuccess) {
        setIssues(res.data?.items || []);
        setTotal(res.data?.totalCount || 0);
      }
    } catch {
      message.error('Failed to load issues.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, tab]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    tableBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

  const handleSortDate = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const totalPages = Math.ceil(total / pageSize);

  const handleSaveIssue = async () => {
    try {
      if (!issueForm.title || !issueForm.stakeholderId) {
        message.warning('Bạn cần nhập Title và Stakeholder ID');
        return;
      }
      const payload = {
        title: issueForm.title,
        description: issueForm.description || '',
        stakeholderId: issueForm.stakeholderId,
      };

      const res = await StakeholderIssueService.create(payload);
      if (res?.isSuccess) {
        message.success('Created successfully');
        setOpenIssueForm(false);
        setIssueForm({ stakeholderId: '', title: '', description: '', status: 'Đang xử lý' });
        fetchIssues();
      } else {
        message.error(res?.message || 'Failed to create issue');
      }
    } catch {
      message.error('Error creating issue');
    }
  };

  const handleDeleteIssue = (id) => {
    Modal.confirm({
      title: 'Delete Issue',
      content: 'Are you sure you want to delete this issue?',
      okText: 'Delete',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await StakeholderIssueService.delete(id);
          if (res?.isSuccess) {
            fetchIssues();
          }
        } catch {
          message.error('Failed to delete issue');
        }
      },
    });
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Đã giải quyết' ? 'Đang xử lý' : 'Đã giải quyết';
      const res = await StakeholderIssueService.updateStatus(id, newStatus);
      if (res?.isSuccess) {
        fetchIssues();
      }
    } catch {
      message.error('Failed to update status');
    }
  };

  return (
    <section className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setTab('stakeholder')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border cursor-pointer ${
            tab === 'stakeholder'
              ? 'border-primary bg-red-50 text-primary'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stakeholder
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border cursor-pointer ${
            tab === 'issue'
              ? 'border-primary bg-red-50 text-primary'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Issue
        </button>
      </div>

      <div>
        {tab === 'stakeholder' && (
          <>
            <div className='flex flex-col p-3 sm:flex-row sm:items-center sm:justify-between'>
              <SearchBar
                placeholder='Search stakeholder...'
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                showFilter
                showAction
                actionLabel='Add stakeholder'
                onActionClick={() => setOpenStakeholderForm(true)}
              />
            </div>

            <div className='px-6 pb-10 pt-4'>
              {stakeholderLoading ? (
                <p className='text-sm text-slate-400'>Loading...</p>
              ) : stakeholders.length === 0 ? (
                <p className='text-sm text-slate-500'>No stakeholder found.</p>
              ) : (
                <ul className='space-y-2'>
                  {stakeholders.map((s) => (
                    <li
                      key={s.id}
                      className='flex items-center justify-between rounded-2xl border bg-white px-5 py-4
                 hover:bg-slate-50 hover:shadow-sm transition-all'
                    >
                      {/* LEFT */}
                      <div className='min-w-0'>
                        <p className='font-semibold text-slate-800 truncate'>{s.name}</p>

                        <div className='mt-1 flex items-center gap-2 text-xs text-slate-500'>
                          <span>{s.role || 'No role'}</span>
                          <span className='text-slate-300'>•</span>
                          <span className='truncate'>{s.email}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {tab === 'issue' && (
          <>
            <Card>
              <div className='flex flex-col p-2 mb-5 sm:flex-row sm:items-center sm:justify-between'>
                <SearchBar
                  placeholder='Search issue...'
                  value={search}
                  onChange={(val) => {
                    setSearch(val);
                    setPage(1);
                  }}
                  showFilter
                  showAction
                  actionLabel='Add issue'
                  onActionClick={() => setOpenIssueForm(true)}
                />
              </div>

              <div className='overflow-auto max-h-96 border-t border-slate-200' ref={tableBodyRef}>
                <table className='w-full text-left table-fixed min-w-[900px]'>
                  <thead className='border-b border-slate-300 text-xs text-slate-400 bg-slate-50 sticky top-0 z-10'>
                    <tr>
                      <th className='px-6 py-3 w-[250px]'>Title</th>
                      <th className='px-6 py-3 w-[200px]'>Stakeholder</th>
                      <th className='px-6 py-3 w-[150px]'>Status</th>
                      <th
                        className='px-6 py-3 w-[150px] cursor-pointer hover:bg-slate-100 transition-colors'
                        onClick={handleSortDate}
                      >
                        <div className='flex items-center gap-1'>
                          <span>Created Date</span>
                          <div className='flex flex-col text-[8px] leading-none shrink-0'>
                            <CaretUpOutlined
                              className={sortOrder === 'asc' ? 'text-blue-600' : 'text-slate-300'}
                            />
                            <CaretDownOutlined
                              className={sortOrder === 'desc' ? 'text-blue-600' : 'text-slate-300'}
                            />
                          </div>
                        </div>
                      </th>
                      <th className='px-6 py-3 w-[120px] text-center'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-200 text-sm text-slate-800 bg-white'>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className='px-6 py-10 text-center text-sm text-slate-400'>
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      issues.map((i) => (
                        <tr key={i.id} className='hover:bg-slate-50 transition-colors'>
                          <td
                            className='px-6 py-4 font-medium truncate overflow-hidden'
                            title={i.title}
                          >
                            {i.title}
                          </td>

                          <td
                            className='px-6 py-4 truncate overflow-hidden text-slate-600'
                            title={i.stakeholderName || i.stakeholderId}
                          >
                            {i.stakeholderName || i.stakeholderId || 'N/A'}
                          </td>

                          <td className='px-6 py-4'>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                                i.status === 'Đã giải quyết'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {i.status || 'Đang xử lý'}
                            </span>
                          </td>

                          <td className='px-6 py-4 text-slate-500 whitespace-nowrap'>
                            {i.createdAt ? dayjs(i.createdAt).format('DD/MM/YYYY HH:mm') : ''}
                          </td>

                          <td className='px-6 py-4'>
                            <div className='flex items-center justify-center gap-2'>
                              <button
                                onClick={() => handleUpdateStatus(i.id, i.status)}
                                className='p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                                title='Toggle Status'
                              >
                                {i.status === 'Đã giải quyết' ? (
                                  <XCircle size={18} />
                                ) : (
                                  <CheckCircle size={18} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteIssue(i.id)}
                                className='p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                title='Delete'
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}

                    {!loading && issues.length === 0 && (
                      <tr>
                        <td colSpan={5} className='px-6 py-10 text-center text-sm text-slate-400'>
                          No issue found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {(total > 0 || page > 1) && (
              <div className='mt-5'>
                <Footer
                  total={total || 0}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages || 1}
                  onPageChange={setPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {openStakeholderForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-[500px] rounded-3xl shadow-xl overflow-hidden'>
            <div className='px-6 py-4 border-b'>
              <h2 className='text-xl font-semibold text-center'>Add new stakeholder</h2>
            </div>
            <div className='max-h-[65vh] overflow-y-auto px-6 py-4 space-y-4'>
              <p className='text-sm text-slate-500 text-center'>Not implemented in this task.</p>
            </div>
            <div className='px-6 py-4 border-t flex justify-end gap-3'>
              <button
                onClick={() => setOpenStakeholderForm(false)}
                className='px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openIssueForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-[720px] rounded-3xl shadow-xl overflow-hidden'>
            <div className='px-6 py-4 border-b'>
              <h2 className='text-xl font-semibold text-center'>Add new issue</h2>
            </div>

            <div className='max-h-[70vh] overflow-y-auto px-6 py-4 space-y-5'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>
                  Stakeholder ID (UUID) <span className='text-red-500'>*</span>
                </label>
                <input
                  value={issueForm.stakeholderId}
                  onChange={(e) => setIssueForm({ ...issueForm, stakeholderId: e.target.value })}
                  placeholder='e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6'
                  className='w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>
                  Title <span className='text-red-500'>*</span>
                </label>
                <input
                  value={issueForm.title}
                  onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                  placeholder='Issue Title'
                  className='w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Description</label>
                <div className='border border-slate-300 rounded-2xl overflow-hidden'>
                  <TiptapEditor
                    value={issueForm.description}
                    onChange={(html) => setIssueForm((prev) => ({ ...prev, description: html }))}
                  />
                </div>
              </div>
            </div>

            <div className='px-6 py-4 border-t flex justify-end gap-3'>
              <button
                onClick={() => setOpenIssueForm(false)}
                className='px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm'
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIssue}
                className='px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
