import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

const BASE_URL = '/internship-groups';

const cleanPayload = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined || newObj[key] === '' || newObj[key] === null) delete newObj[key];
  });
  return newObj;
};

export const EnterpriseGroupService = {
  async getGroups(params = {}) {
    const cleanParams = cleanPayload(params);
    return httpGet(BASE_URL, cleanParams);
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

  async assignMentor(id, mentorId) {
    return httpPatch(`${BASE_URL}/${id}/assign-mentor`, { mentorId });
  },

  async addStudents(id, studentIds) {
    // Expected payload: { studentIds: [guid1, guid2] }
    return httpPatch(`${BASE_URL}/${id}/add-students`, { studentIds });
  },

  async removeStudent(id, studentId) {
    return httpPatch(`${BASE_URL}/${id}/remove-student`, { studentId });
  },

  async archiveGroup(id) {
    return httpPatch(`${BASE_URL}/${id}/archive`);
  },

  async deleteGroup(id) {
    return httpDelete(`${BASE_URL}/${id}`);
  },
};
