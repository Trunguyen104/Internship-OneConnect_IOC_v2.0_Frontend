import { httpGet, httpPost, httpPut, httpDelete } from '@/services/httpClient';

const mapStudent = (student) => ({
  ...student,
  id: student.id || student.studentId || student.studentCode,
  name: student.name || student.fullName,
  email: student.email || student.studentEmail,
  major: student.major || student.majorName,
  status: student.status || 'INTERNSHIP',
});

export const StudentService = {
  async getAll(params = {}) {
    // Currently using mock logic since the user was using MOCK_STUDENTS
    return { data: { items: [], totalCount: 0 } };
  },

  async getById(id) {
    // return httpGet(`/students/${id}`);
    return { data: null };
  },

  async create(data) {
    // return httpPost('/students', data);
    return { data };
  },

  async update(id, data) {
    // return httpPut(`/students/${id}`, data);
    return { data };
  },

  async delete(id) {
    // return httpDelete(`/students/${id}`);
    return { success: true };
  },

  async importStudents(students) {
    // return httpPost('/students/import', { students });
    return { data: students };
  },

  mapStudent,
};
