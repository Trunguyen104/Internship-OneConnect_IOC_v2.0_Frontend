'use client';

import Card from '@/shared/components/Card';
import { useState } from 'react';

export default function Evaluation() {
  const [evaluations] = useState([]);

  // useEffect(() => {
  //   getEvaluationList().then((res) => {
  //     setEvaluations(res.data || []);
  //   });
  // }, []);

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Evaluation</h1>

      <Card>
        <div className='p-5 border-b border-slate-200 bg-slate-50/50'>
          <h2 className='font-semibold text-slate-800'>General Information</h2>
        </div>

        <div className='max-h-96 overflow-auto' style={{ scrollbarWidth: 'thin' }}>
          <table className='w-full text-left table-fixed'>
            <thead className='border-b border-slate-300 text-xs text-slate-400 bg-slate-50 sticky top-0 z-10'>
              <tr>
                <th className='px-6 py-3 w-[250px]'>Evaluation Cycle</th>
                <th className='px-6 py-3 w-[150px]'>Start Time</th>
                <th className='px-6 py-3 w-[150px]'>End Time</th>
                <th className='px-6 py-3 w-[150px]'>Status</th>
                <th className='px-6 py-3 w-[220px]'>Scored</th>
                <th className='px-6 py-3 w-[80px]'></th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-300 text-slate-800 bg-white'>
              {(evaluations || []).map((e) => (
                <tr key={e.id} className='hover:bg-slate-50 transition-colors'>
                  <td
                    className='px-6 py-4 text-sm font-medium truncate overflow-hidden'
                    title={e.name}
                  >
                    {e.name}
                  </td>
                  <td className='px-6 py-4 text-sm text-slate-600 whitespace-nowrap'>
                    {formatDate(e.startDate)}
                  </td>
                  <td className='px-6 py-4 text-sm text-slate-600 whitespace-nowrap'>
                    {formatDate(e.endDate)}
                  </td>
                  <td className='px-6 py-4 text-sm'>
                    <StatusBadge status={e.status} />
                  </td>
                  <td className='px-6 py-4 text-sm text-slate-600 text-center lg:text-left'>
                    {e.totalStudents}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <button className='p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer text-slate-400'>
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
              {evaluations.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-10 text-center text-slate-400 text-sm'>
                    No evaluation data
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

function formatDate(date) {
  if (!date) return '';
  return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN');
}

function StatusBadge({ status }) {
  if (status === 'ONGOING') {
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap'>
        Ongoing
      </span>
    );
  }

  if (status === 'UPCOMING') {
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 whitespace-nowrap'>
        Upcoming
      </span>
    );
  }

  return (
    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 whitespace-nowrap'>
      Completed
    </span>
  );
}
