'use client';

import { useEffect, useState } from 'react';
import Card from '@/shared/components/Card';
import { getViolationList } from '@/mocks/mockViolationList';

export default function ViolationList() {
  const [violations, setViolations] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchViolations() {
      const res = await getViolationList();
      setViolations(res.data || []);
    }
    fetchViolations();
  }, []);

  const filteredViolations = violations.filter(
    (v) =>
      v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Vi phạm</h1>

      <Card>
        {/* Search */}
        <div className='p-6 pb-4'>
          <div className='relative w-70'>
            <input
              type='text'
              placeholder='Tìm kiếm theo loại hoặc mô tả'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full rounded-full bg-white py-2 pl-4 pr-4
              border border-slate-300 text-sm text-slate-700
              placeholder:text-slate-400
              focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='border-b border-slate-300 text-xs text-slate-400'>
              <tr>
                <th className='px-6 py-4'>STT</th>
                <th className='px-6 py-4'>Loại vi phạm</th>
                <th className='px-6 py-4'>Mô tả chi tiết</th>
                <th className='px-6 py-4'>Thời gian vi phạm</th>
                <th className='px-6 py-4'>Người ghi nhận</th>
                <th className='px-6 py-4'>Ngày tạo</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-300 text-gray-800'>
              {filteredViolations.map((v, i) => (
                <tr key={v.id}>
                  <td className='px-6 py-4 text-sm font-medium'>{i + 1}</td>
                  <td className='px-6 py-4 text-sm font-medium'>{v.type}</td>
                  <td className='px-6 py-4 text-sm text-slate-600'>{v.description}</td>
                  <td className='px-6 py-4 text-sm'>{formatDateTime(v.violationTime)}</td>
                  <td className='px-6 py-4 text-sm'>{v.reporter}</td>
                  <td className='px-6 py-4 text-sm'>{formatDate(v.createdAt)}</td>
                </tr>
              ))}

              {filteredViolations.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-6 text-center text-sm text-slate-400'>
                    Không có vi phạm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

/* Utils */
function formatDate(date) {
  if (!date) return '-';
  return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN');
}

function formatDateTime(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString('vi-VN');
}
