'use client';

export default function Project() {
  return (
    <section className='space-y-6 mt-10 pb-10'>
      <h1 className='text-2xl font-bold ml-1 text-slate-900'>Dự án</h1>

      <div className='rounded-2xl bg-white shadow-sm p-6 sm:p-8 h-auto border border-slate-100 flex flex-col'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <InfoItem label='Tên dự án' value='IOC Version 2' />
          <InfoItem label='Lĩnh vực' value='Công nghệ thông tin' />
        </div>

        <div className='mt-8 space-y-6 text-slate-700 leading-relaxed'>
          <SectionTitle>Mô tả</SectionTitle>

          <div>
            <p className='font-bold text-xl mb-2 text-slate-900'>1. Tổng quan dự án</p>
            <p>
              Internship OneConnect (IOC) là nền tảng chuyển đổi số toàn diện quy trình thực tập,
              giải quyết bài toán kết nối rườm rà giữa ba bên: Nhà trường – Doanh nghiệp – Sinh
              viên. Hệ thống thay thế các quy trình giấy tờ thủ công bằng workflow tự động, minh
              bạch và hiệu quả cao.
            </p>
          </div>

          <div>
            <p className='font-bold text-xl mb-3 text-slate-900'>
              2. Chi tiết các Phân hệ (Modules)
            </p>
            <div className='space-y-5'>
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
            </div>
          </div>

          <div>
            <p className='font-bold text-xl mb-2 text-slate-900'>3. Các tính năng nâng cao</p>
            <ul className='list-disc space-y-2 pl-5 text-slate-600'>
              <li>Hợp đồng điện tử (E-Sign)</li>
              <li>AI Matching giữa CV & JD</li>
              <li>Tích hợp Google Calendar</li>
            </ul>
          </div>
        </div>

        <div className='mt-10 pt-6 border-t border-slate-100'>
          <SectionTitle>Tài nguyên đính kèm</SectionTitle>
          <ul className='mt-4 list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {['Tài liệu báo cáo bảo mật', 'Test case mẫu', 'Bug Report mẫu', 'User Story mẫu'].map(
              (file, index) => (
                <li
                  key={index}
                  className='flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group'
                >
                  <span className='truncate font-medium underline'>{file}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className='mt-10 border-t border-slate-100 pt-4'>
          <p className='text-xs text-slate-400 uppercase tracking-wide'>Dữ liệu hệ thống</p>
          <div className='flex gap-6 mt-1'>
            <p className='text-xs text-slate-400'>
              Đã tạo: <span className='font-medium'>19/01/2026</span>
            </p>
            <p className='text-xs text-slate-400'>
              Cập nhật: <span className='font-medium text-slate-500'>11 ngày trước</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className='text-sm font-medium text-slate-500 mb-0.5'>{label}</p>
      <p className='text-base font-semibold text-slate-900'>{value}</p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>{children}</h2>
  );
}

function Module({ title, items }) {
  return (
    <div className='space-y-2'>
      <p className='font-bold text-slate-800'>{title}</p>
      <ul className='list-disc space-y-1.5 pl-5 text-slate-600 text-sm'>
        {items.map((item, idx) => (
          <li key={idx} className='leading-relaxed'>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
