'use client';

import { useEffect, useState } from 'react';
import Card from '@/shared/components/Card';
import { getEvaluationList } from '@/mocks/mockEvaluationList';

export default function Evaluation() {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    getEvaluationList().then((res) => {
      setEvaluations(res.data || []);
    });
  }, []);

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Đánh giá</h1>

      <Card>
        <div className='p-6 border-b border-slate-200'>
          <h2 className='font-semibold text-slate-800'>Thông tin chung</h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b border-slate-200 text-xs text-slate-400'>
              <tr>
                <th className='px-6 py-4 text-left'>Tên chu kỳ</th>
                <th className='px-6 py-4 text-left'>Thời gian bắt đầu</th>
                <th className='px-6 py-4 text-left'>Thời gian kết thúc</th>
                <th className='px-6 py-4 text-left'>Trạng thái</th>
                <th className='px-6 py-4 text-left'>Số sinh viên đã được chấm điểm</th>
                <th className='px-6 py-4'></th>
              </tr>
            </thead>

            <tbody className='divide-y text-sm divide-slate-200'>
              {evaluations.map((e) => (
                <tr key={e.id} className='hover:bg-slate-50 transition'>
                  <td className='px-6 py-4 font-medium text-slate-800'>{e.name}</td>
                  <td className='px-6 py-4 text-slate-600'>{formatDate(e.startDate)}</td>
                  <td className='px-6 py-4 text-slate-600'>{formatDate(e.endDate)}</td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={e.status} />
                  </td>
                  <td className='px-6 py-4 text-slate-600'>{e.totalStudents}</td>
                  <td className='px-6 py-4 text-right'>
                    <button className='p-2 hover:bg-slate-100 rounded'>⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer */}
      <div className='flex items-center justify-between text-sm text-slate-600'>
        <span>
          Tổng số bản ghi: <b className='text-slate-800'>{evaluations.length}</b>
        </span>

        <div className='flex items-center gap-3'>
          <button className='w-9 h-9 rounded-full border text-slate-400' disabled>
            ‹
          </button>
          <button className='w-9 h-9 rounded-full bg-primary text-white'>1</button>
          <button className='w-9 h-9 rounded-full border text-slate-400'>›</button>

          <select className='ml-4 border rounded-full px-3 py-1'>
            <option>10/trang</option>
            <option>20/trang</option>
            <option>50/trang</option>
          </select>
        </div>
      </div>
    </section>
  );
}

/* Utils */
function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN');
}

function StatusBadge({ status }) {
  if (status === 'ONGOING') {
    return (
      <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
        Đang diễn ra
      </span>
    );
  }

  if (status === 'UPCOMING') {
    return (
      <span className='px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700'>
        Sắp diễn ra
      </span>
    );
  }

  return null;
}
