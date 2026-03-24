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
    const finalParams = { ...params };
    if (finalParams.TermId === 'ALL_ACTIVE') {
      delete finalParams.TermId;
    }
    const cleanParams = cleanPayload(finalParams);
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

  async assignMentor(applicationId, data) {
    // Body: { mentorId: uuid, projectName: string }
    return httpPatch(`${BASE_URL}/${applicationId}/assign`, data);
  },

  mapApplication(item) {
    const applicationId =
      item.ApplicationId ||
      item.applicationId ||
      item.studentTermId ||
      item.StudentTermId ||
      item.id;
    const studentId = item.StudentId || item.studentId;
    const termId = item.TermId || item.termId || item.internshipTermId;

    // Align with backend: Pending = 1, Approved = 2, Rejected = 3
    let rawStatus = item.Status !== undefined ? item.Status : item.status;
    if (typeof rawStatus === 'string') {
      if (rawStatus === 'Pending') rawStatus = 1;
      else if (rawStatus === 'Approved') rawStatus = 2;
      else if (rawStatus === 'Rejected') rawStatus = 3;
    }
    const status = rawStatus !== undefined ? parseInt(rawStatus, 10) : 1;

    console.log(`[DEBUG] Member ${item.studentFullName || 'N/A'}:`, {
      applicationId,
      studentId,
      termId,
      status, // 0=Pending, 1=Approved, 3=Rejected
      rawStatus: item.Status || item.status,
    });

    return {
      ...item,
      id: applicationId,
      applicationId,
      studentId: studentId || applicationId,
      termId,
      studentFullName:
        item.studentFullName ||
        item.StudentFullName ||
        item.fullName ||
        item.FullName ||
        item.name ||
        'Unknown Student',
      studentCode: item.studentCode || item.StudentCode || item.code || item.UserCode || '-',
      universityName: item.universityName || item.UniversityName || '-',
      major: item.major || item.Major || '-',
      status,
      appliedAt: item.appliedAt || item.AppliedAt,
      termStatus: item.termStatus || item.TermStatus || item.statusTerm || 0,
      groupName: item.groupName || item.GroupName,
      mentorName: item.mentorName || item.MentorName,
      projectName: item.projectName || item.ProjectName,
    };
  },
};
