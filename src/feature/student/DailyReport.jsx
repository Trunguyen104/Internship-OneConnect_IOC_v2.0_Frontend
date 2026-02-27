'use client';

import Card from '@/shared/components/Card';
import SearchBar from '@/shared/components/SearchBar';
import { useState, useEffect, useRef } from 'react';
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Footer from '@/shared/components/Footer';

const DATA = [
  {
    id: 1,
    date: '27/02/2026 - 01:48:28',
    student: 'Lê Duy Khánhhhhhhhhhhhhhhhhhh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    submitStatus: 'Đã nộp',
  },
  {
    id: 2,
    date: '27/02/2026 - 01:32:17',
    student: 'Trần Gia Đạt',
    status: 'Hoàn thành',
    summary: 'Sửa UI dashboard',
    issue: 'Chỉnh responsive',
    submitStatus: 'Chưa nộp',
  },
  {
    id: 3,
    date: '26/02/2026 - 03:28:17',
    student: 'Nguyễn Văn A',
    status: 'Đang làm',
    summary: 'Viết API login',
    issue: 'Backend task',
    submitStatus: 'Đã nộp',
  },
  {
    id: 4,
    date: '26/02/2026 - 02:58:45',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    submitStatus: 'Đã nộp',
  },
  {
    id: 5,
    date: '26/02/2026 - 02:05:54',
    student: 'Phạm Thị B',
    status: 'Hoàn thành',
    summary: 'Thiết kế database',
    issue: 'DB design',
    submitStatus: 'Đã nộp',
  },
  {
    id: 6,
    date: '26/02/2026 - 02:03:04',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Cài đặt môi trường',
    issue: 'Setup project',
    submitStatus: 'Chưa nộp',
  },
  {
    id: 7,
    date: '24/01/2026 - 09:15:22',
    student: 'Trần C',
    status: 'Đang làm',
    summary: 'Test component',
    issue: 'Unit test',
    submitStatus: 'Đã nộp',
  },
  {
    id: 8,
    date: '23/01/2026 - 10:45:10',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện UI',
    issue: 'UI fix',
    submitStatus: 'Đã nộp',
  },
  {
    id: 9,
    date: '22/01/2026 - 08:20:05',
    student: 'Nguyễn D',
    status: 'Hoàn thành',
    summary: 'Deploy staging',
    issue: 'Devops',
    submitStatus: 'Đã nộp',
  },
  {
    id: 10,
    date: '21/01/2026 - 14:30:55',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Fix bug login',
    issue: 'Bug fix',
    submitStatus: 'Đã nộp',
  },
  {
    id: 11,
    date: '20/01/2026 - 16:12:40',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Họp team',
    issue: 'Meeting',
    submitStatus: 'Đã nộp',
  },
  {
    id: 12,
    date: '19/01/2026 - 11:05:18',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Research tech stack',
    issue: 'Research',
    submitStatus: 'Đã nộp',
  },
  {
    id: 13,
    date: '18/01/2026 - 09:40:33',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Code review',
    issue: 'Review',
    submitStatus: 'Đã nộp',
  },
  {
    id: 14,
    date: '17/01/2026 - 15:22:11',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    submitStatus: 'Đã nộp',
  },
  {
    id: 15,
    date: '16/01/2026 - 10:10:01',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    submitStatus: 'Đã nộp',
  },
  {
    id: 16,
    date: '15/01/2026 - 08:55:45',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    submitStatus: 'Đã nộp',
  },
];

export default function DailyReport() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [open, setOpen] = useState(false);

  const filteredData = DATA.filter((r) => r.student.toLowerCase().includes(search.toLowerCase()));

  const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    const dateOnly = dateStr.split(' - ')[0];
    const [day, month, year] = dateOnly.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime() || 0;
  };
  const sortedData = [...filteredData].sort((a, b) => {
    const timeA = parseDate(a.date);
    const timeB = parseDate(b.date);
    if (timeA === timeB) {
      return a.id - b.id;
    }
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
      <h1 className='text-2xl font-bold text-slate-900'>Daily Report</h1>

      <Card>
        <div className='mb-5 flex items-center'>
          <SearchBar
            placeholder='Search'
            value={search}
            onChange={setSearch}
            showFilter
            showAction
            actionLabel='Create Report'
            actionIcon={<PlusOutlined />}
            onActionClick={() => setOpen(true)}
          />
        </div>

        <div
          className='max-h-96 overflow-auto border border-slate-200 rounded-lg'
          ref={tableBodyRef}
        >
          <table className='w-full text-left table-fixed'>
            <thead className='border-b border-slate-300 text-xs text-slate-400 bg-slate-50 sticky top-0 z-10'>
              <tr>
                <th
                  className='px-6 py-3 cursor-pointer hover:bg-slate-100 transition-colors w-[180px]'
                  onClick={handleSortDate}
                >
                  <div className='flex items-center gap-1 w-full'>
                    <span className='whitespace-nowrap'>Date</span>
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

                <th className='px-6 py-3 w-[150px]'>Student Name</th>
                <th className='px-6 py-3 w-[200px]'>Summary</th>
                <th className='px-6 py-3 w-[150px]'>Issue</th>
                <th className='px-6 py-3 w-[120px]'>Submit Status</th>
                <th className='px-6 py-3 w-[120px]'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-300 text-slate-800 bg-white'>
              {paginatedData.map((r) => (
                <tr key={r.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm whitespace-nowrap'>{r.date}</td>

                  <td
                    className='px-6 py-4 text-sm font-medium truncate overflow-hidden'
                    title={r.student}
                  >
                    {r.student}
                  </td>

                  <td className='px-6 py-4 text-sm truncate overflow-hidden' title={r.summary}>
                    {r.summary}
                  </td>
                  <td
                    className='px-6 py-4 text-sm text-slate-500 truncate overflow-hidden'
                    title={r.issue}
                  >
                    {r.issue}
                  </td>

                  <td className='px-6 py-4 text-sm'>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                        r.submitStatus === 'Đã nộp'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.submitStatus}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm'>
                    <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 whitespace-nowrap'>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-xl rounded-2xl p-4'>
            <h2 className='text-xl font-semibold mb-6'>Create Daily Report</h2>

            <div className='max-h-[60vh] overflow-y-auto px-6 py-5'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>
                  Date <span className='text-red-500'>*</span>
                </label>
                <input type='date' className='w-full border rounded-xl px-4 py-2' />
              </div>

              <div className='space-y-2'>
                <label className='block mt-4 text-sm font-medium text-slate-700'>
                  Work done yesterday <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Enter the work done...'
                  className='w-full border rounded-xl px-4 py-2 min-h-25'
                />
              </div>

              <div className='space-y-2'>
                <label className='block mt-4 text-sm font-medium text-slate-700'>
                  Issues <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Describe issues if any...'
                  className='w-full border rounded-xl px-4 py-2 min-h-25'
                />
              </div>

              <div className='space-y-2'>
                <label className='block mt-4 text-sm font-medium text-slate-700'>
                  Plan for today <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Enter the plan for today...'
                  className='w-full border rounded-xl px-4 py-2 min-h-25'
                />
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setOpen(false)}
                className='px-5 py-2 rounded-full bg-gray-200 cursor-pointer'
              >
                Cancel
              </button>
              <button className='px-6 py-2 rounded-full bg-(--primary-600) text-white cursor-pointer'>
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
