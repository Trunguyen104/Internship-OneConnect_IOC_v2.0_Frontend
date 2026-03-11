'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { getGeneralInfo } from '@/mocks/mockInfo';

export default function GeneralInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getGeneralInfo().then((res) => setInfo(res));
  }, []);

  if (!info) return null;

  const GENERAL_INFO = [
    { label: 'Mã nhóm', value: info.groupCode },
    { label: 'Tên nhóm', value: info.groupName },
    { label: 'Kỳ thực tập', value: info.internshipTerm },
    { label: 'Doanh nghiệp', value: info.company },
    { label: 'Trường', value: info.school },
    { label: 'Mentor', value: info.mentor },
    { label: 'Ngày bắt đầu', value: info.startDate },
    { label: 'Ngày kết thúc', value: info.endDate },
    { label: 'Số lượng sinh viên', value: info.totalStudents, large: true },
    { label: 'Số lượng mentor', value: info.totalMentors, large: true },
  ];

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>General Information</h1>

      <Card>
        <div className='grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4'>
          {GENERAL_INFO.map((item) => (
            <InfoItem key={item.label} {...item} />
          ))}
        </div>

        <p className='mt-4 italic text-slate-700'>{info.description}</p>

        <div className='mt-8 space-y-1 border-t border-slate-200 pt-6'>
          <p className='text-xs text-slate-400'>Created {info.createdAt}</p>
          <p className='text-xs font-medium text-slate-400'>{info.updatedText}</p>
        </div>
      </Card>
    </section>
  );
}

function InfoItem({ label, value, large = false }) {
  return (
    <div>
      <p className='mb-1 text-sm font-medium text-slate-500'>{label}</p>
      <p className={`font-semibold text-slate-900 ${large ? 'text-xl' : 'text-base'}`}>{value}</p>
    </div>
  );
}

