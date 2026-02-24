'use client';

import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import SearchBar from '@/shared/components/SearchBar';
import Card from '@/shared/components/Card';

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
  const [tab, setTab] = useState('stakeholder');
  const [search, setSearch] = useState('');

  const filteredIssueData = ISSUE_DATA.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.stakeholder.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className='space-y-6'>
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

      <Card>
        <div>
          <div className='flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between'>
            <SearchBar
              placeholder='Tìm kiếm theo tên'
              value={search}
              onChange={setSearch}
              showFilter
              showAction
              actionLabel={tab === 'issue' ? 'Thêm vấn đề' : 'Thêm bên liên quan'}
              actionIcon={<PlusOutlined />}
            />
          </div>

          {tab === 'stakeholder' && (
            <div className='px-6 pb-10 pt-4'>
              <p className='text-sm text-slate-500'>Chưa có bên liên quan nào.</p>
            </div>
          )}

          {tab === 'issue' && (
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
                  {filteredIssueData.map((i) => (
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
          )}
        </div>
      </Card>
    </section>
  );
}
