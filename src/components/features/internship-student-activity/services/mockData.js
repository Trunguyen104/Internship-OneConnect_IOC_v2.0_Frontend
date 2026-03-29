import dayjs from 'dayjs';

export const MOCK_STUDENTS = [
  {
    studentId: '1',
    studentCode: 'STU001',
    studentFullName: 'Nguyen Van A',
    className: 'IT01',
    major: 'Software Engineering',
    enterpriseId: 'E1',
    enterpriseName: 'FPT Software',
    mentorName: 'Tran Van B',
    mentorEmail: 'mentor.b@fpt.com',
    internGroupAddedAt: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    internPhaseEnd: dayjs().add(60, 'day').format('YYYY-MM-DD'),
    logbookSubmittedCount: 18,
    violationCount: 0,
    placementStatus: 'PLACED',
    groupId: 'G1',
    termName: 'Summer 2024',
    termStatus: 'ACTIVE',
  },
  {
    studentId: '2',
    studentCode: 'STU002',
    studentFullName: 'Le Thi C',
    className: 'IT02',
    major: 'Information Security',
    enterpriseId: 'E2',
    enterpriseName: 'VNG Corp',
    mentorName: 'Pham Van D',
    mentorEmail: 'mentor.d@vng.com.vn',
    internGroupAddedAt: dayjs().subtract(15, 'day').format('YYYY-MM-DD'),
    internPhaseEnd: dayjs().add(75, 'day').format('YYYY-MM-DD'),
    logbookSubmittedCount: 5,
    violationCount: 2,
    latestViolationType: 'Missing Logbook',
    placementStatus: 'PLACED',
    groupId: 'G2',
    termName: 'Summer 2024',
    termStatus: 'ACTIVE',
  },
  {
    studentId: '3',
    studentCode: 'STU003',
    studentFullName: 'Hoang Van E',
    className: 'GD01',
    major: 'Graphic Design',
    placementStatus: 'UNPLACED',
    termName: 'Summer 2024',
    termStatus: 'ACTIVE',
  },
];

export const MOCK_TERMS = [
  { termId: 'T1', id: 'T1', name: 'Summer 2024', status: 'ACTIVE' },
  { termId: 'T2', id: 'T2', name: 'Spring 2024', status: 'CLOSED' },
];

export const MOCK_ENTERPRISES = [
  { id: 'E1', name: 'FPT Software' },
  { id: 'E2', name: 'VNG Corp' },
  { id: 'E3', name: 'Viettel IT' },
];

export const MOCK_VIOLATIONS = [
  {
    id: 'V1',
    type: 'Unexcused Absence',
    incidentDate: dayjs().subtract(5, 'day').format('DD/MM/YYYY'),
    createdAt: dayjs().subtract(4, 'day').format('DD/MM/YYYY'),
    description: 'Student did not show up for the weekly meeting without notification.',
  },
  {
    id: 'V2',
    type: 'Late Logbook',
    incidentDate: dayjs().subtract(10, 'day').format('DD/MM/YYYY'),
    createdAt: dayjs().subtract(9, 'day').format('DD/MM/YYYY'),
    description: 'Logbook for week 2 was submitted 3 days late.',
  },
];

export const MOCK_EVALUATIONS = [
  {
    id: 'EV1',
    evalId: 'EV1',
    cycleName: 'Midterm Evaluation',
    startDate: '01/05/2024',
    endDate: '15/05/2024',
    createdAt: '16/05/2024',
    totalScore: 8.5,
    evaluatorName: 'Tran Van B',
    generalComment: 'Highly proactive and quick to adapt to the team work style.',
    criteria: [
      { name: 'Attitude', score: 9, comment: 'Always on time' },
      { name: 'Technical Skills', score: 8, comment: 'Good progress' },
    ],
  },
];
