import { httpGet, httpPatch } from '@/services/httpClient';

export const EnterpriseStudentService = {
  mapApplication(item) {
    if (!item) return null;

    const applicationId =
      item.applicationId ||
      item.ApplicationId ||
      item.studentTermId ||
      item.StudentTermId ||
      item.id;

    const personId = item.studentId || item.StudentId || item.userId;

    const studentCode = item.studentCode || item.StudentCode || item.code || 'NO_CODE';

    const uniqueId = applicationId || `${personId}-${studentCode}`;

    const studentIdForPayLoad = personId || applicationId;

    const termId =
      item.termId ||
      item.TermId ||
      item.internshipTermId ||
      item.internshipTerm?.id ||
      item.term?.id ||
      item.term?.termId;

    let rawStatus = item.status !== undefined ? item.status : item.Status;
    if (typeof rawStatus === 'string') {
      const s = rawStatus.toLowerCase();
      if (s === 'pending') rawStatus = 1;
      else if (s === 'approved' || s === 'active' || s === 'placed') rawStatus = 2;
      else if (s === 'rejected') rawStatus = 3;
    }
    const status = rawStatus !== undefined ? parseInt(rawStatus, 10) : 2;

    let rawTermStatus = item.termStatus || item.TermStatus || item.statusTerm || 0;
    if (typeof rawTermStatus === 'string') {
      const s = rawTermStatus.toLowerCase();
      if (s === 'upcoming') rawTermStatus = 1;
      else if (s === 'active') rawTermStatus = 2;
      else if (s === 'ended') rawTermStatus = 3;
      else if (s === 'closed') rawTermStatus = 4;
    }
    const termStatus = rawTermStatus !== undefined ? parseInt(rawTermStatus, 10) : 0;

    // 6. Identify Group Association (Improved detection for ADD vs MOVE)
    const groupId =
      item.groupId ||
      item.GroupId ||
      item.assignedGroupId ||
      item.AssignedGroupId ||
      item.internshipGroupId ||
      item.InternshipGroupId ||
      item.group_id ||
      item.internshipId;

    return {
      ...item,
      id: uniqueId, // Used as rowKey in table and selection list
      applicationId,
      studentId: studentIdForPayLoad, // Passed to API commands
      personId, // Pure person reference
      termId,
      studentFullName:
        item.studentName ||
        item.studentFullName ||
        item.StudentFullName ||
        item.fullName ||
        item.FullName ||
        item.name ||
        'Sinh viên chưa rõ',
      studentCode,
      universityName: item.universityName || item.UniversityName || '-',
      major: item.major || item.Major || '-',
      status,
      termStatus,
      appliedAt: item.appliedAt || item.AppliedAt,
      groupId,
      isAssignedToGroup: item.isAssignedToGroup !== undefined ? item.isAssignedToGroup : !!groupId,
      groupName: item.groupName || item.GroupName || item.assignedGroupName,
      mentorName: item.mentorName || item.MentorName,
      mentorId:
        item.mentorId || item.MentorId || item.mentor?.id || item.mentor?.mentorId
          ? String(item.mentorId || item.MentorId || item.mentor?.id || item.mentor?.mentorId)
          : undefined,
      projectName: item.projectName || item.ProjectName,
      startDate:
        item.startDate ||
        item.internshipStartDate ||
        item.internshipTerm?.startDate ||
        item.term?.startDate,
      endDate:
        item.endDate ||
        item.internshipEndDate ||
        item.internshipTerm?.endDate ||
        item.term?.endDate,
    };
  },

  async getApplications(params) {
    return httpGet('/internship-applications', params);
  },

  async getApplicationDetail(applicationId) {
    return httpGet(`/internship-applications/${applicationId}`);
  },

  async approveApplication(id) {
    return httpPatch(`/internship-applications/${id}/approve`);
  },

  async rejectApplication(id, data) {
    return httpPatch(`/internship-applications/${id}/reject`, data);
  },
};
