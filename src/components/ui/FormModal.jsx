'use client';

import { useState, useEffect } from 'react';

export default function DailyReportFormModal({
  open,
  onClose,
  onSubmit,
  initialValues = {},
  title = 'Tạo báo cáo hằng ngày',
}) {
  const [form, setForm] = useState({
    reportDate: '',
    yesterdayWork: '',
    issues: '',
    todayPlan: '',
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        reportDate: initialValues.reportDate || '',
        yesterdayWork: initialValues.yesterdayWork || '',
        issues: initialValues.issues || '',
        todayPlan: initialValues.todayPlan || '',
      });
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl'>
        <h2 className='mb-6 text-xl font-semibold'>{title}</h2>

        <div className='max-h-[60vh] space-y-4 overflow-y-auto pr-2'>
          <input
            type='date'
            value={form.reportDate}
            onChange={(e) => handleChange('reportDate', e.target.value)}
            className='w-full rounded-xl border px-4 py-2'
          />

          <textarea
            placeholder='Công việc đã làm hôm qua...'
            value={form.yesterdayWork}
            onChange={(e) => handleChange('yesterdayWork', e.target.value)}
            className='min-h-[100px] w-full rounded-xl border px-4 py-2'
          />

          <textarea
            placeholder='Vấn đề gặp phải...'
            value={form.issues}
            onChange={(e) => handleChange('issues', e.target.value)}
            className='min-h-[100px] w-full rounded-xl border px-4 py-2'
          />

          <textarea
            placeholder='Kế hoạch hôm nay...'
            value={form.todayPlan}
            onChange={(e) => handleChange('todayPlan', e.target.value)}
            className='min-h-[100px] w-full rounded-xl border px-4 py-2'
          />
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <button onClick={onClose} className='rounded-full bg-gray-200 px-5 py-2'>
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className='rounded-full bg-(--color-primary) px-6 py-2 text-white'
          >
            Tạo báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
