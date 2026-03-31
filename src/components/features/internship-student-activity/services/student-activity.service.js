import { httpGet } from '@/services/http-client.service';

// --- MOCK DATA FOR STUDENT ACTIVITY ---
const USE_MOCK = true;

const MOCK_TERMS = [
  { id: 't1', name: 'Spring 2026' },
  { id: 't2', name: 'Summer 2026' },
  { id: 't3', name: 'Winter 2025' },
];

const MOCK_ENTERPRISES = [
  { id: 'e1', name: 'FPT Software' },
  { id: 'e2', name: 'Rikkeisoft' },
  { id: 'e3', name: 'VNG Corporation' },
];

const MOCK_STUDENTS_LIST = [
  {
    id: 's1',
    studentName: 'Nguyen Van A',
    email: 'vana@fptu.edu.vn',
    universityName: 'FPT University',
    enterpriseName: 'FPT Software',
    status: 'ACTIVE',
    logbookSubmitted: 8,
    totalLogbooks: 12,
    evaluationScore: 8.5,
  },
  {
    id: 's2',
    studentName: 'Tran Thi B',
    email: 'thib@fptu.edu.vn',
    universityName: 'FPT University',
    enterpriseName: 'Rikkeisoft',
    status: 'IN_PROGRESS',
    logbookSubmitted: 5,
    totalLogbooks: 12,
    evaluationScore: 7.0,
  },
  {
    id: 's3',
    studentName: 'Le Van C',
    email: 'vanc@fptu.edu.vn',
    universityName: 'FPT University',
    enterpriseName: null,
    status: 'UNASSIGNED',
    logbookSubmitted: 0,
    totalLogbooks: 0,
    evaluationScore: 0,
  },
];

export const StudentActivityService = {
  /**
   * Fetch students for a specific term with activity summaries
   * Note: The backend typically provides 'logbookSubmitted', 'totalLogbooks', etc.
   */
  async getStudentActivities(params = {}) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: {
          items: MOCK_STUDENTS_LIST,
          totalCount: MOCK_STUDENTS_LIST.length,
        },
      };
    }
    // For Uni Admin, we fetch students enrolled in a term
    return httpGet('/uni-admin/internship/students', params);
  },

  async getStudentActivityDetail(studentId, termId = null) {
    // Fetches profile and placement details for Uni Admin
    const params = termId ? { termId } : {};
    return httpGet(`/uni-admin/internship/students/${studentId}`, params);
  },

  async getStudentEvaluations(studentId, termId = null) {
    // Fetches published evaluations (mentor-published)
    const params = termId ? { termId } : {};
    return httpGet(`/uni-admin/internship/students/${studentId}/evaluations`, params);
  },

  async getStudentViolations(studentId, termId = null) {
    // Fetches violation reports for the student
    const params = termId ? { termId } : {};
    return httpGet(`/uni-admin/internship/students/${studentId}/violations`, params);
  },

  async getUniversityTerms() {
    if (USE_MOCK) return { data: MOCK_TERMS };
    return httpGet('/terms');
  },

  async getEnterprises() {
    if (USE_MOCK) return { data: MOCK_ENTERPRISES };
    return httpGet('/enterprises');
  },
};
