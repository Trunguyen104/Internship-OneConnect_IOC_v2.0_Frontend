'use client';

import React from 'react';
import { Drawer, Empty, Typography, Progress } from 'antd';
import { MessageOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

export default function ScoreDetailDrawer({ visible, cycle, onClose, evaluationDetail }) {
  if (!cycle) return null;

  return (
    <Drawer
      title={
        <div className='flex flex-col'>
          <span className='mb-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase'>
            Chi tiết Phiếu Điểm
          </span>
          <span className='text-xl font-black tracking-tight text-slate-900'>{cycle.name}</span>
        </div>
      }
      placement='right'
      width={560}
      onClose={onClose}
      open={visible}
      styles={{
        header: { borderBottom: '1px solid #f1f5f9', padding: '24px 28px 20px' },
        body: { padding: 0, backgroundColor: '#f8fafc' },
      }}
      closeIcon={
        <span className='material-symbols-outlined text-slate-400 transition-colors hover:text-slate-700'>
          close
        </span>
      }
    >
      {!evaluationDetail ? (
        <div className='flex h-full flex-col items-center justify-center bg-white p-12 text-center'>
          <Empty
            description={
              <div className='space-y-1'>
                <span className='block font-bold text-slate-500'>Phiếu điểm chưa sẵn sàng</span>
                <span className='block text-xs font-medium text-slate-400'>
                  Kết quả đang được cập nhật hoặc chưa được công bố công khai.
                </span>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className='flex h-full flex-col'>
          {/* Main Info Hero */}
          <div className='border-b border-slate-100 bg-white p-7 shadow-sm'>
            <div className='mb-8 flex items-start justify-between'>
              <div>
                <Text
                  type='secondary'
                  className='text-[10px] font-black tracking-widest text-slate-400 uppercase'
                >
                  Người Đánh Giá
                </Text>
                <div className='mt-2.5 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#d52020]/10 text-lg font-black text-[#d52020] shadow-inner'>
                    {evaluationDetail.evaluatorName.charAt(0)}
                  </div>
                  <div>
                    <Text className='block text-base leading-tight font-bold text-slate-800'>
                      {evaluationDetail.evaluatorName}
                    </Text>
                    <Text type='secondary' className='text-[11px] font-medium'>
                      Vào lúc: {dayjs(evaluationDetail.gradedAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <Text
                  type='secondary'
                  className='text-[10px] font-black tracking-widest text-slate-400 uppercase'
                >
                  Tổng Điểm
                </Text>
                <div className='mt-1 text-5xl leading-none font-black tracking-tighter text-[#d52020]'>
                  {Number(evaluationDetail.totalScore).toFixed(1)}
                  <span className='ml-1 text-lg font-bold tracking-normal text-slate-300'>
                    / 10
                  </span>
                </div>
              </div>
            </div>

            {/* General Comment */}
            <div className='relative overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/40 p-5 shadow-sm'>
              <div className='absolute top-0 left-0 h-full w-1.5 bg-orange-400'></div>
              <div className='flex gap-4'>
                <div className='flex h-fit items-center justify-center rounded-full bg-orange-100 p-2'>
                  <MessageOutlined className='text-lg text-orange-600' />
                </div>
                <div>
                  <Text className='mb-1.5 block text-[13px] font-black tracking-wide text-slate-800 uppercase'>
                    Nhận xét từ Mentor
                  </Text>
                  <Paragraph className='m-0 text-sm leading-relaxed font-medium text-slate-600 italic'>
                    {`"${evaluationDetail.generalComment}"`}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>

          {/* Criteria Breakdown */}
          <div className='custom-scrollbar flex-1 space-y-5 overflow-y-auto p-7 pb-10'>
            <h3 className='mb-6 flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-800'>
              <StarFilled className='text-xl text-[#f59e0b]' /> Điểm Thành Phần
            </h3>

            {evaluationDetail.criteriaScores.map((criteria, idx) => (
              <div
                key={idx}
                className='rounded-2xl border border-white bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
              >
                <div className='mb-3.5 flex items-start justify-between'>
                  <Text className='text-[15px] font-bold text-slate-800'>
                    {criteria.criteriaName}
                  </Text>
                  <span className='rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-black text-slate-900 shadow-sm'>
                    <span
                      className={
                        criteria.score >= criteria.maxScore * 0.8
                          ? 'text-green-600'
                          : 'text-orange-500'
                      }
                    >
                      {criteria.score}
                    </span>{' '}
                    <span className='mx-0.5 font-bold text-slate-300'>/</span> {criteria.maxScore}
                  </span>
                </div>
                <Progress
                  percent={(criteria.score / criteria.maxScore) * 100}
                  showInfo={false}
                  strokeColor={criteria.score >= criteria.maxScore * 0.8 ? '#10b981' : '#f59e0b'}
                  trailColor='#f1f5f9'
                  strokeWidth={10}
                  className='mb-4'
                />
                <div className='rounded-xl border border-slate-50 bg-slate-50/50 p-4 text-[13px] leading-relaxed font-medium text-slate-500 italic'>
                  {criteria.comment ? `"${criteria.comment}"` : 'Không có nhận xét chi tiết.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Drawer>
  );
}

