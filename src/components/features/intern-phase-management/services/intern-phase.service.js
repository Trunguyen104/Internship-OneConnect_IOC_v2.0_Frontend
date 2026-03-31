import dayjs from 'dayjs';

import httpClient from '@/services/http-client.service';

const BASE_URL = '/internship-phases';

// --- MOCK DATA FOR UI TESTING ---
let MOCK_DATA = [
  {
    id: '1',
    internPhaseId: '1',
    name: 'Spring 2026 Recruitment',
    startDate: '2026-02-01',
    endDate: '2026-05-31',
    majorFields: 'IT, Marketing, Finance',
    capacity: 50,
    placedCount: 42,
    jobPostingCount: 5,
    groupCount: 3,
    description: 'Current active recruitment period for Spring 2026.',
  },
  {
    id: '2',
    internPhaseId: '2',
    name: 'Summer Internship 2026',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    majorFields: 'IT, HR',
    capacity: 30,
    placedCount: 0,
    jobPostingCount: 2,
    groupCount: 0,
    description: 'Upcoming summer internship program.',
  },
  {
    id: '3',
    internPhaseId: '3',
    name: 'Winter 2025 (Ended)',
    startDate: '2025-11-01',
    endDate: '2026-02-01',
    majorFields: 'Marketing, Sales',
    capacity: 25,
    placedCount: 25,
    jobPostingCount: 4,
    groupCount: 2,
    description: 'Completed recruitment for the winter period.',
  },
  {
    id: '4',
    internPhaseId: '4',
    name: 'AI & Data Science Special Phase',
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    majorFields: 'Artificial Intelligence, Data Science',
    capacity: 15,
    placedCount: 10,
    jobPostingCount: 3,
    groupCount: 1,
    description: 'Specialized phase for cutting-edge technologies.',
  },
  {
    id: '5',
    internPhaseId: '5',
    name: 'Q3 Business Operations',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    majorFields: 'Business, Management',
    capacity: 20,
    placedCount: 0,
    jobPostingCount: 1,
    groupCount: 0,
    description: 'Recruiting for business and operations roles.',
  },
  {
    id: '6',
    internPhaseId: '6',
    name: 'Design & UX Workshop Phase',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    majorFields: 'UI/UX Design, Graphic Design',
    capacity: 10,
    placedCount: 8,
    jobPostingCount: 2,
    groupCount: 1,
    description: 'Focusing on creative roles and internship workshops.',
  },
  {
    id: '7',
    internPhaseId: '7',
    name: 'Cybersecurity Intensive',
    startDate: '2026-05-15',
    endDate: '2026-08-15',
    majorFields: 'Cybersecurity, Network',
    capacity: 12,
    placedCount: 0,
    jobPostingCount: 2,
    groupCount: 0,
    description: 'Intensive internship for security enthusiasts.',
  },
  {
    id: '8',
    internPhaseId: '8',
    name: 'Global Talent Program 2026',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    majorFields: 'All Majors',
    capacity: 100,
    placedCount: 0,
    jobPostingCount: 10,
    groupCount: 0,
    description: 'Our largest annual program for international talent.',
  },
  {
    id: '9',
    internPhaseId: '9',
    name: 'Mobile App Dev Bootcamp',
    startDate: '2026-01-01',
    endDate: '2026-03-15',
    majorFields: 'iOS, Android, React Native',
    capacity: 20,
    placedCount: 18,
    jobPostingCount: 3,
    groupCount: 2,
    description: 'Fast-paced mobile development internship.',
  },
  {
    id: '10',
    internPhaseId: '10',
    name: 'E-commerce Management',
    startDate: '2026-04-15',
    endDate: '2026-07-15',
    majorFields: 'E-commerce, Logistics',
    capacity: 25,
    placedCount: 5,
    jobPostingCount: 2,
    groupCount: 1,
    description: 'Managing end-to-end e-commerce operations.',
  },
  {
    id: '11',
    internPhaseId: '11',
    name: 'Embedded Systems 2026',
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    majorFields: 'Electronics, IoT',
    capacity: 15,
    placedCount: 2,
    jobPostingCount: 1,
    groupCount: 1,
    description: 'Hands-on embedded systems development.',
  },
  {
    id: '12',
    internPhaseId: '12',
    name: 'SaaS Architecture Phase',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    majorFields: 'Computer Science, Systems',
    capacity: 40,
    placedCount: 0,
    jobPostingCount: 5,
    groupCount: 0,
    description: 'Designing scalable SaaS architectures.',
  },
  {
    id: '13',
    internPhaseId: '13',
    name: 'Digital Marketing Q4',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    majorFields: 'Marketing, Content Creation',
    capacity: 35,
    placedCount: 0,
    jobPostingCount: 3,
    groupCount: 0,
    description: 'Quarter 4 marketing focus.',
  },
  {
    id: '14',
    internPhaseId: '14',
    name: 'FinTech Innovation Lab',
    startDate: '2026-03-15',
    endDate: '2026-06-15',
    majorFields: 'Finance, Blockchain',
    capacity: 18,
    placedCount: 15,
    jobPostingCount: 4,
    groupCount: 4,
    description: 'Exploring future of finance in our lab.',
  },
  {
    id: '15',
    internPhaseId: '15',
    name: 'Sustainability & Green Tech',
    startDate: '2026-11-01',
    endDate: '2027-02-01',
    majorFields: 'Environmental Science, Engineering',
    capacity: 10,
    placedCount: 0,
    jobPostingCount: 1,
    groupCount: 0,
    description: 'Phase dedicated to eco-friendly tech solutions.',
  },
];

const MOCK_POSTINGS = [
  {
    id: 'p1',
    title: 'Software Engineer Intern',
    status: 'Published',
    applicationCount: 15,
    deadline: '2026-05-30',
    createdAt: '2026-02-10',
  },
  {
    id: 'p2',
    title: 'Marketing Assistant',
    status: 'Closed',
    applicationCount: 8,
    deadline: '2026-05-25',
    createdAt: '2026-02-12',
  },
];

const MOCK_STUDENTS = [
  {
    id: 's1',
    studentName: 'Nguyen Van A',
    email: 'vana@example.com',
    major: 'IT',
    status: 'PLACED',
    universityName: 'FPT University',
    source: 'Self-apply',
    placedDate: '2026-03-20',
    avatarUrl: null,
  },
  {
    id: 's2',
    studentName: 'Le Thi B',
    email: 'thib@example.com',
    major: 'Marketing',
    status: 'IN_PROGRESS',
    universityName: 'UEH University',
    source: 'Uni-assign',
    placedDate: '2026-03-22',
    avatarUrl: null,
  },
];

// Toggle this to switch between real API and mock data
const USE_MOCK = true;

const mapPhase = (item) => {
  if (!item) return null;
  return {
    ...item,
    id: item.phaseId || item.id, // Support both formats
    internPhaseId: item.phaseId || item.id,
    capacity: item.maxStudents !== undefined ? item.maxStudents : item.capacity,
    // Add other mappings if necessary in the future
  };
};

export const InternPhaseService = {
  async getAll(params) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const search = params?.Search?.toLowerCase() || '';
      const includeEnded = params?.IncludeEnded ?? false;
      const statusFilter = params?.Status;

      const today = dayjs().startOf('day');

      const filtered = MOCK_DATA.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(search) ||
          item.majorFields.toLowerCase().includes(search);

        // Status logic for mock filtering
        const start = dayjs(item.startDate).startOf('day');
        const end = dayjs(item.endDate).startOf('day');
        let status = 'ACTIVE';
        if (start.isAfter(today)) status = 'UPCOMING';
        else if (end.isBefore(today)) status = 'ENDED';

        const matchesEnded = includeEnded || status !== 'ENDED';
        const matchesStatus = !statusFilter || status === statusFilter;

        return matchesSearch && matchesEnded && matchesStatus;
      });

      const pageNumber = params?.PageNumber || 1;
      const pageSize = params?.PageSize || 10;
      const start = (pageNumber - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      return {
        items: paginated,
        totalCount: filtered.length,
      };
    }
    const res = await httpClient.httpGet(BASE_URL, params);
    return {
      items: (res?.data?.items || res?.items || []).map(mapPhase),
      totalCount: res?.data?.totalCount || res?.totalCount || 0,
    };
  },

  async getById(id) {
    if (USE_MOCK) {
      return MOCK_DATA.find((item) => item.id === id || item.internPhaseId === id);
    }
    const res = await httpClient.httpGet(`${BASE_URL}/${id}`);
    return mapPhase(res?.data || res);
  },

  async create(payload) {
    if (USE_MOCK) {
      const newId = (Math.max(...MOCK_DATA.map((i) => parseInt(i.id))) + 1).toString();
      const newItem = {
        ...payload,
        id: newId,
        internPhaseId: newId,
        placedCount: 0,
        jobPostingCount: 0,
        groupCount: 0,
        majorFields: Array.isArray(payload.majorFields)
          ? payload.majorFields.join(',')
          : payload.majorFields,
      };
      MOCK_DATA = [newItem, ...MOCK_DATA];
      return newItem;
    }
    const bePayload = {
      ...payload,
      maxStudents: payload.capacity,
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      description: payload.description,
      majorFields: Array.isArray(payload.majorFields)
        ? payload.majorFields.join(',')
        : payload.majorFields,
    };
    const res = await httpClient.httpPost(BASE_URL, bePayload);
    return mapPhase(res?.data || res);
  },

  async update(id, payload) {
    if (USE_MOCK) {
      MOCK_DATA = MOCK_DATA.map((item) =>
        item.id === id || item.internPhaseId === id
          ? {
              ...item,
              ...payload,
              majorFields: Array.isArray(payload.majorFields)
                ? payload.majorFields.join(',')
                : payload.majorFields,
            }
          : item
      );
      return { success: true };
    }
    const bePayload = {
      ...payload,
      maxStudents: payload.capacity,
      phaseId: id,
      majorFields: Array.isArray(payload.majorFields)
        ? payload.majorFields.join(',')
        : payload.majorFields,
    };
    return httpClient.httpPut(`${BASE_URL}/${id}`, bePayload);
  },

  async delete(id) {
    if (USE_MOCK) {
      MOCK_DATA = MOCK_DATA.filter((item) => item.id !== id && item.internPhaseId !== id);
      return { success: true };
    }
    return httpClient.httpDelete(`${BASE_URL}/${id}`);
  },

  async getJobPostings(phaseId, params) {
    if (USE_MOCK) {
      return { data: MOCK_POSTINGS };
    }
    return httpClient.httpGet(`${BASE_URL}/${phaseId}/job-postings`, params);
  },

  async getStudents(phaseId, params) {
    if (USE_MOCK) {
      return { data: MOCK_STUDENTS };
    }
    return httpClient.httpGet(`${BASE_URL}/${phaseId}/students`, params);
  },
};
