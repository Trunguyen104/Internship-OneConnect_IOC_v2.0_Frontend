import dayjs from 'dayjs';

import {
  ENROLLMENT_STATUS,
  PLACEMENT_STATUS,
} from '@/constants/internship-management/internship-management';
import { httpGet, httpPatch, httpPost, httpPut } from '@/services/http-client.service';

const ENROLLMENT_STATUS_MAP = {
  [ENROLLMENT_STATUS.ACTIVE]: 'ACTIVE',
  [ENROLLMENT_STATUS.WITHDRAWN]: 'WITHDRAWN',
};

const PLACEMENT_STATUS_MAP = {
  [PLACEMENT_STATUS.UNPLACED]: 'UNPLACED',
  [PLACEMENT_STATUS.PLACED]: 'PLACED',
};

const REVERSE_ENROLLMENT_MAP = {
  ACTIVE: ENROLLMENT_STATUS.ACTIVE,
  WITHDRAWN: ENROLLMENT_STATUS.WITHDRAWN,
};

const REVERSE_PLACEMENT_MAP = {
  UNPLACED: PLACEMENT_STATUS.UNPLACED,
  PLACED: PLACEMENT_STATUS.PLACED,
};

const cleanPayload = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined || newObj[key] === '' || newObj[key] === null) delete newObj[key];
  });
  return newObj;
};

const mapStudent = (item) => {
  const student = item.student || item;
  const appStatus = item.internshipApplicationStatus || student.internshipApplicationStatus || 0;
  const entName = item.enterpriseName || student.enterpriseName;

  // AC-11 Sync: Source of truth for Backend is InternshipApplicationStatus
  // 5 = Placed, 4 = PendingAssignment, 1,2,3 = Pending/Applied
  let finalPlacementStatus = 'UNPLACED';

  if (appStatus === 5 || appStatus === 'PLACED' || appStatus === 'Placed') {
    finalPlacementStatus = 'PLACED';
  } else if (
    [1, 2, 3, 4].includes(appStatus) ||
    appStatus === 'Pending' ||
    appStatus === 'PENDING_ASSIGNMENT'
  ) {
    finalPlacementStatus = 'PENDING_ASSIGNMENT';
  } else {
    finalPlacementStatus = 'UNPLACED';
  }

  return {
    ...item,
    id: item.studentId || item.id || student.studentId || student.id,
    studentId: item.studentId || student.studentId,
    studentCode: item.studentCode || student.studentCode,
    studentTermId: item.studentTermId || student.studentTermId,
    name: item.studentName || item.fullName || student.fullName || student.studentName,
    fullName: item.studentName || item.fullName || student.fullName || student.studentName,
    email: item.email || student.email,
    phone: item.phone || student.phone,
    major: item.major || student.major,
    className: item.className || student.className,
    status:
      item.enrollmentStatus === ENROLLMENT_STATUS.WITHDRAWN ||
      student.enrollmentStatus === ENROLLMENT_STATUS.WITHDRAWN
        ? 'WITHDRAWN'
        : 'ACTIVE',
    displayStatus: item.internshipApplicationStatus || student.internshipApplicationStatus || 0,
    applicationStatus: item.internshipApplicationStatus || student.internshipApplicationStatus,
    applicationId: item.applicationId || student.applicationId,
    placementStatus: finalPlacementStatus,
    enterpriseId: item.enterpriseId || student.enterpriseId,
    enterpriseName: entName,
    internPhaseName: item.internPhaseName || student.internPhaseName,
    enrollmentNote: item.enrollmentNote || student.enrollmentNote,
    enrollmentDate: item.enrollmentDate || student.enrollmentDate,
    dateOfBirth: item.dateOfBirth || student.dateOfBirth || item.dob || student.dob,
    midtermFeedback: item.midtermFeedback || student.midtermFeedback || item.midTermFeedback,
    finalFeedback: item.finalFeedback || student.finalFeedback || item.finalTermFeedback,
    createdAt: item.createdAt || student.createdAt,
    updatedAt: item.updatedAt || student.updatedAt,
  };
};

const mapStudentForCreate = (values) => {
  return cleanPayload({
    termId: values.termId,
    fullName: values.fullName,
    studentCode: values.studentCode,
    email: values.email,
    phone: values.phone || null,
    dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
    major: values.major,
  });
};

const mapStudentForUpdate = (values) => {
  return cleanPayload({
    studentTermId: values.studentTermId,
    fullName: values.fullName,
    email: values.email,
    phone: values.phone || null,
    major: values.major,
    dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
    enrollmentDate: values.enrollmentDate
      ? dayjs(values.enrollmentDate).format('YYYY-MM-DD')
      : null,
    enrollmentStatus:
      REVERSE_ENROLLMENT_MAP[values.status] ??
      REVERSE_ENROLLMENT_MAP[values.enrollmentStatus] ??
      ENROLLMENT_STATUS.ACTIVE,
    enrollmentNote: values.enrollmentNote || null,
    placementStatus: REVERSE_PLACEMENT_MAP[values.placementStatus] ?? PLACEMENT_STATUS.UNPLACED,
    enterpriseId: values.enterpriseId || null,
  });
};

export const StudentService = {
  async getAll(termId, params = {}) {
    const { pageNumber, pageSize } = params;

    // AC-11 Sync: Combine personal details (from enrollments) and placement details (from uniassigns)
    // Enrollments API: /terms/{termId}/enrollments (Returns Personal Metadata)
    // UniAssigns API: /uniassigns/students-by-term (Returns Placement/Enterprise Status)
    const [uniRes, enrollRes] = await Promise.all([
      httpGet('/uniassigns/students-by-term', {
        TermId: termId,
        PageNumber: pageNumber || 1,
        PageSize: pageSize || 10,
      }),
      httpGet(`/terms/${termId}/enrollments`, cleanPayload(params)),
    ]);

    const uniData = uniRes?.data || {};
    const uniStudents = uniData.items?.[0]?.students || [];
    const enrollItems = enrollRes?.data?.items || [];

    // Merge Logic: Placement data (uni) is the source of truth for the list,
    // Enrollment data (personal) provides the missing fields like phone, dob, etc.
    const mergedStudents = uniStudents.map((s) => {
      const personal = enrollItems.find(
        (e) => e.studentId === s.studentId || e.studentTermId === s.studentTermId
      );
      // Merge s (placement) onto personal (full details)
      // This ensures personal info is present, but placement status/enterprise info from 's' wins.
      return { ...personal, ...s };
    });

    return {
      ...uniRes,
      data: {
        ...uniData,
        items: [
          {
            ...(uniData.items?.[0] || {}),
            students: mergedStudents,
          },
        ],
      },
    };
  },

  async getById(id) {
    return httpGet(`/student-terms/${id}`);
  },

  async create(termId, data) {
    return httpPost(`/terms/${termId}/enrollments`, data);
  },

  async update(id, data) {
    return httpPut(`/student-terms/${id}`, data);
  },

  async withdraw(termId, id) {
    return this.bulkWithdraw(termId, [id]);
  },

  async importPreview(termId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return httpPost(`/terms/${termId}/enrollments/import-preview`, formData);
  },

  async importConfirm(termId, validRecords) {
    // Ensuring exact field naming matches the ImportStudentsConfirmCommand
    const payload = {
      validRecords: validRecords.map((r) => ({
        studentCode: r.studentCode,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        dateOfBirth: r.dateOfBirth,
        major: r.major,
      })),
    };
    return httpPost(`/terms/${termId}/enrollments/import-confirm`, payload);
  },

  async bulkWithdraw(termId, studentTermIds) {
    return httpPatch(`/terms/${termId}/enrollments/bulk-withdraw`, { termId, studentTermIds });
  },

  async getTemplate(termId) {
    return httpGet(`/terms/${termId}/enrollments/template`, {}, { responseType: 'blob' });
  },

  mapStudent,
  mapStudentForCreate,
  mapStudentForUpdate,
};
