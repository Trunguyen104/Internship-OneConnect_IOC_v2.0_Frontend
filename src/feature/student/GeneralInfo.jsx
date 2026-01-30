import Card from '@/shared/components/Card';

export default function GeneralInfo() {
  const GENERAL_INFO = [
    { label: 'Mã nhóm', value: 'FU_CT_SPRING_2026_IOC' },
    { label: 'Tên nhóm', value: 'FU Cần Thơ - Mùa xuân 2026 - IOC (C#, React)' },
    { label: 'Kỳ thực tập', value: 'FU Cần Thơ - Mùa xuân 2026' },
    { label: 'Doanh nghiệp', value: 'Rikasoft' },
    { label: 'Trường', value: 'FU Cần Thơ' },
    { label: 'Mentor', value: 'R_1-000001 - Trần Doãn Đô' },
    { label: 'Ngày bắt đầu', value: '13/01/2026' },
    { label: 'Ngày kết thúc', value: '11/04/2026' },
    { label: 'Số lượng sinh viên', value: '0', large: true },
    { label: 'Số lượng mentor', value: '0', large: true },
  ];

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Thông tin chung</h1>

      <Card>
        <div className='grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4'>
          {GENERAL_INFO.map((item) => (
            <InfoItem key={item.label} {...item} />
          ))}
        </div>

        <p className='mt-4 italic text-slate-700'>Nhập mô tả dự án</p>

        <div className='mt-8 space-y-1 border-t border-slate-200 pt-6'>
          <p className='text-xs text-slate-400'>Đã tạo 19/01/2026</p>
          <p className='text-xs font-medium text-slate-400'>Cập nhật 9 ngày trước</p>
        </div>
      </Card>
      {/* <div className='rounded-2xl bg-white p-6 shadow-sm'>
        <div className='grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4'>
          {GENERAL_INFO.map((item) => (
            <InfoItem key={item.label} {...item} />
          ))}
        </div>

        <p className='mt-4 italic text-slate-700'>Nhập mô tả dự án</p>

        <div className='mt-8 space-y-1 border-t border-slate-200 pt-6'>
          <p className='text-xs text-slate-400'>Đã tạo 19/01/2026</p>
          <p className='text-xs font-medium text-slate-400'>Cập nhật 9 ngày trước</p>
        </div>
      </div> */}
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
