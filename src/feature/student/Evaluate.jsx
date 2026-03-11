// 'use client';

// import React, { useState, useMemo, memo } from 'react';
// import { Typography, Button, Modal, Table, Drawer, Progress, Empty } from 'antd';
// import {
//   TeamOutlined,
//   CheckCircleFilled,
//   ClockCircleFilled,
//   ExclamationCircleFilled,
//   StarFilled,
//   MessageOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const { Text, Paragraph } = Typography;

// const MY_STUDENT_ID = 'STU001';

// const MOCK_CYCLES = [
//   {
//     cycleId: 'CYC-01',
//     name: 'Đánh giá Giữa kỳ Thực tập',
//     startDate: '2024-03-01',
//     endDate: '2024-03-15',
//     status: 'COMPLETED', // UPCOMING, ONGOING, COMPLETED
//     totalStudentsScored: 5,
//     totalTeamStudents: 5,
//   },
//   {
//     cycleId: 'CYC-02',
//     name: 'Đánh giá Cuối kỳ Thực tập',
//     startDate: '2024-05-10',
//     endDate: '2024-05-25',
//     status: 'ONGOING',
//     totalStudentsScored: 2,
//     totalTeamStudents: 5,
//   },
//   {
//     cycleId: 'CYC-03',
//     name: 'Bảo vệ Đồ án',
//     startDate: '2024-06-01',
//     endDate: '2024-06-10',
//     status: 'UPCOMING',
//     totalStudentsScored: 0,
//     totalTeamStudents: 5,
//   },
// ];

// const MOCK_TEAM_EVALUATIONS = {
//   'CYC-01': [
//     {
//       studentId: 'STU002',
//       fullName: 'Bùi Văn Lập',
//       studentCode: 'SE150002',
//       evaluationStatus: 3,
//       totalScore: 8.5,
//     }, // 3=Published
//     {
//       studentId: 'STU001',
//       fullName: 'Vũ Minh Anh (You)',
//       studentCode: 'SE150001',
//       evaluationStatus: 3,
//       totalScore: 9.0,
//     },
//     {
//       studentId: 'STU003',
//       fullName: 'Trần Thị Trang',
//       studentCode: 'SE150003',
//       evaluationStatus: 3,
//       totalScore: 7.5,
//     },
//     {
//       studentId: 'STU004',
//       fullName: 'Lê Hoàng Hải',
//       studentCode: 'SE150004',
//       evaluationStatus: 3,
//       totalScore: 8.0,
//     },
//     {
//       studentId: 'STU005',
//       fullName: 'Ngô Tấn Tài',
//       studentCode: 'SE150005',
//       evaluationStatus: 3,
//       totalScore: 6.5,
//     },
//   ],
//   'CYC-02': [
//     {
//       studentId: 'STU002',
//       fullName: 'Bùi Văn Lập',
//       studentCode: 'SE150002',
//       evaluationStatus: 2,
//       totalScore: null,
//     }, // 2=Submitted
//     {
//       studentId: 'STU001',
//       fullName: 'Vũ Minh Anh (You)',
//       studentCode: 'SE150001',
//       evaluationStatus: 3,
//       totalScore: 9.5,
//     }, // Own score is published
//     {
//       studentId: 'STU003',
//       fullName: 'Trần Thị Trang',
//       studentCode: 'SE150003',
//       evaluationStatus: 0,
//       totalScore: null,
//     }, // 0=Pending
//     {
//       studentId: 'STU004',
//       fullName: 'Lê Hoàng Hải',
//       studentCode: 'SE150004',
//       evaluationStatus: 1,
//       totalScore: null,
//     }, // 1=Draft
//     {
//       studentId: 'STU005',
//       fullName: 'Ngô Tấn Tài',
//       studentCode: 'SE150005',
//       evaluationStatus: 0,
//       totalScore: null,
//     },
//   ],
//   'CYC-03': [
//     {
//       studentId: 'STU002',
//       fullName: 'Bùi Văn Lập',
//       studentCode: 'SE150002',
//       evaluationStatus: 0,
//       totalScore: null,
//     },
//     {
//       studentId: 'STU001',
//       fullName: 'Vũ Minh Anh (You)',
//       studentCode: 'SE150001',
//       evaluationStatus: 0,
//       totalScore: null,
//     },
//     {
//       studentId: 'STU003',
//       fullName: 'Trần Thị Trang',
//       studentCode: 'SE150003',
//       evaluationStatus: 0,
//       totalScore: null,
//     },
//     {
//       studentId: 'STU004',
//       fullName: 'Lê Hoàng Hải',
//       studentCode: 'SE150004',
//       evaluationStatus: 0,
//       totalScore: null,
//     },
//     {
//       studentId: 'STU005',
//       fullName: 'Ngô Tấn Tài',
//       studentCode: 'SE150005',
//       evaluationStatus: 0,
//       totalScore: null,
//     },
//   ],
// };

// const MOCK_MY_EVALUATION = {
//   'CYC-01': {
//     evaluationId: 'EVAL-001',
//     cycleName: 'Đánh giá Giữa kỳ Thực tập',
//     evaluatorName: 'John Doe (Senior Engineer @ Global Tech)',
//     gradedAt: '2024-03-16T10:30:00',
//     totalScore: 9.0,
//     generalComment:
//       'Minh Anh đã hòa nhập rất tốt với team, khả năng nắm bắt công nghệ nhanh. Cần chủ động hơn trong việc raise các block issues sớm.',
//     criteriaScores: [
//       {
//         criteriaName: 'Chuyên cần & Thái độ làm việc',
//         score: 10,
//         maxScore: 10,
//         comment: 'Luôn đúng giờ, tham gia đầy đủ các buổi Daily Scrum.',
//       },
//       {
//         criteriaName: 'Kỹ năng chuyên môn (Hard skills)',
//         score: 8,
//         maxScore: 10,
//         comment:
//           'Hoàn thành tốt các tasks ReactJS cơ bản, tuy nhiên cần cải thiện thêm kỹ năng xử lý logic Asynchronous.',
//       },
//       {
//         criteriaName: 'Kỹ năng mềm (Soft skills)',
//         score: 9,
//         maxScore: 10,
//         comment: 'Giao tiếp tốt với các members trong team Backend để lấy API.',
//       },
//     ],
//   },
//   'CYC-02': {
//     evaluationId: 'EVAL-002',
//     cycleName: 'Đánh giá Cuối kỳ Thực tập',
//     evaluatorName: 'Jane Smith (Tech Lead @ Global Tech)',
//     gradedAt: '2024-05-20T14:15:00',
//     totalScore: 9.5,
//     generalComment:
//       'Hoàn thành xuất sắc nhiệm vụ được giao. Là một trong những intern nổi bật nhất kỳ, có khả năng deliver các feature lớn độc lập.',
//     criteriaScores: [
//       {
//         criteriaName: 'Chuyên cần & Thái độ làm việc',
//         score: 10,
//         maxScore: 10,
//         comment: 'Thái độ làm việc vô cùng chuyên nghiệp.',
//       },
//       {
//         criteriaName: 'Kỹ năng chuyên môn (Hard skills)',
//         score: 9.5,
//         maxScore: 10,
//         comment: 'Code clean, ít bugs, đã làm quen được với luồng CI/CD của team.',
//       },
//       {
//         criteriaName: 'Kỹ năng mềm (Soft skills)',
//         score: 9,
//         maxScore: 10,
//         comment: 'Chủ động thuyết trình Demo tốt.',
//       },
//     ],
//   },
// };

// const getStatusConfig = (status) => {
//   switch (status) {
//     case 'ONGOING':
//       return {
//         label: 'Đang diễn ra',
//         color: 'blue',
//         bgColor: 'bg-blue-50',
//         textColor: 'text-blue-600',
//         dot: <ClockCircleFilled className='text-blue-500' />,
//       };
//     case 'UPCOMING':
//       return {
//         label: 'Sắp diễn ra',
//         color: 'orange',
//         bgColor: 'bg-orange-50',
//         textColor: 'text-orange-600',
//         dot: <ClockCircleFilled className='text-orange-500' />,
//       };
//     case 'COMPLETED':
//       return {
//         label: 'Đã kết thúc',
//         color: 'green',
//         bgColor: 'bg-green-50',
//         textColor: 'text-green-600',
//         dot: <CheckCircleFilled className='text-green-500' />,
//       };
//     default:
//       return {
//         label: 'Unknown',
//         color: 'default',
//         bgColor: 'bg-slate-50',
//         textColor: 'text-slate-600',
//         dot: null,
//       };
//   }
// };

// // const getEvalStatusText = (evalStatus) => {
// //   switch (evalStatus) {
// //     case 0:
// //       return { label: 'Chưa đánh giá', color: 'default' };
// //     case 1:
// //       return { label: 'Bản nháp', color: 'warning' };
// //     case 2:
// //       return { label: 'Đã gửi (Chờ duyệt)', color: 'processing' };
// //     case 3:
// //       return { label: 'Đã công bố', color: 'success' };
// //     default:
// //       return { label: 'N/A', color: 'default' };
// //   }
// // };

// // const TeamEvaluationsModal = memo(function TeamEvaluationsModal({
// //   visible,
// //   cycle,
// //   onClose,
// //   onViewDetails,
// // }) {
// //   if (!cycle) return null;

// //   const teamData = MOCK_TEAM_EVALUATIONS[cycle.cycleId] || [];

// //   // const columns = [
// //   //   {
// //   //     title: 'Họ và Tên',
// //   //     dataIndex: 'fullName',
// //   //     key: 'fullName',
// //   //     render: (text, record) => (
// //   //       <span
// //   //         className={`font-semibold ${record.studentId === MY_STUDENT_ID ? 'text-[#d52020]' : 'text-slate-700'}`}
// //   //       >
// //   //         {text}
// //   //       </span>
// //   //     ),
// //   //   },
// //   //   {
// //   //     title: 'MSSV',
// //   //     dataIndex: 'studentCode',
// //   //     key: 'studentCode',
// //   //     render: (text) => (
// //   //       <Text type='secondary' className='font-mono'>
// //   //         {text}
// //   //       </Text>
// //   //     ),
// //   //   },
// //   //   {
// //   //     title: 'Trạng thái',
// //   //     dataIndex: 'evaluationStatus',
// //   //     key: 'evaluationStatus',
// //   //     align: 'center',
// //   //     render: (status) => {
// //   //       const conf = getEvalStatusText(status);
// //   //       return (
// //   //         <Tag color={conf.color} className='m-0 rounded-full px-3'>
// //   //           {conf.label}
// //   //         </Tag>
// //   //       );
// //   //     },
// //   //   },
// //   //   {
// //   //     title: 'Điểm số',
// //   //     dataIndex: 'totalScore',
// //   //     key: 'totalScore',
// //   //     align: 'center',
// //   //     render: (score, record) => {
// //   //       // If it's a future/ongoing cycle and status is not Published, show --
// //   //       if (record.evaluationStatus < 3) return <Text type='secondary'>--</Text>;

// //   //       // Mask scores for others
// //   //       if (record.studentId !== MY_STUDENT_ID) {
// //   //         return (
// //   //           <Tooltip title='Điểm số được bảo mật'>
// //   //             <span className='m-auto flex w-fit items-center justify-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-mono tracking-widest text-slate-400'>
// //   //               <LockOutlined className='text-xs' /> ***
// //   //             </span>
// //   //           </Tooltip>
// //   //         );
// //   //       }

// //   //       // Show actual score for self
// //   //       return (
// //   //         <span className='m-auto block w-fit rounded-full bg-[#d52020]/10 px-3 py-1 text-lg font-bold text-[#d52020]'>
// //   //           {Number(score).toFixed(1)}
// //   //         </span>
// //   //       );
// //   //     },
// //   //   },
// //   //   {
// //   //     title: 'Thao tác',
// //   //     key: 'action',
// //   //     align: 'right',
// //   //     render: (_, record) => {
// //   //       if (record.studentId !== MY_STUDENT_ID) return null;
// //   //       if (record.evaluationStatus < 3) {
// //   //         return (
// //   //           <Tooltip title='Phiếu điểm chưa được công bố'>
// //   //             <Button type='text' disabled icon={<ClockCircleFilled />} className='text-slate-400'>
// //   //               Chờ kết quả
// //   //             </Button>
// //   //           </Tooltip>
// //   //         );
// //   //       }
// //   //       return (
// //   //         <Button
// //   //           type='primary'
// //   //           icon={<EyeOutlined />}
// //   //           onClick={() => onViewDetails(cycle)}
// //   //           className='rounded-full border-none bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
// //   //         >
// //   //           Xem Chi Tiết
// //   //         </Button>
// //   //       );
// //   //     },
// //   //   },
// //   // ];
// //   const columns = [
// //     {
// //       title: 'STT',
// //       width: 60,
// //       render: (_, __, index) => (page - 1) * pageSize + index + 1,
// //     },
// //     {
// //       title: 'Evaluation Cycle',
// //       dataIndex: 'name',
// //       key: 'name',
// //       width: 280,
// //       render: (text) => <span className='font-semibold text-slate-800'>{text}</span>,
// //     },
// //     {
// //       title: 'Start Time',
// //       dataIndex: 'startDate',
// //       key: 'startDate',
// //       width: 150,
// //       render: (date) => dayjs(date).format('DD/MM/YYYY'),
// //     },
// //     {
// //       title: 'End Time',
// //       dataIndex: 'endDate',
// //       key: 'endDate',
// //       width: 150,
// //       render: (date) => dayjs(date).format('DD/MM/YYYY'),
// //     },
// //     {
// //       title: 'Status',
// //       dataIndex: 'status',
// //       key: 'status',
// //       width: 140,
// //       render: (status) => (
// //         <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusConfig(status)}`}>
// //           {status}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: 'Scored',
// //       key: 'scored',
// //       width: 120,
// //       render: (_, record) => `${record.totalStudentsScored} / ${record.totalTeamStudents}`,
// //     },
// //     {
// //       title: 'Action',
// //       key: 'action',
// //       width: 120,
// //       render: () => (
// //         <Button size='small' className='bg-primary rounded-full text-white'>
// //           Detail
// //         </Button>
// //       ),
// //     },
// //   ];
// //   return (
// //     <Modal
// //       title={
// //         <div className='flex items-center gap-3'>
// //           <div className='rounded-lg bg-[#d52020]/10 p-2 text-[#d52020]'>
// //             <TeamOutlined className='text-xl' />
// //           </div>
// //           <div>
// //             <h2 className='m-0 text-xl font-bold text-slate-900'>Tiến độ Đánh giá Nhóm</h2>
// //             <Text type='secondary' className='text-sm font-medium'>
// //               {cycle.name}
// //             </Text>
// //           </div>
// //         </div>
// //       }
// //       open={visible}
// //       onCancel={onClose}
// //       footer={null}
// //       width={800}
// //       className='custom-team-eval-modal'
// //       closeIcon={
// //         <span className='material-symbols-outlined text-slate-400 hover:text-slate-700'>close</span>
// //       }
// //     >
// //       <div className='pt-4'>
// //         <Table
// //           columns={columns}
// //           dataSource={teamData}
// //           pagination={false}
// //           rowKey='studentId'
// //           className='overflow-hidden rounded-xl border border-slate-100 shadow-sm'
// //           rowClassName={(record) => (record.studentId === MY_STUDENT_ID ? 'bg-[#d52020]/5' : '')}
// //         />
// //         <div className='mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500'>
// //           <ExclamationCircleFilled className='mt-0.5 text-slate-400' />
// //           <p className='m-0 leading-relaxed'>
// //             Vì lý do bảo mật, điểm số của các thành viên khác trong nhóm sẽ được ẩn (hiển thị{' '}
// //             <span className='rounded bg-slate-200 px-1 font-mono text-[10px]'>***</span>). Bạn chỉ
// //             có thể xem chi tiết phiếu điểm của chính mình khi trạng thái là{' '}
// //             <span className='font-semibold text-slate-700'>Đã công bố</span>.
// //           </p>
// //         </div>
// //       </div>
// //     </Modal>
// //   );
// // });

// const ScoreDetailDrawer = memo(function ScoreDetailDrawer({ visible, cycle, onClose }) {
//   if (!cycle) return null;

//   const evaluationDetail = MOCK_MY_EVALUATION[cycle.cycleId];

//   return (
//     <Drawer
//       title={
//         <div className='flex flex-col'>
//           <span className='mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase'>
//             Chi tiết Phiếu Điểm
//           </span>
//           <span className='text-xl font-bold text-slate-900'>{cycle.name}</span>
//         </div>
//       }
//       placement='right'
//       size={560}
//       onClose={onClose}
//       open={visible}
//       styles={{
//         header: { borderBottom: '1px solid #f1f5f9', padding: '24px 24px 16px' },
//         body: { padding: 0 },
//       }}
//       closeIcon={
//         <span className='material-symbols-outlined text-slate-400 hover:text-slate-700'>close</span>
//       }
//     >
//       {!evaluationDetail ? (
//         <div className='flex h-full flex-col items-center justify-center p-6 text-center'>
//           <Empty
//             description={
//               <span className='font-medium text-slate-500'>
//                 Phiếu điểm đang được cập nhật hoặc chưa công bố.
//               </span>
//             }
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//           />
//         </div>
//       ) : (
//         <div className='flex h-full flex-col bg-slate-50'>
//           {/* Main Info Hero */}
//           <div className='border-b border-slate-100 bg-white p-6'>
//             <div className='mb-6 flex items-start justify-between'>
//               <div>
//                 <Text type='secondary' className='text-xs font-bold tracking-wide uppercase'>
//                   Người Đánh Giá
//                 </Text>
//                 <div className='mt-1 flex items-center gap-2'>
//                   <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#d52020]/10 font-bold text-[#d52020]'>
//                     {evaluationDetail.evaluatorName.charAt(0)}
//                   </div>
//                   <Text className='font-semibold text-slate-800'>
//                     {evaluationDetail.evaluatorName}
//                   </Text>
//                 </div>
//                 <Text type='secondary' className='mt-1 block text-xs'>
//                   Vào lúc: {dayjs(evaluationDetail.gradedAt).format('DD/MM/YYYY HH:mm')}
//                 </Text>
//               </div>
//               <div className='text-right'>
//                 <Text type='secondary' className='text-xs font-bold tracking-wide uppercase'>
//                   Tổng Điểm
//                 </Text>
//                 <div className='mt-1 text-4xl leading-none font-black text-[#d52020]'>
//                   {Number(evaluationDetail.totalScore).toFixed(1)}
//                   <span className='ml-1 text-base font-bold text-slate-400'>/ 10</span>
//                 </div>
//               </div>
//             </div>

//             {/* General Comment */}
//             <div className='relative mt-6 overflow-hidden rounded-xl border border-orange-100 bg-orange-50/50 p-4'>
//               <div className='absolute top-0 left-0 h-full w-1 bg-orange-400'></div>
//               <div className='flex gap-3'>
//                 <MessageOutlined className='mt-0.5 text-lg text-orange-500' />
//                 <div>
//                   <Text className='mb-1 block text-sm font-bold text-slate-800'>
//                     Nhận xét chung từ Mentor
//                   </Text>
//                   <Paragraph className='m-0 text-sm leading-relaxed text-slate-600 italic'>
//                     {evaluationDetail.generalComment}
//                   </Paragraph>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Criteria Breakdown */}
//           <div className='flex-1 space-y-4 overflow-y-auto p-6'>
//             <h3 className='mb-4 flex items-center gap-2 text-lg font-bold text-slate-800'>
//               <StarFilled className='text-[#f59e0b]' /> Điểm Thành Phần
//             </h3>

//             {evaluationDetail.criteriaScores.map((criteria, idx) => (
//               <div
//                 key={idx}
//                 className='rounded-xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
//               >
//                 <div className='mb-2 flex items-start justify-between'>
//                   <Text className='font-bold text-slate-800'>{criteria.criteriaName}</Text>
//                   <span className='rounded bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-900'>
//                     <span
//                       className={
//                         criteria.score >= criteria.maxScore * 0.8
//                           ? 'text-green-600'
//                           : 'text-orange-500'
//                       }
//                     >
//                       {criteria.score}
//                     </span>{' '}
//                     / {criteria.maxScore}
//                   </span>
//                 </div>
//                 <Progress
//                   percent={(criteria.score / criteria.maxScore) * 100}
//                   showInfo={false}
//                   strokeColor={criteria.score >= criteria.maxScore * 0.8 ? '#10b981' : '#f59e0b'}
//                   trailColor='#f1f5f9'
//                   size='small'
//                   className='mb-3'
//                 />
//                 <div className='rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 italic'>
//                   {criteria.comment ? `"${criteria.comment}"` : 'Không có nhận xét chi tiết.'}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </Drawer>
//   );
// });

// import Card from '@/shared/components/Card';
// import SearchBar from '../job-board/components/SearchBar';

// // --- MAIN VIEW COMPONENT ---

// export default function Evaluation() {
//   const [selectedCycle, setSelectedCycle] = useState(null);
//   const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);
//   const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);

//   // Computed Values
//   const allCycles = useMemo(() => MOCK_CYCLES, []);

//   // Handlers
//   const openTeamOverview = (cycle) => {
//     setSelectedCycle(cycle);
//     setIsTeamModalVisible(true);
//   };

//   const openScoreDetails = (cycle) => {
//     // If opening detail from team modal, swap visibility
//     setIsTeamModalVisible(false);
//     setSelectedCycle(cycle);
//     // Add small delay to allow modal out-animation
//     setTimeout(() => setIsDetailDrawerVisible(true), 300);
//   };

//   return (
//     // <section className='space-y-6'>
//     //   <h1 className='text-2xl font-bold text-slate-900'>Evaluation</h1>

//     //   <Card>
//     //     <div className='border-b border-slate-200 bg-slate-50/50 p-5'>
//     //       <h2 className='font-semibold text-slate-800'>General Information</h2>
//     //     </div>

//     //     <div className='max-h-96 overflow-auto' style={{ scrollbarWidth: 'thin' }}>
//     //       <table className='w-full table-fixed text-left'>
//     //         <thead className='sticky top-0 z-10 border-b border-slate-300 bg-slate-50 text-xs text-slate-400'>
//     //           <tr>
//     //             <th className='w-[300px] px-6 py-3'>Evaluation Cycle</th>
//     //             <th className='w-[150px] px-6 py-3'>Start Time</th>
//     //             <th className='w-[150px] px-6 py-3'>End Time</th>
//     //             <th className='w-[150px] px-6 py-3'>Status</th>
//     //             <th className='w-[120px] px-6 py-3'>Scored</th>
//     //             <th className='w-[100px] px-6 py-3 text-right'>Actions</th>
//     //           </tr>
//     //         </thead>

//     //         <tbody className='divide-y divide-slate-300 bg-white text-slate-800'>
//     //           {allCycles.map((cycle) => {
//     //             const statusCfg = getStatusConfig(cycle.status);
//     //             return (
//     //               <tr key={cycle.cycleId} className='transition-colors hover:bg-slate-50'>
//     //                 <td className='px-6 py-4 text-sm font-bold text-slate-800'>{cycle.name}</td>
//     //                 <td className='px-6 py-4 text-sm whitespace-nowrap text-slate-600'>
//     //                   {dayjs(cycle.startDate).format('DD/MM/YYYY')}
//     //                 </td>
//     //                 <td className='px-6 py-4 text-sm whitespace-nowrap text-slate-600'>
//     //                   {dayjs(cycle.endDate).format('DD/MM/YYYY')}
//     //                 </td>
//     //                 <td className='px-6 py-4 text-sm'>
//     //                   <span
//     //                     className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusCfg.bgColor} ${statusCfg.textColor} whitespace-nowrap`}
//     //                   >
//     //                     {statusCfg.label}
//     //                   </span>
//     //                 </td>
//     //                 <td className='px-6 py-4 text-sm font-semibold text-slate-600'>
//     //                   {cycle.totalStudentsScored} / {cycle.totalTeamStudents}
//     //                 </td>
//     //                 <td className='px-6 py-4 text-right'>
//     //                   <Button
//     //                     type='primary'
//     //                     size='small'
//     //                     className='rounded-full border-none bg-[#d52020] font-bold shadow-sm hover:bg-[#d52020]/90'
//     //                     onClick={() => openTeamOverview(cycle)}
//     //                   >
//     //                     Chi Tiết
//     //                   </Button>
//     //                 </td>
//     //               </tr>
//     //             );
//     //           })}
//     //           {allCycles.length === 0 && (
//     //             <tr>
//     //               <td colSpan={6} className='px-6 py-10 text-center text-sm text-slate-400'>
//     //                 No evaluation data
//     //               </td>
//     //             </tr>
//     //           )}
//     //         </tbody>
//     //       </table>
//     //     </div>
//     //   </Card>

//     //   <TeamEvaluationsModal
//     //     visible={isTeamModalVisible}
//     //     onClose={() => setIsTeamModalVisible(false)}
//     //     cycle={selectedCycle}
//     //     onViewDetails={openScoreDetails}
//     //   />

//     //   <ScoreDetailDrawer
//     //     visible={isDetailDrawerVisible}
//     //     onClose={() => setIsDetailDrawerVisible(false)}
//     //     cycle={selectedCycle}
//     //   />
//     // </section>
//     <section className='flex h-full flex-col space-y-6'>
//       <h1 className='text-2xl font-bold text-slate-900'>Evaluation</h1>

//       <Card>
//         {/* TABLE */}
//         <div className='max-h-96 overflow-auto border-t border-slate-200' ref={tableRef}>
//           <AppTable
//             columns={columns}
//             data={paginated}
//             rowKey='cycleId'
//             pagination={false}
//             emptyText='No evaluation data'
//           />
//         </div>
//       </Card>

//       {/* FOOTER */}
//       <Footer
//         total={total}
//         page={page}
//         pageSize={pageSize}
//         totalPages={totalPages}
//         onPageChange={setPage}
//         onPageSizeChange={(size) => {
//           setPageSize(size);
//           setPage(1);
//         }}
//       />
//     </section>
//   );
// }
