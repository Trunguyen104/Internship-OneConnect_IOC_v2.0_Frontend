// Mock data for demonstration
const MOCK_REPORTS = [
  {
    id: '1',
    studentId: 'std-001',
    studentName: 'Nguyen Van A',
    studentCode: 'SE12345',
    internGroupId: 'grp-01',
    internGroupName: 'Web Development Group A',
    incidentDate: '2024-03-15',
    description:
      'Student missed the weekly report deadline for three consecutive weeks without notice.',
    createdAt: '2024-03-16T10:00:00Z',
    createdBy: 'mentor-123',
    createdByName: 'Mentor John Doe',
    universityName: 'FPT University',
  },
  {
    id: '2',
    studentId: 'std-002',
    studentName: 'Tran Thi B',
    studentCode: 'SE67890',
    internGroupId: 'grp-02',
    internGroupName: 'Mobile App Group B',
    incidentDate: '2024-03-18',
    description: 'Student was absent from the daily stand-up meeting without prior approval.',
    createdAt: '2024-03-18T09:30:00Z',
    createdBy: 'mentor-456',
    createdByName: 'Mentor Jane Smith',
    universityName: 'Hanoi University',
  },
  {
    id: '3',
    studentId: 'std-003',
    studentName: 'Le Van C',
    studentCode: 'SE54321',
    internGroupId: 'grp-01',
    internGroupName: 'Web Development Group A',
    incidentDate: '2024-03-20',
    description: 'Technical issue: Student failed to push code to the repository for several days.',
    createdAt: '2024-03-20T14:15:00Z',
    createdBy: 'mentor-123',
    createdByName: 'Mentor John Doe',
    universityName: 'FTU',
  },
  {
    id: '4',
    studentId: 'std-004',
    studentName: 'Pham Van D',
    studentCode: 'SE11223',
    internGroupId: 'grp-02',
    internGroupName: 'Mobile App Group B',
    incidentDate: '2024-03-21',
    description:
      'Inappropriate behavior: Student used disrespectful language during a group discussion.',
    createdAt: '2024-03-22T08:00:00Z',
    createdBy: 'mentor-123',
    createdByName: 'Mentor John Doe',
    universityName: 'Bach Khoa University',
  },
  {
    id: '5',
    studentId: 'std-005',
    studentName: 'Hoang Thi E',
    studentCode: 'SE44556',
    internGroupId: 'grp-03',
    internGroupName: 'Data Science Group C',
    incidentDate: '2024-03-22',
    description:
      'Low productivity: Student did not complete assigned tasks for the current sprint.',
    createdAt: '2024-03-23T11:20:00Z',
    createdBy: 'mentor-789',
    createdByName: 'Mentor Robert Brown',
    universityName: 'National Economics University',
  },
  {
    id: '6',
    studentId: 'std-006',
    studentName: 'Do Van F',
    studentCode: 'SE77889',
    internGroupId: 'grp-01',
    internGroupName: 'Web Development Group A',
    incidentDate: '2024-03-23',
    description: 'Security violation: Student shared internal API keys on a public forum.',
    createdAt: '2024-03-24T16:45:00Z',
    createdBy: 'mentor-123',
    createdByName: 'Mentor John Doe',
    universityName: 'FPT University',
  },
  {
    id: '7',
    studentId: 'std-007',
    studentName: 'Bui Thi G',
    studentCode: 'SE99001',
    internGroupId: 'grp-03',
    internGroupName: 'Data Science Group C',
    incidentDate: '2024-03-24',
    description:
      'Policy violation: Student was working on unauthorized personal projects during internship hours.',
    createdAt: '2024-03-25T13:10:00Z',
    createdBy: 'mentor-123',
    createdByName: 'Mentor John Doe',
    universityName: 'National Economics University',
  },
  {
    id: '8',
    studentId: 'std-008',
    studentName: 'Vu Van H',
    studentCode: 'SE22334',
    internGroupId: 'grp-02',
    internGroupName: 'Mobile App Group B',
    incidentDate: '2024-03-25',
    description:
      'Confidentiality breach: Student discussed sensitive project details with external parties.',
    createdAt: '2024-03-26T10:05:00Z',
    createdBy: 'mentor-456',
    createdByName: 'Mentor Jane Smith',
    universityName: 'Hanoi University',
  },
  {
    id: '9',
    studentId: 'std-009',
    studentName: 'Ngo Thi I',
    studentCode: 'SE66778',
    internGroupId: 'grp-01',
    internGroupName: 'Web Development Group A',
    incidentDate: '2024-03-26',
    description:
      'Poor teamwork: Student refused to collaborate with teammates on a critical bug fix.',
    createdAt: '2024-03-27T09:20:00Z',
    createdBy: 'mentor-123',
    createdByName: 'Mentor John Doe',
    universityName: 'FTU',
  },
  {
    id: '10',
    studentId: 'std-010',
    studentName: 'Dang Van J',
    studentCode: 'SE99887',
    internGroupId: 'grp-03',
    internGroupName: 'Data Science Group C',
    incidentDate: '2024-03-27',
    description:
      'Plagiarism: Student submitted work that was largely copied from an online source.',
    createdAt: '2024-03-28T15:30:00Z',
    createdBy: 'mentor-789',
    createdByName: 'Mentor Robert Brown',
    universityName: 'FPT University',
  },
];

const MOCK_STUDENTS = [
  { id: 'std-001', fullName: 'Nguyen Van A', studentId: 'SE12345' },
  { id: 'std-002', fullName: 'Tran Thi B', studentId: 'SE67890' },
  { id: 'std-003', fullName: 'Le Van C', studentId: 'SE54321' },
  { id: 'std-004', fullName: 'Pham Van D', studentId: 'SE11223' },
  { id: 'std-005', fullName: 'Hoang Thi E', studentId: 'SE44556' },
  { id: 'std-006', fullName: 'Do Van F', studentId: 'SE77889' },
  { id: 'std-007', fullName: 'Bui Thi G', studentId: 'SE99001' },
  { id: 'std-008', fullName: 'Vu Van H', studentId: 'SE22334' },
  { id: 'std-009', fullName: 'Ngo Thi I', studentId: 'SE66778' },
  { id: 'std-010', fullName: 'Dang Van J', studentId: 'SE99887' },
];

const MOCK_GROUPS = [
  { id: 'grp-01', name: 'Web Development Group A' },
  { id: 'grp-02', name: 'Mobile App Group B' },
  { id: 'grp-03', name: 'Data Science Group C' },
];

export const violationReportService = {
  async getReports(params) {
    // Artificial delay to simulate network
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [...MOCK_REPORTS];

    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) => r.studentName.toLowerCase().includes(s) || r.studentCode.toLowerCase().includes(s)
      );
    }

    if (params.groupId) {
      filtered = filtered.filter((r) => r.internGroupId === params.groupId);
    }

    if (params.createdBy === 'me') {
      filtered = filtered.filter((r) => r.createdBy === 'mentor-123');
    }

    return {
      data: filtered,
      total: filtered.length,
    };
    // return httpClient.httpGet(BASE_URL, params);
  },

  async getReportById(id) {
    const report = MOCK_REPORTS.find((r) => r.id === id);
    return report || null;
    // return httpClient.httpGet(`${BASE_URL}/${id}`);
  },

  async createReport(payload) {
    console.log('Mock Create:', payload);
    return true;
    // return httpClient.httpPost(BASE_URL, payload);
  },

  async updateReport(id, payload) {
    console.log('Mock Update:', id, payload);
    return true;
    // return httpClient.httpPut(`${BASE_URL}/${id}`, payload);
  },

  async deleteReport(id) {
    console.log('Mock Delete:', id);
    return true;
    // return httpClient.httpDelete(`${BASE_URL}/${id}`);
  },

  async getStudentsForMentor() {
    return MOCK_STUDENTS;
    // return httpClient.httpGet('/mentor/students');
  },

  async getGroupsForMentor() {
    return MOCK_GROUPS;
    // return httpClient.httpGet('/mentor/groups');
  },
};
