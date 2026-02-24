'use client';

import { useState } from 'react';

export default function SprintBacklog() {
  // Temporary mock data for UI design
  const [items] = useState([
    {
      id: 1,
      key: 'ISSUE-13',
      title: 'Là người dùng, tôi muốn đăng nhập để truy cập hệ thống.',
      status: 'DONE',
      tag: 'Login/Logout',
      date: '-',
      priority: 'MEDIUM',
      points: '-',
      assigneeIcon: '',
    },
    {
      id: 2,
      key: 'ISSUE-36',
      title: 'Là Student, tôi muốn xem danh sách chi tiết các t...',
      status: 'DONE',
      tag: 'ernship Execution & Workspa',
      date: '-',
      priority: 'HIGH',
      points: '2',
      assigneeIcon: 'L',
    },
    {
      id: 3,
      key: 'ISSUE-30',
      title: 'Là Student, tôi muốn xem thông tin chi tiết dự án ...',
      status: 'DONE',
      tag: 'ernship Execution & Workspa',
      date: '-',
      priority: 'HIGH',
      points: '2',
      assigneeIcon: 'L',
    },
    {
      id: 4,
      key: 'ISSUE-37',
      title: 'Là Student, tôi muốn quản lý danh sách c...',
      status: 'IN_REVIEW',
      tag: 'ernship Execution & Workspa',
      date: '3/2/2026',
      priority: 'MEDIUM',
      points: '2',
      assigneeIcon: 'T',
    },
    {
      id: 5,
      key: 'ISSUE-39',
      title: 'Là Student, tôi muốn thực hiện và quản lý Báo cáo...',
      status: 'TODO',
      tag: 'ernship Execution & Workspa',
      date: '-',
      priority: 'MEDIUM',
      points: '-',
      assigneeIcon: 'N',
    },
    {
      id: 6,
      key: 'ISSUE-41',
      title: 'Là Student, tôi muốn xem thông tin các đợt đ...',
      status: 'TODO',
      tag: 'ernship Execution & Workspa',
      date: '-',
      priority: 'MEDIUM',
      points: '3',
      assigneeIcon: 'T',
    },
    {
      id: 7,
      key: 'ISSUE-40',
      title: 'Là Student, tôi muốn nhận được cảnh báo nhắc n...',
      status: 'TODO',
      tag: 'ernship Execution & Workspa',
      date: '-',
      priority: 'MEDIUM',
      points: '-',
      assigneeIcon: 'L',
    },
    {
      id: 8,
      key: 'ISSUE-34',
      title: 'Là Student, tôi muốn quản lý Product Backlog và ...',
      status: 'TODO',
      tag: 'ernship Execution & Workspa',
      date: '23/2/2026',
      priority: 'HIGH',
      points: '5',
      assigneeIcon: 'T',
    },
    {
      id: 9,
      key: 'ISSUE-38',
      title: 'Là Student, tôi muốn quản lý danh sách ...',
      status: 'IN_PROGRESS',
      tag: 'ernship Execution & Workspa',
      date: '6/2/2026',
      priority: 'MEDIUM',
      points: '2',
      assigneeIcon: 'T',
    },
  ]);

  const mapStatusObj = {
    TODO: { label: 'To Do', className: 'bg-bg text-text border border-border/60' },
    IN_PROGRESS: {
      label: 'In Progress',
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    IN_REVIEW: {
      label: 'In Review',
      className: 'bg-primary/10 text-primary border border-primary/20',
    },
    DONE: { label: 'Done', className: 'bg-green-50 text-green-700 border border-green-200' },
  };

  return (
    <div className='w-full'>
      {/* Container bo góc lớn, đổ bóng nhẹ */}
      <div className='rounded-2xl bg-white shadow-sm overflow-hidden'>
        {/* Header bảng */}
        <div className='flex items-center justify-between border-b border-border/60 px-5 py-4'>
          <div className='flex items-center gap-4 pl-1'>
            {/* Sprint 1 */}
            <div className='text-lg font-bold text-text'>Sprint 1</div>
            {/* Search Input (Mock UI) */}
            <div className='relative ml-4 hidden md:block w-[200px]'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <svg
                  className='w-4 h-4 text-muted'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                  />
                </svg>
              </div>
              <input
                type='text'
                className='block w-full p-2 pl-10 text-sm text-text border border-border/60 rounded-full bg-bg focus:ring-primary focus:border-primary transition-colors'
                placeholder='Tìm kiếm...'
              />
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              className='h-9 rounded-full border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50'
            >
              Hoàn thành Sprint
            </button>
            <button
              type='button'
              className='flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-bg transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-gray-500'
              >
                <circle cx='12' cy='12' r='1' />
                <circle cx='12' cy='5' r='1' />
                <circle cx='12' cy='19' r='1' />
              </svg>
            </button>
          </div>
        </div>

        {/* Danh sách các dòng công việc */}
        <div className='divide-y divide-border/60'>
          {items.map((it) => {
            const statusConfig = mapStatusObj[it.status] || mapStatusObj.TODO;

            const priorityBadgeClass =
              it.priority === 'HIGH'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-blue-50 text-blue-700 border border-blue-200';
            const priorityLabel = it.priority === 'HIGH' ? 'High' : 'Medium';

            return (
              <div
                key={it.id}
                className='flex items-center justify-between px-5 py-3 hover:bg-bg transition-colors'
              >
                {/* 1. Checkbox (REMOVED) & ID */}
                <div className='flex items-center gap-4 w-[120px] shrink-0'>
                  <div className='text-sm font-semibold text-muted pl-1'>{it.key}</div>
                </div>

                {/* 2. Nội dung công việc (flexible) */}
                <div className='flex-1 min-w-0 pr-4 pl-4'>
                  <div className='truncate text-[13px] font-medium text-text tracking-tight'>
                    {it.title}
                  </div>
                </div>

                {/* Phần bên phải - Các cột fixed width để thẳng hàng */}
                <div className='flex items-center justify-end shrink-0'>
                  {/* 3. Trạng thái */}
                  <div className='w-[100px] flex justify-center'>
                    <span
                      className={[
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
                        statusConfig.className,
                      ].join(' ')}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* 4. Tags/Epic */}
                  <div className='w-[220px] flex justify-center px-4'>
                    <span className='inline-flex items-center justify-center rounded-full bg-[#F3F0FF] text-[#6D28D9] border border-[#E9D5FF] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide w-full truncate'>
                      {it.tag}
                    </span>
                  </div>

                  {/* 5. Ngày tháng (Mờ) */}
                  <div className='w-[90px] text-center text-[13px] text-muted font-medium'>
                    {it.date}
                  </div>

                  {/* Points (Có trong hình) */}
                  <div className='w-[40px] text-center text-[13px] font-semibold text-primary'>
                    {it.points === '-' ? '-' : it.points}
                  </div>

                  {/* 6. Độ ưu tiên */}
                  <div className='w-[90px] flex justify-center'>
                    <span
                      className={[
                        'inline-flex items-center rounded-full px-3 py-0.5 text-[12px] font-semibold',
                        priorityBadgeClass,
                      ].join(' ')}
                    >
                      {priorityLabel}
                    </span>
                  </div>

                  {/* 7. Ký hiệu bổ sung (Assignee Icon) */}
                  <div className='w-[50px] flex justify-center'>
                    {it.assigneeIcon ? (
                      <div className='flex h-7 w-7 items-center justify-center rounded-full bg-bg text-[11px] font-bold text-text border border-border/60'>
                        {it.assigneeIcon}
                      </div>
                    ) : (
                      <div className='h-7 w-7' />
                    )}
                  </div>

                  {/* 8. Menu Icon */}
                  <div className='w-[32px] flex justify-end'>
                    <button type='button' className='text-muted hover:text-text transition-colors'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <circle cx='12' cy='12' r='1' />
                        <circle cx='12' cy='5' r='1' />
                        <circle cx='12' cy='19' r='1' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nút Tạo nhiệm vụ ở cuối */}
        <div className='px-5 py-4 border-t border-border/60'>
          <button
            type='button'
            className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 hover:bg-primary/10 transition-colors'
          >
            <span className='font-bold text-primary'>+</span>
            <span className='text-sm font-semibold text-primary'>Tạo nhiệm vụ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
