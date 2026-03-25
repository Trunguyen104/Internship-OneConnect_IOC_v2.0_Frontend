import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

const BASE_URL = '/internship-groups';

const cleanPayload = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined || newObj[key] === '' || newObj[key] === null) {
      delete newObj[key];
    }
  });
  return newObj;
};

export const EnterpriseGroupService = {
  async getGroups(params = {}) {
    return httpGet(BASE_URL, cleanPayload({ ...params }));
  },

  async getGroupDetail(id) {
    return httpGet(`${BASE_URL}/${id}`);
  },

  async createGroup(data) {
    return httpPost(BASE_URL, data);
  },

  async updateGroup(id, data) {
    return httpPut(`${BASE_URL}/${id}`, data);
  },

  async moveStudents(data) {
    const payload = {
      studentIds: data.studentIds,
      fromGroupId: data.fromGroupId,
      toGroupId: data.toGroupId,
    };
    return httpPost(`${BASE_URL}/move-students`, cleanPayload(payload));
  },

  async addStudents(id, students) {
    const formattedStudents = (students || []).map((s) => {
      const roleValue = s.Role || s.role;
      const roleInt = roleValue === 'Leader' || roleValue === 2 ? 2 : 1;

      return {
        studentId: s.StudentId || s.studentId,
        role: roleInt,
      };
    });

    const payload = {
      internshipId: id,
      students: formattedStudents,
    };
    return httpPost(`${BASE_URL}/students`, cleanPayload(payload));
  },

  async removeStudents(id, studentIds) {
    const payload = {
      internshipId: id,
      studentIds: studentIds,
    };
    return httpDelete(`${BASE_URL}/students`, payload);
  },

  async archiveGroup(id) {
    return httpPatch(`${BASE_URL}/${id}/archive`);
  },

  async getPlacedStudents(params = {}) {
    return httpGet(`${BASE_URL}/placed-students`, cleanPayload({ ...params }));
  },

  async getGroupDashboard(id) {
    return httpGet(`${BASE_URL}/${id}/dashboard`);
  },

  async deleteGroup(id) {
    return httpDelete(`${BASE_URL}/${id}`);
  },
};
