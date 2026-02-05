'use client';

import { useState } from 'react';
import Card from '@/shared/components/Card';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';

/* ===== DATA MẪU CHO TAB VẤN ĐỀ ===== */
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
];

export default function StakeholderPage() {
  const [tab, setTab] = useState('stakeholder'); // stakeholder | issue

  return (
    <section className='space-y-6'>
      {/* ===== Tabs ===== */}
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setTab('stakeholder')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border
            ${
              tab === 'stakeholder'
                ? 'border-primary bg-red-50 text-primary'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
        >
          Các bên liên quan
        </button>

        <button
          onClick={() => setTab('issue')}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border
            ${
              tab === 'issue'
                ? 'border-primary bg-red-50 text-primary'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
        >
          Vấn đề
        </button>
      </div>

      {/* ===== CARD ===== */}
      <Card>
        {/* ===== SEARCH + ACTION ===== */}
        <div className='flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative w-72'>
              <input
                placeholder='Tìm kiếm theo tên'
                className='w-full rounded-full border border-slate-300 bg-white py-2 pl-4 pr-10
                text-sm focus:border-primary focus:ring-2 focus:ring-primary/20'
              />
              <SearchOutlined className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400' />
            </div>

            <button className='flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100'>
              <FilterOutlined />
              Bộ lọc
            </button>
          </div>

          {/* ===== ACTION BUTTON ===== */}
          {tab === 'issue' && (
            <button className='flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700'>
              Thêm vấn đề
              <PlusOutlined />
            </button>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        {tab === 'stakeholder' && (
          <div className='px-6 pb-10 pt-4'>
            <p className='text-sm text-slate-500'>Chưa có bên liên quan nào.</p>
          </div>
        )}

        {tab === 'issue' && (
          <>
            {/* ===== TABLE ===== */}
            <div className='overflow-x-auto'>
              <table className='w-full text-left'>
                <thead className='border-b border-slate-200 text-xs text-slate-400'>
                  <tr>
                    <th className='px-6 py-3'>Tiêu đề</th>
                    <th className='px-6 py-3'>Bên liên quan</th>
                    <th className='px-6 py-3'>Trạng thái</th>
                    <th className='px-6 py-3'>Ngày tạo</th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-slate-200 text-sm text-slate-800'>
                  {ISSUE_DATA.map((i) => (
                    <tr key={i.id}>
                      <td className='px-6 py-4 font-medium'>{i.title}</td>
                      <td className='px-6 py-4'>{i.stakeholder}</td>
                      <td className='px-6 py-4'>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium
                            ${
                              i.status === 'Đã giải quyết'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                          {i.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>{i.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== FOOTER ===== */}
            <div className='flex items-center justify-between border-t border-slate-200 px-6 py-4'>
              <p className='text-sm text-slate-500'>
                Tổng số bản ghi:{' '}
                <span className='font-medium text-slate-900'>{ISSUE_DATA.length}</span>
              </p>

              <div className='flex items-center gap-2'>
                <button className='rounded-lg border px-3 py-1 text-sm text-slate-500'>‹</button>
                <button className='rounded-lg bg-primary px-3 py-1 text-sm text-white'>1</button>
                <button className='rounded-lg border px-3 py-1 text-sm text-slate-500'>›</button>
              </div>
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
