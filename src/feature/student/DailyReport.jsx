'use client';

import Card from '@/shared/components/Card';
import SearchBar from '@/shared/components/SearchBar';
import { useState, useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import Footer from '@/shared/components/Footer';

const DATA = [
  {
    id: 1,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 2,
    date: '30/01/2026',
    student: 'Trần Gia Đạt',
    status: 'Hoàn thành',
    summary: 'Sửa UI dashboard',
    issue: 'Chỉnh responsive',
    time: '3h',
    submitStatus: 'Chưa nộp',
  },
  {
    id: 3,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 4,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 5,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 6,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 7,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 8,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 9,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 10,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 11,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 12,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 13,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 14,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 15,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
  {
    id: 16,
    date: '29/01/2026',
    student: 'Lê Duy Khánh',
    status: 'Đang làm',
    summary: 'Hoàn thiện giao diện báo cáo',
    issue: 'Fix layout table',
    time: '2h',
    submitStatus: 'Đã nộp',
  },
];

export default function DailyReport() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredData = DATA.filter((r) => r.student.toLowerCase().includes(search.toLowerCase()));
  const [open, setOpen] = useState(false);
  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
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
      <h1 className='text-2xl font-bold text-slate-900'>Báo cáo hằng ngày</h1>

      <Card>
        <div className='mb-5 flex items-center'>
          <SearchBar
            placeholder='Tìm kiếm theo tên'
            value={search}
            onChange={setSearch}
            showFilter
            showAction
            actionLabel='Tạo báo cáo'
            actionIcon={<PlusOutlined />}
            onActionClick={() => setOpen(true)}
          />
        </div>

        <div className='max-h-96 overflow-auto' ref={tableBodyRef}>
          <table className='w-full text-left'>
            <thead className='border-b border-slate-300 text-xs text-slate-400'>
              <tr>
                <th className='px-6 py-3'>Ngày báo cáo</th>
                <th className='px-6 py-3'>Tên sinh viên</th>
                <th className='px-6 py-3'>Trạng thái</th>
                <th className='px-6 py-3'>Tóm tắt công việc</th>
                <th className='px-6 py-3'>Issue đã làm</th>
                <th className='px-6 py-3'>Time báo cáo</th>
                <th className='px-6 py-3'>Trạng thái nộp</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-300 text-slate-800'>
              {paginatedData.map((r) => (
                <tr key={r.id}>
                  <td className='px-6 py-4 text-sm'>{r.date}</td>
                  <td className='px-6 py-4 text-sm font-medium'>{r.student}</td>
                  <td className='px-6 py-4 text-sm'>
                    <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700'>
                      {r.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm'>{r.summary}</td>
                  <td className='px-6 py-4 text-sm text-slate-500'>{r.issue}</td>
                  <td className='px-6 py-4 text-sm'>{r.time}</td>
                  <td className='px-6 py-4 text-sm'>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        r.submitStatus === 'Đã nộp'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.submitStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className='px-6 py-6 text-center text-sm text-slate-400'>
                    Không tìm thấy báo cáo
                  </td>
                </tr>
              )}
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
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white w-full max-w-xl rounded-2xl p-4'>
            <h2 className='text-xl font-semibold mb-6'>Tạo báo cáo hằng ngày</h2>

            <div className='max-h-[60vh] overflow-y-auto px-6 py-5'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>
                  Ngày báo cáo <span className='text-red-500'>*</span>
                </label>
                <input type='date' className='w-full border rounded-xl px-4 py-2' />
              </div>

              <div className='space-y-2'>
                <label className='block mt-4 text-sm font-medium text-slate-700'>
                  Công việc đã làm hôm qua <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Nhập công việc đã thực hiện...'
                  className='w-full border rounded-xl px-4 py-2 min-h-25'
                />
              </div>

              <div className='space-y-2'>
                <label className='block mt-4 text-sm font-medium text-slate-700'>
                  Vấn đề gặp phải <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Mô tả vấn đề nếu có...'
                  className='w-full border rounded-xl px-4 py-2 min-h-25'
                />
              </div>

              <div className='space-y-2'>
                <label className='block mt-4 text-sm font-medium text-slate-700'>
                  Kế hoạch hôm nay <span className='text-red-500'>*</span>
                </label>
                <textarea
                  placeholder='Nhập kế hoạch sẽ thực hiện...'
                  className='w-full border rounded-xl px-4 py-2 min-h-25'
                />
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setOpen(false)}
                className='px-5 py-2 rounded-full bg-gray-200 cursor-pointer'
              >
                Hủy
              </button>
              <button className='px-6 py-2 rounded-full bg-(--primary-600) text-white cursor-pointer'>
                Tạo báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
