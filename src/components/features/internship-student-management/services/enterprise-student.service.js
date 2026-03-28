import { httpGet, httpPatch } from '@/services/http-client.service';

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

    const phaseId =
      item.phaseId ||
      item.PhaseId ||
      item.internshipPhaseId ||
      item.internshipPhase?.id ||
      item.phase?.id ||
      item.termId ||
      item.TermId;

    let rawStatus = item.status !== undefined ? item.status : item.Status;
    if (typeof rawStatus === 'string') {
      const s = rawStatus.toLowerCase();
      if (s === 'pending') rawStatus = 1;
      else if (s === 'approved' || s === 'active' || s === 'placed') rawStatus = 2;
      else if (s === 'rejected') rawStatus = 3;
    }
    const status = rawStatus !== undefined ? parseInt(rawStatus, 10) : 2;

    let rawPhaseStatus =
      item.phaseStatus || item.PhaseStatus || item.termStatus || item.TermStatus || 0;
    if (typeof rawPhaseStatus === 'string') {
      const s = rawPhaseStatus.toLowerCase();
      if (s === 'draft') rawPhaseStatus = 0;
      else if (s === 'open') rawPhaseStatus = 1;
      else if (s === 'inprogress' || s === 'active') rawPhaseStatus = 2;
      else if (s === 'closed' || s === 'ended') rawPhaseStatus = 3;
    }
    const phaseStatus = rawPhaseStatus !== undefined ? parseInt(rawPhaseStatus, 10) : 0;

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
      phaseId,
      phaseId,
      studentFullName:
        item.studentName ||
        item.studentFullName ||
        item.StudentFullName ||
        item.fullName ||
        item.FullName ||
        item.name ||
        'Sinh viên chưa rõ',
      studentEmail: item.studentEmail || item.StudentEmail || item.email || item.Email,
      studentCode,
      universityName: item.universityName || item.UniversityName || '-',
      major: item.major || item.Major || '-',
      status,
      phaseStatus,
      phaseStatus,
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
      phaseName: item.phaseName || item.PhaseName || item.internshipPhase?.name || item.phase?.name,
      startDate:
        item.startDate ||
        item.internshipStartDate ||
        item.internshipPhase?.startDate ||
        item.phase?.startDate,
      endDate:
        item.endDate ||
        item.internshipEndDate ||
        item.internshipPhase?.endDate ||
        item.phase?.endDate,
    };
  },

  async getApplications(params = {}) {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        cleanParams[key] = params[key];
      }
    });
    return httpGet('/enterprises/me/applications', cleanParams);
  },

  async getApplicationDetail(id) {
    return httpGet(`/enterprises/me/applications/${id}`);
  },

  async assignMentor(studentId, data) {
    return httpPatch(`/enterprises/me/students/${studentId}/mentor`, data);
  },

  async getMyEnterprise() {
    return httpGet('/enterprises/mine');
  },
};
