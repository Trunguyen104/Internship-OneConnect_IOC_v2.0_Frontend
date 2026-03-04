'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/shared/components/Header';
import { CalendarOutlined } from '@ant-design/icons';
import { Skeleton, Empty, message } from 'antd';
import { InternshipGroupService } from '@/services/internshipGroup.service';

export default function InternshipGroupsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await InternshipGroupService.getAll();
        if (res && res.isSuccess !== false) {
          setGroups(res.data?.items || res.items || []);
        } else {
          message.error(res?.message || res?.data?.message || 'Failed to fetch internship groups');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        message.error('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Header />

      <main className='flex-1 w-full max-w-[1440px] mx-auto px-10 md:px-14 py-8 flex flex-col gap-10'>
        <section className='relative w-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-[var(--primary-800)] to-[var(--primary-600)] text-white p-10 md:py-16 min-h-[180px] flex flex-col justify-center'>
          <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none'>
            <div className='w-[400px] h-[400px] rounded-full border-30 border-white'></div>
          </div>
          <div className='absolute right-10 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none'>
            <div className='w-[300px] h-[300px] rounded-full border-20 border-white'></div>
          </div>

          <div className='relative z-10'>
            <h1 className='text-3xl md:text-4xl font-extrabold mb-3 tracking-tight'>
              Xin chào Đức!
            </h1>
            <p className='text-white/90 text-sm md:text-base font-medium'>
              Cùng theo dõi tiến trình thực tập, làm việc nhóm và dự án bạn đang tham gia
            </p>
          </div>
        </section>

        {loading ? (
          <div className='bg-white p-8 rounded-2xl border border-gray-100 shadow-sm'>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : groups.length === 0 ? (
          <div className='bg-white p-12 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]'>
            <Empty description={<span className='text-gray-500'>Chưa có nhóm thực tập nào</span>} />
          </div>
        ) : (
          groups.map((group, index) => (
            <section
              key={group.internshipId || index}
              onClick={() => router.push(`/student/space?id=${group.internshipId}`)}
              className='bg-[#e8c9c8]/30 rounded-2xl overflow-hidden border border-[#e8c9c8]/60 flex flex-col mb-8 cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all group'
            >
              <div className='px-6 py-4 flex justify-between items-center bg-[#e8c9c8]/50 border-b border-[#e8c9c8]'>
                <div>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'></h2>
                  <div className='flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-600 font-medium'>
                    <span className='w-px h-3.5 bg-gray-400'></span>
                    <span className='flex items-center gap-1.5'>
                      <CalendarOutlined />{' '}
                      {group.startDate
                        ? new Date(group.startDate).toLocaleDateString('vi-VN')
                        : 'N/A'}{' '}
                      -{' '}
                      {group.endDate ? new Date(group.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                    <span className='w-px h-3.5 bg-gray-400'></span>
                    <span>
                      Sinh viên tham gia:{' '}
                      <strong className='text-gray-900'>{group.numberOfMembers || 0}</strong>
                    </span>
                    <span className='w-px h-3.5 bg-gray-400'></span>
                    <span>
                      Chu kỳ đánh giá: <strong className='text-gray-900'>0</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className='p-6 bg-transparent'>
                <div className='bg-white rounded-xl border border-gray-100 p-5 flex flex-col lg:flex-row gap-8 transition-all'>
                  <div className='w-full lg:w-[320px] h-[180px] rounded-xl bg-blue-50/40 border border-blue-100 flex items-center justify-center shrink-0 relative overflow-hidden'>
                    <div className='relative w-[140px] h-[140px] flex items-center justify-center shrink-0'>
                      <div className='absolute inset-0 animate-[spin_7s_linear_infinite] drop-shadow-sm'>
                        <svg viewBox='0 0 100 100' className='w-full h-full'>
                          <defs>
                            <linearGradient id='purpleGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
                              <stop offset='0%' stopColor='#818cf8' />
                              <stop offset='100%' stopColor='#a5b4fc' />
                            </linearGradient>
                            <linearGradient id='blueGrad' x1='100%' y1='100%' x2='0%' y2='100%'>
                              <stop offset='0%' stopColor='#818cf8' />
                              <stop offset='100%' stopColor='#4f46e5' />
                            </linearGradient>
                          </defs>
                          <path
                            d='M 17 38 A 35 35 0 0 1 84 44'
                            fill='none'
                            stroke='url(#blueGrad)'
                            strokeWidth='10'
                            strokeLinecap='round'
                          />
                          <polygon points='75,46 86,53 94,42' fill='#818cf8' />
                          <path
                            d='M 83 62 A 35 35 0 0 1 16 56'
                            fill='none'
                            stroke='url(#purpleGrad)'
                            strokeWidth='10'
                            strokeLinecap='round'
                          />
                          <polygon points='6,58 14,47 25,54' fill='#a5b4fc' />
                        </svg>
                      </div>

                      <div className='absolute inset-0'>
                        <div className='absolute top-[56px] left-[70px] -translate-x-1/2 -translate-y-1/2 text-[#7990ff] animate-[spin_6s_linear_infinite]'>
                          <div className='rotate-12'>
                            <svg viewBox='0 0 100 100' className='w-[44px] h-[44px]'>
                              <path
                                fill='currentColor'
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M50 8C52 8 54 9 55 11L57 18C61 19 65 21 68 24L74 21C76 19 78 20 80 21L87 28C89 30 89 32 87 34L84 40C87 43 89 47 90 51L97 53C99 53 100 55 100 58V68C100 70 99 72 97 73L90 75C89 79 87 83 84 86L87 92C89 94 89 96 87 98L80 105C78 106 76 107 74 105L68 102C65 105 61 107 57 108L55 115C54 117 52 118 50 118H40C38 118 36 117 35 115L33 108C29 107 25 105 22 102L16 105C14 107 12 106 10 105L3 98C1 96 1 94 3 92L6 86C3 83 1 79 0 75L-7 73C-9 72 -10 70 -10 68V58C-10 55 -9 53 -7 51L0 49C1 45 3 41 6 38L3 32C1 30 1 28 3 26L10 19C12 18 14 17 16 19L22 22C25 19 29 17 33 16L35 9C36 7 38 6 40 6H50ZM45 35C28 35 15 48 15 63C15 78 28 91 45 91C62 91 75 78 75 63C75 48 62 35 45 35Z'
                                transform='scale(0.8) translate(12.5, -12.5)'
                              />
                            </svg>
                          </div>
                        </div>
                        <div className='absolute top-[85px] left-[52px] -translate-x-1/2 -translate-y-1/2 text-[#a8bcfd] animate-[spin_6s_linear_infinite_reverse]'>
                          <div className='rotate-0'>
                            <svg viewBox='0 0 100 100' className='w-[32px] h-[32px]'>
                              <path
                                fill='currentColor'
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M50 8C52 8 54 9 55 11L57 18C61 19 65 21 68 24L74 21C76 19 78 20 80 21L87 28C89 30 89 32 87 34L84 40C87 43 89 47 90 51L97 53C99 53 100 55 100 58V68C100 70 99 72 97 73L90 75C89 79 87 83 84 86L87 92C89 94 89 96 87 98L80 105C78 106 76 107 74 105L68 102C65 105 61 107 57 108L55 115C54 117 52 118 50 118H40C38 118 36 117 35 115L33 108C29 107 25 105 22 102L16 105C14 107 12 106 10 105L3 98C1 96 1 94 3 92L6 86C3 83 1 79 0 75L-7 73C-9 72 -10 70 -10 68V58C-10 55 -9 53 -7 51L0 49C1 45 3 41 6 38L3 32C1 30 1 28 3 26L10 19C12 18 14 17 16 19L22 22C25 19 29 17 33 16L35 9C36 7 38 6 40 6H50ZM45 35C28 35 15 48 15 63C15 78 28 91 45 91C62 91 75 78 75 63C75 48 62 35 45 35Z'
                                transform='scale(0.8) translate(12.5, -12.5)'
                              />
                            </svg>
                          </div>
                        </div>
                        <div className='absolute top-[82px] left-[88px] -translate-x-1/2 -translate-y-1/2 text-[#85b1fc] animate-[spin_6s_linear_infinite_reverse]'>
                          <div className='rotate-22'>
                            <svg viewBox='0 0 100 100' className='w-[24px] h-[24px]'>
                              <path
                                fill='currentColor'
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M50 8C52 8 54 9 55 11L57 18C61 19 65 21 68 24L74 21C76 19 78 20 80 21L87 28C89 30 89 32 87 34L84 40C87 43 89 47 90 51L97 53C99 53 100 55 100 58V68C100 70 99 72 97 73L90 75C89 79 87 83 84 86L87 92C89 94 89 96 87 98L80 105C78 106 76 107 74 105L68 102C65 105 61 107 57 108L55 115C54 117 52 118 50 118H40C38 118 36 117 35 115L33 108C29 107 25 105 22 102L16 105C14 107 12 106 10 105L3 98C1 96 1 94 3 92L6 86C3 83 1 79 0 75L-7 73C-9 72 -10 70 -10 68V58C-10 55 -9 53 -7 51L0 49C1 45 3 41 6 38L3 32C1 30 1 28 3 26L10 19C12 18 14 17 16 19L22 22C25 19 29 17 33 16L35 9C36 7 38 6 40 6H50ZM45 35C28 35 15 48 15 63C15 78 28 91 45 91C62 91 75 78 75 63C75 48 62 35 45 35Z'
                                transform='scale(0.8) translate(12.5, -12.5)'
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex-1 py-1 flex flex-col justify-center'>
                    <div className='flex items-center gap-3 mb-6'>
                      <h3 className='text-[19px] font-bold text-gray-900 group-hover:text-[var(--primary-700)] transition-colors'>
                        {group.groupName || 'Chưa cập nhật tên'}
                      </h3>
                      <span
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full border ${group.status === 1 ? 'bg-blue-50 text-blue-700 border-blue-100' : group.status === 0 ? 'bg-amber-50 text-amber-700 border-amber-100' : group.status === 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-700 border-gray-100'}`}
                      >
                        {group.status === 0
                          ? 'Khởi tạo'
                          : group.status === 1
                            ? 'Đang hoạt động'
                            : group.status === 2
                              ? 'Hoàn thành'
                              : 'Khác'}
                      </span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-8'>
                      <div className='flex items-center gap-3.5'>
                        <div className='w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 14l9-5-9-5-9 5 9 5z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                            />
                          </svg>
                        </div>
                        <div>
                          <p className='text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5'>
                            Mentor
                          </p>
                          <p className='text-[15px] font-bold text-gray-900'>
                            {group.mentorName || 'Chưa phân công'}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3.5'>
                        <div className='w-11 h-11 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                            />
                          </svg>
                        </div>
                        <div>
                          <p className='text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5'>
                            Dự án
                          </p>
                          <p className='text-[15px] font-bold text-gray-900'>
                            {group.groupName ? `${group.groupName} Project` : 'Chưa xác định'}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3.5'>
                        <div className='w-11 h-11 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 shrink-0'>
                          <svg
                            className='w-5 h-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                            />
                          </svg>
                        </div>
                        <div>
                          <p className='text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5'>
                            Doanh nghiệp
                          </p>
                          <p className='text-[15px] font-bold text-gray-900'>
                            {group.enterpriseName || 'Chưa đối chiếu'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
