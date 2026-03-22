import { httpGet, httpPatch } from '@/services/httpClient';

const BASE_URL = '/enterprises/me/applications';

const cleanPayload = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined || newObj[key] === '' || newObj[key] === null) delete newObj[key];
  });
  return newObj;
};

export const EnterpriseStudentService = {
  async getApplications(params = {}) {
    const cleanParams = cleanPayload(params);
    return httpGet(BASE_URL, cleanParams);
  },

  async getApplicationDetail(applicationId) {
    return httpGet(`${BASE_URL}/${applicationId}`);
  },

  async acceptApplication(applicationId) {
    return httpPatch(`${BASE_URL}/${applicationId}/accept`);
  },

  async rejectApplication(applicationId, reason) {
    return httpPatch(`${BASE_URL}/${applicationId}/reject`, { reason });
  },

  mapApplication(item) {
    return {
      ...item,
      id: item.applicationId || item.studentId || item.studentTermId || item.id,
      studentFullName: item.studentFullName || item.fullName || item.name || 'Unknown Student',
      studentCode: item.studentCode || item.code || '-',
      status: item.status !== undefined ? item.status : item.enrollmentStatus,
      isPlaced: item.placementStatus === 1,
    };
  },
};
