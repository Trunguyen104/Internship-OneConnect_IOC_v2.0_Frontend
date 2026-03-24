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
    const finalParams = { ...params };
    if (finalParams.TermId === 'ALL_ACTIVE') delete finalParams.TermId;
    const cleanParams = cleanPayload(finalParams);
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

  async moveStudents(data) {
    // Expected payload: MoveStudentsBetweenGroupsCommand { fromGroupId, toGroupId, studentIds }
    return httpPost(`${BASE_URL}/move-students`, data);
  },

  async addStudents(id, students) {
    // Expected payload: AddStudentsToGroupCommand { internshipId, students: [{ studentId, role }] }
    return httpPost(`${BASE_URL}/students`, { internshipId: id, students });
  },

  async removeStudents(id, studentIds) {
    // Expected payload: RemoveStudentsFromGroupCommand { internshipId, studentIds: [guid1, guid2] }
    return httpDelete(`${BASE_URL}/students`, { internshipId: id, studentIds });
  },

  async archiveGroup(id) {
    return httpPatch(`${BASE_URL}/${id}/archive`);
  },

  async getPlacedStudents(params = {}) {
    const finalParams = { ...params };
    if (finalParams.TermId === 'ALL_ACTIVE') delete finalParams.TermId;
    const cleanParams = cleanPayload(finalParams);
    return httpGet(`${BASE_URL}/placed-students`, cleanParams);
  },

  async getGroupDashboard(id) {
    return httpGet(`${BASE_URL}/${id}/dashboard`);
  },

  async deleteGroup(id) {
    return httpDelete(`${BASE_URL}/${id}`);
  },
};
