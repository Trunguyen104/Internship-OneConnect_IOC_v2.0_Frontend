'use client';

import { useEffect, useState, useRef } from 'react';
import SearchBar from '@/shared/components/SearchBar';
import Card from '@/shared/components/Card';
import TiptapEditor from '@/shared/components/TiptapEditor';
import Footer from '@/shared/components/Footer';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const ISSUE_DATA = [
  {
    id: 1,
    title: 'Thiếu tài liệu hướng dẫn',
    stakeholder: 'Doanh nghiệp A',
    status: 'Đang xử lý',
    createdAt: '01/02/2026',
  },
  {
    id: 2,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 3,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 4,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    creatdAt: '28/01/2026',
  },
  {
    id: 5,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 6,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 7,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 8,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 9,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 10,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 11,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 12,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
  {
    id: 13,
    title: 'Chậm phản hồi email',
    stakeholder: 'Mentor',
    status: 'Đã giải quyết',
    createdAt: '28/01/2026',
  },
];

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [openStakeholderForm, setOpenStakeholderForm] = useState(false);
  const [openIssueForm, setOpenIssueForm] = useState(false);

  const [issueForm, setIssueForm] = useState({
    stakeholderId: '',
    title: '',
    description: '',
    status: 'Đang xử lý',
  });

  const filteredIssueData = ISSUE_DATA.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.stakeholder.toLowerCase().includes(search.toLowerCase()),
  );
  const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime() || 0;
  };
  const sortedData = [...filteredIssueData].sort((a, b) => {
    const timeA = parseDate(a.createdAt);
    const timeB = parseDate(b.createdAt);
    if (timeA === timeB) return b.id - a.id;
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });
  const total = sortedData.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);
  const handleSortDate = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search]);

  const tableBodyRef = useRef(null);

  useEffect(() => {
    tableBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageSize]);

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
                onChange={setSearch}
                showFilter
                showAction
                actionLabel='Add stakeholder'
                onActionClick={() => setOpenStakeholderForm(true)}
              />
            </div>

            <div className='px-6 pb-10 pt-4'>
              <p className='text-sm text-slate-500'>No stakeholder found.</p>
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
                  onChange={setSearch}
                  showFilter
                  showAction
                  actionLabel='Add issue'
                  onActionClick={() => setOpenIssueForm(true)}
                />
              </div>

              <div className='overflow-auto max-h-96 border-t border-slate-200' ref={tableBodyRef}>
                <table className='w-full text-left table-fixed'>
                  <thead className='border-b border-slate-300 text-xs text-slate-400 bg-slate-50 sticky top-0 z-10'>
                    <tr>
                      <th className='px-6 py-3 w-[300px]'>Title</th>
                      <th className='px-6 py-3 w-[180px]'>Stakeholder</th>
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
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-200 text-sm text-slate-800 bg-white'>
                    {paginatedData.map((i) => (
                      <tr key={i.id} className='hover:bg-slate-50 transition-colors'>
                        <td
                          className='px-6 py-4 font-medium truncate overflow-hidden'
                          title={i.title}
                        >
                          {i.title}
                        </td>

                        <td
                          className='px-6 py-4 truncate overflow-hidden text-slate-600'
                          title={i.stakeholder}
                        >
                          {i.stakeholder}
                        </td>

                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                              i.status === 'Đã giải quyết'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {i.status}
                          </span>
                        </td>

                        <td className='px-6 py-4 text-slate-500 whitespace-nowrap'>
                          {i.createdAt}
                        </td>
                      </tr>
                    ))}

                    {filteredIssueData.length === 0 && (
                      <tr>
                        <td colSpan={4} className='px-6 py-10 text-center text-sm text-slate-400'>
                          No issue found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className='mt-5'>
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
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Type</label>
                <select className='w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:outline-none'>
                  <option>Select type</option>
                  <option>Personal</option>
                  <option>Organization</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>
                  Name <span className='text-red-500'>*</span>
                </label>
                <input
                  placeholder='VD: Lê Duy Khánh'
                  className='w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Role</label>
                <input
                  placeholder='VD: Mentor, HR, ...'
                  className='w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Description</label>
                <textarea className='w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm min-h-[90px]' />
              </div>
            </div>

            <div className='px-6 py-4 border-t flex justify-end gap-3'>
              <button
                onClick={() => setOpenStakeholderForm(false)}
                className='px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm'
              >
                Cancel
              </button>
              <button className='px-6 py-2 rounded-full bg-(--primary-600) text-white text-sm font-medium'>
                Create stakeholder
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
                <label className='block text-sm font-medium text-slate-700 mb-1'>Stakeholder</label>
                <select className='w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm'>
                  <option>Select stakeholder</option>
                  <option>Mentor</option>
                  <option>Enterprise A</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Title</label>
                <input
                  value={issueForm.title}
                  onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
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
              <button className='px-6 py-2 rounded-full bg-(--primary-600) text-white text-sm font-medium'>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
