'use client';

import { useState, useMemo } from 'react';

const MY_STUDENT_ID = 'STU001';

const MOCK_CYCLES = [
  {
    cycleId: 'CYC-01',
    name: 'Đánh giá Giữa kỳ Thực tập',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'COMPLETED',
    totalStudentsScored: 5,
    totalTeamStudents: 5,
  },
  {
    cycleId: 'CYC-02',
    name: 'Đánh giá Cuối kỳ Thực tập',
    startDate: '2024-05-10',
    endDate: '2024-05-25',
    status: 'ONGOING',
    totalStudentsScored: 2,
    totalTeamStudents: 5,
  },
  {
    cycleId: 'CYC-03',
    name: 'Bảo vệ Đồ án',
    startDate: '2024-06-01',
    endDate: '2024-06-10',
    status: 'UPCOMING',
    totalStudentsScored: 0,
    totalTeamStudents: 5,
  },
];

const MOCK_TEAM_EVALUATIONS = {
  'CYC-01': [
    {
      studentId: 'STU002',
      fullName: 'Bùi Văn Lập',
      studentCode: 'SE150002',
      evaluationStatus: 3,
      totalScore: 8.5,
    },
    {
      studentId: 'STU001',
      fullName: 'Vũ Minh Anh (You)',
      studentCode: 'SE150001',
      evaluationStatus: 3,
      totalScore: 9.0,
    },
    {
      studentId: 'STU003',
      fullName: 'Trần Thị Trang',
      studentCode: 'SE150003',
      evaluationStatus: 3,
      totalScore: 7.5,
    },
    {
      studentId: 'STU004',
      fullName: 'Lê Hoàng Hải',
      studentCode: 'SE150004',
      evaluationStatus: 3,
      totalScore: 8.0,
    },
    {
      studentId: 'STU005',
      fullName: 'Ngô Tấn Tài',
      studentCode: 'SE150005',
      evaluationStatus: 3,
      totalScore: 6.5,
    },
  ],
  'CYC-02': [
    {
      studentId: 'STU002',
      fullName: 'Bùi Văn Lập',
      studentCode: 'SE150002',
      evaluationStatus: 2,
      totalScore: null,
    },
    {
      studentId: 'STU001',
      fullName: 'Vũ Minh Anh (You)',
      studentCode: 'SE150001',
      evaluationStatus: 3,
      totalScore: 9.5,
    },
    {
      studentId: 'STU003',
      fullName: 'Trần Thị Trang',
      studentCode: 'SE150003',
      evaluationStatus: 0,
      totalScore: null,
    },
    {
      studentId: 'STU004',
      fullName: 'Lê Hoàng Hải',
      studentCode: 'SE150004',
      evaluationStatus: 1,
      totalScore: null,
    },
    {
      studentId: 'STU005',
      fullName: 'Ngô Tấn Tài',
      studentCode: 'SE150005',
      evaluationStatus: 0,
      totalScore: null,
    },
  ],
  'CYC-03': [
    {
      studentId: 'STU002',
      fullName: 'Bùi Văn Lập',
      studentCode: 'SE150002',
      evaluationStatus: 0,
      totalScore: null,
    },
    {
      studentId: 'STU001',
      fullName: 'Vũ Minh Anh (You)',
      studentCode: 'SE150001',
      evaluationStatus: 0,
      totalScore: null,
    },
    {
      studentId: 'STU003',
      fullName: 'Trần Thị Trang',
      studentCode: 'SE150003',
      evaluationStatus: 0,
      totalScore: null,
    },
    {
      studentId: 'STU004',
      fullName: 'Lê Hoàng Hải',
      studentCode: 'SE150004',
      evaluationStatus: 0,
      totalScore: null,
    },
    {
      studentId: 'STU005',
      fullName: 'Ngô Tấn Tài',
      studentCode: 'SE150005',
      evaluationStatus: 0,
      totalScore: null,
    },
  ],
};

const MOCK_MY_EVALUATION = {
  'CYC-01': {
    evaluationId: 'EVAL-001',
    cycleName: 'Đánh giá Giữa kỳ Thực tập',
    evaluatorName: 'John Doe (Senior Engineer @ Global Tech)',
    gradedAt: '2024-03-16T10:30:00',
    totalScore: 9.0,
    generalComment:
      'Minh Anh đã hòa nhập rất tốt với team, khả năng nắm bắt công nghệ nhanh. Cần chủ động hơn trong việc raise các block issues sớm.',
    criteriaScores: [
      {
        criteriaName: 'Chuyên cần & Thái độ làm việc',
        score: 10,
        maxScore: 10,
        comment: 'Luôn đúng giờ, tham gia đầy đủ các buổi Daily Scrum.',
      },
      {
        criteriaName: 'Kỹ năng chuyên chuyên môn (Hard skills)',
        score: 8,
        maxScore: 10,
        comment:
          'Hoàn thành tốt các tasks ReactJS cơ bản, tuy nhiên cần cải thiện thêm kỹ năng xử lý logic Asynchronous.',
      },
      {
        criteriaName: 'Kỹ năng mềm (Soft skills)',
        score: 9,
        maxScore: 10,
        comment: 'Giao tiếp tốt với các members trong team Backend để lấy API.',
      },
    ],
  },
  'CYC-02': {
    evaluationId: 'EVAL-002',
    cycleName: 'Đánh giá Cuối kỳ Thực tập',
    evaluatorName: 'Jane Smith (Tech Lead @ Global Tech)',
    gradedAt: '2024-05-20T14:15:00',
    totalScore: 9.5,
    generalComment:
      'Hoàn thành xuất sắc nhiệm vụ được giao. Là một trong những intern nổi bật nhất kỳ, có khả năng deliver các feature lớn độc lập.',
    criteriaScores: [
      {
        criteriaName: 'Chuyên cần & Thái độ làm việc',
        score: 10,
        maxScore: 10,
        comment: 'Thái độ làm việc vô cùng chuyên nghiệp.',
      },
      {
        criteriaName: 'Kỹ năng chuyên môn (Hard skills)',
        score: 9.5,
        maxScore: 10,
        comment: 'Code clean, ít bugs, đã làm quen được với luồng CI/CD của team.',
      },
      {
        criteriaName: 'Kỹ năng mềm (Soft skills)',
        score: 9,
        maxScore: 10,
        comment: 'Chủ động thuyết trình Demo tốt.',
      },
    ],
  },
};

export function useEvaluation() {
  const [selectedCycle, setSelectedCycle] = useState(null);

  const [teamVisible, setTeamVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const cycles = useMemo(() => MOCK_CYCLES, []);
  const teamData = useMemo(
    () => (selectedCycle ? MOCK_TEAM_EVALUATIONS[selectedCycle.cycleId] || [] : []),
    [selectedCycle],
  );
  const myEvaluation = useMemo(
    () => (selectedCycle ? MOCK_MY_EVALUATION[selectedCycle.cycleId] || null : null),
    [selectedCycle],
  );

  const total = cycles.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return cycles.slice(start, start + pageSize);
  }, [cycles, page, pageSize]);

  const openTeamOverview = (cycle) => {
    setSelectedCycle(cycle);
    setTeamVisible(true);
  };

  const closeTeam = () => {
    setTeamVisible(false);
  };

  const openDetail = (cycle) => {
    setSelectedCycle(cycle);
    setTeamVisible(false);

    setTimeout(() => {
      setDetailVisible(true);
    }, 250);
  };

  const closeDetail = () => {
    setDetailVisible(false);
  };

  return {
    MY_STUDENT_ID,

    page,
    pageSize,
    paginated,
    total,
    totalPages,

    setPage,
    setPageSize,

    selectedCycle,
    teamData,
    myEvaluation,

    teamVisible,
    detailVisible,

    openTeamOverview,
    openDetail,
    closeTeam,
    closeDetail,
  };
}

