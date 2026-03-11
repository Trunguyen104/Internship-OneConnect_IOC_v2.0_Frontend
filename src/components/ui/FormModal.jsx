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
        <h2 className='text-xl font-semibold mb-6'>{title}</h2>

        <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
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
            className='w-full rounded-xl border px-4 py-2 min-h-[100px]'
          />

          <textarea
            placeholder='Vấn đề gặp phải...'
            value={form.issues}
            onChange={(e) => handleChange('issues', e.target.value)}
            className='w-full rounded-xl border px-4 py-2 min-h-[100px]'
          />

          <textarea
            placeholder='Kế hoạch hôm nay...'
            value={form.todayPlan}
            onChange={(e) => handleChange('todayPlan', e.target.value)}
            className='w-full rounded-xl border px-4 py-2 min-h-[100px]'
          />
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <button onClick={onClose} className='rounded-full px-5 py-2 bg-gray-200'>
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className='rounded-full px-6 py-2 bg-(--color-primary) text-white'
          >
            Tạo báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}

