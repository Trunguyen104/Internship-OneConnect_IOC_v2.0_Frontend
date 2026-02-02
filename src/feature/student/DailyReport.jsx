import Card from '@/shared/components/Card';

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
];

export default function DailyReport() {
  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Báo cáo hằng ngày</h1>

      <Card>
        {/* Search */}
        <div className='p-6 pb-4'>
          <div className='relative w-80'>
            <input
              type='text'
              placeholder='Tìm theo tên sinh viên'
              className='w-full rounded-full bg-white py-2 pl-3 pr-4
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
              {DATA.map((r) => (
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
            </tbody>
          </table>
        </div>

        {/* Footer: total + pagination */}
        <div className='flex items-center justify-between border-t border-slate-200 px-6 py-4'>
          {/* Total */}
          <p className='text-sm text-slate-500'>
            Tổng số bản ghi: <span className='font-medium text-slate-900'>2</span>
          </p>

          {/* Pagination */}
          <div className='flex items-center gap-1'>
            <button className='rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-500'>
              «
            </button>
            <button className='rounded-lg bg-primary px-3 py-1 text-sm font-medium text-white'>
              1
            </button>
            <button className='rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700'>
              2
            </button>
            <button className='rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-500'>
              »
            </button>
          </div>
        </div>
      </Card>
    </section>
  );
}
