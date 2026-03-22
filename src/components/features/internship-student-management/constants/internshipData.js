export const MOCK_MENTORS = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Senior Architect', email: 's.jenkins@oneconnect.vn' },
  { id: 'm2', name: 'Marcus Chen', role: 'Lead Developer', email: 'm.chen@oneconnect.vn' },
  {
    id: 'm3',
    name: 'Elena Rodriguez',
    role: 'Product Manager',
    email: 'e.rodriguez@oneconnect.vn',
  },
  { id: 'm4', name: 'James Wilson', role: 'Data Scientist', email: 'j.wilson@oneconnect.vn' },
];

export const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Web Frontend A',
    track: 'FRONTEND',
    status: 'ACTIVE',
    term: 'Sem 1 - 2024',
    mentorId: 'm1',
    memberCount: 12,
  },
  {
    id: 'g2',
    name: 'Mobile App Dev B',
    track: 'MOBILE',
    status: 'ACTIVE',
    term: 'Sem 1 - 2024',
    mentorId: 'm2',
    memberCount: 8,
  },
];

export const MOCK_STUDENTS = [
  {
    key: '1',
    id: 1,
    fullName: 'Alex Sterling',
    studentId: 'SV001',
    email: 'alex.s@university.edu',
    major: 'Computer Science',
    status: 'PENDING',
    groupId: null,
    mentorId: null,
    placedDate: '2024-03-15',
    avatar: 'AS',
    phone: '098-XXX-XXXX',
    dob: '01/01/2002',
  },
  {
    key: '2',
    id: 2,
    fullName: 'Marcus Chen',
    studentId: 'SV002',
    email: 'm.chen@statepoly.edu',
    major: 'Software Engineering',
    status: 'ACCEPTED',
    groupId: 'g1',
    mentorId: 'm1',
    placedDate: '2024-03-10',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaU9FTU6qNRwJ_VLQVNsjlI5KMYyltjw0mXBvLZWYqHyVr2BxhziIC1287YoOGgEywagsmncipmfU-b_OI5eRpAPbZGVRaGa_z1VLq-soJB72FCBahfmoGVYvApM1QaZqOT3xVrNPlKmo1v_wrg1fVm2N7HtLPu8oPaIPpGYTDxNWUnf1DojH1XbCag9L1aTdiTRA2cEKTEoA6ywVo2KFyGJf-8YeON5kLc5nJWg5FhQOF7eWzm9Gl4yP2RUd_fianSgVV2Km7mBM',
    logs: [
      {
        action: 'Student confirmed internship placement.',
        timestamp: '2024-03-10T09:00:00Z',
        type: 'SYSTEM',
        actor: 'System',
      },
      {
        action: 'Assigned to group Web Frontend A.',
        timestamp: '2024-03-12T14:30:00Z',
        type: 'GROUP_CHANGE',
        actor: 'HR Alice',
      },
      {
        action: 'Assigned mentor Sarah Jenkins.',
        timestamp: '2024-03-15T10:15:00Z',
        type: 'MENTOR_CHANGE',
        actor: 'HR Bob',
      },
    ],
  },
  {
    key: '6',
    id: 6,
    fullName: 'Sophia Lee',
    studentId: 'SV006',
    email: 's.lee@poly.edu',
    major: 'Software Engineering',
    status: 'ACCEPTED',
    groupId: 'g2',
    mentorId: 'm2',
    placedDate: '2024-01-15',
    avatar: 'SL',
  },
];
