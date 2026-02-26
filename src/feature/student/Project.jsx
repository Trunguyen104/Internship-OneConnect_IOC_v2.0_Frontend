// import Card from '@/shared/components/Card';

export default function Project() {
  return (
    <section className='space-y-6 mt-10'>
      <h1 className='text-2xl font-bold ml-1 text-slate-900'>Dự án</h1>

      <>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <InfoItem label='Tên dự án' value='IOC Version 2' />
          <InfoItem label='Lĩnh vực' value='Công nghệ thông tin' />
        </div>

        <div className='mt-6 space-y-4 text-slate-700'>
          <SectionTitle>Mô tả</SectionTitle>

          <p className='font-bold  text-xl'>1. Tổng quan dự án</p>
          <p>
            Internship OneConnect (IOC) là nền tảng chuyển đổi số toàn diện quy trình thực tập, giải
            quyết bài toán kết nối rườm rà giữa ba bên: Nhà trường – Doanh nghiệp – Sinh viên. Hệ
            thống thay thế các quy trình giấy tờ thủ công bằng workflow tự động, minh bạch và hiệu
            quả cao.
          </p>

          <p className='font-bold  text-xl'>2. Chi tiết các Phân hệ (Modules)</p>

          <Module
            title='A. Phân hệ Nhà trường (University Portal)'
            items={[
              'Quản lý Kỳ thực tập: Tạo và cấu hình các đợt thực tập, thiết lập timeline, tiêu chí đánh giá.',
              'Quản lý Sinh viên: Import danh sách sinh viên, theo dõi trạng thái thực tập.',
              'Phân công Giảng viên hướng dẫn.',
              'Thống kê & Báo cáo: Dashboard theo dõi tỷ lệ sinh viên, điểm số, phản hồi.',
            ]}
          />

          <Module
            title='B. Phân hệ Doanh nghiệp (Enterprise Portal)'
            items={[
              'Hồ sơ Doanh nghiệp & thương hiệu tuyển dụng.',
              'Đăng tin tuyển dụng (JD), yêu cầu kỹ năng.',
              'Quy trình tuyển dụng: CV, phỏng vấn, Offer Letter.',
              'Quản lý OJT: Mentor, duyệt logbook, đánh giá năng lực.',
            ]}
          />

          <Module
            title='C. Phân hệ Sinh viên (Student Portal)'
            items={[
              'CV & Portfolio trực tuyến.',
              'Tìm kiếm và ứng tuyển vị trí thực tập.',
              'Báo cáo Daily / Weekly.',
              'Tra cứu kết quả, điểm số, chứng nhận.',
            ]}
          />

          <p className='font-bold  text-xl'>3. Các tính năng nâng cao</p>
          <ul className='list-disc space-y-1 pl-5'>
            <li>Hợp đồng điện tử (E-Sign)</li>
            <li>AI Matching giữa CV & JD</li>
            <li>Tích hợp Google Calendar</li>
          </ul>
        </div>

        <div className='mt-6 space-y-3'>
          <SectionTitle>Thông tin bổ sung</SectionTitle>
          <p className='text-slate-500'>-</p>
        </div>

        <div className='mt-6 space-y-2'>
          <SectionTitle>Tài nguyên đính kèm</SectionTitle>
          <ul className='list-disc underline pl-5 text-black grid grid-cols-3 gap-x-6 gap-y-2'>
            <li>Tài liệu báo cáo bảo mật</li>
            <li>Test case mẫu</li>
            <li>Bug Report mẫu</li>
            <li>User Story mẫu</li>
          </ul>
        </div>

        <div className='mt-8 border-t border-slate-200 pt-4'>
          <p className='text-xs text-slate-400'>Đã tạo 19/01/2026</p>
          <p className='text-xs font-medium text-slate-400'>Cập nhật 11 ngày trước</p>
        </div>
      </>
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className='text-sm font-medium text-slate-500'>{label}</p>
      <p className='text-base font-semibold text-slate-900'>{value}</p>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className='text-sm font-semibold uppercase text-slate-500'>{children}</h2>;
}

function Module({ title, items }) {
  return (
    <div className='space-y-1'>
      <p className='font-medium'>{title}</p>
      <ul className='list-disc space-y-1 pl-5'>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
