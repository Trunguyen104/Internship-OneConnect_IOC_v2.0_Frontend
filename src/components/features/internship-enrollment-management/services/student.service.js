import { httpGet, httpPatch, httpPost, httpPut } from '@/services/httpClient';

import {
  ENROLLMENT_STATUS_MAP,
  PLACEMENT_STATUS_MAP,
  REVERSE_ENROLLMENT_MAP,
  REVERSE_PLACEMENT_MAP,
} from '../constants/enrollment';

const cleanPayload = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined || newObj[key] === '') delete newObj[key];
  });
  return newObj;
};

const mapStudent = (item) => {
  const student = item.student || item;

  return {
    ...item,
    id: item.studentCode || student.studentCode,
    studentCode: item.studentCode || student.studentCode,
    studentId: item.studentId || student.studentId,
    studentTermId: item.studentTermId || student.studentTermId,
    name: item.fullName || student.fullName,
    fullName: item.fullName || student.fullName,
    email: item.email || student.email,
    phone: item.phone || student.phone,
    major: item.major || student.major,
    status: ENROLLMENT_STATUS_MAP[item.enrollmentStatus || student.enrollmentStatus] || 'ACTIVE',
    placementStatus:
      PLACEMENT_STATUS_MAP[item.placementStatus || student.placementStatus] || 'UNPLACED',
    enterpriseId: item.enterpriseId || student.enterpriseId,
    enterpriseName: item.enterpriseName || student.enterpriseName,
    enrollmentDate: item.enrollmentDate || student.enrollmentDate,
    enrollmentNote: item.enrollmentNote || student.enrollmentNote,
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
    phone: values.phone,
    dateOfBirth: values.dateOfBirth,
    major: values.major,
  });
};

const mapStudentForUpdate = (values) => {
  return {
    studentTermId: values.studentTermId,
    fullName: values.fullName,
    email: values.email,
    phone: values.phone || null,
    major: values.major,
    dateOfBirth: values.dateOfBirth || null,
    enrollmentDate: values.enrollmentDate || null,
    enrollmentStatus:
      REVERSE_ENROLLMENT_MAP[values.status] ??
      REVERSE_ENROLLMENT_MAP[values.enrollmentStatus] ??
      ENROLLMENT_STATUS.ACTIVE,
    enrollmentNote: values.enrollmentNote || null,
    placementStatus: REVERSE_PLACEMENT_MAP[values.placementStatus] ?? PLACEMENT_STATUS.UNPLACED,
    enterpriseId: values.enterpriseId || null,
  };
};

export const StudentService = {
  async getAll(termId, params = {}) {
    return httpGet(`/terms/${termId}/enrollments`, params);
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

  async withdraw(id) {
    return httpPatch(`/student-terms/${id}/withdraw`);
  },

  async restore(id) {
    return httpPatch(`/student-terms/${id}/restore`);
  },

  async importPreview(termId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return httpPost(`/terms/${termId}/enrollments/import-preview`, formData);
  },

  async importConfirm(termId, validRecords) {
    // Ensuring exact field naming matches the ImportStudentsConfirmCommand
    const payload = {
      ValidRecords: validRecords.map((r) => ({
        StudentCode: r.studentCode,
        FullName: r.fullName,
        Email: r.email,
        Phone: r.phone,
        DateOfBirth: r.dateOfBirth,
        Major: r.major,
      })),
    };
    return httpPost(`/terms/${termId}/enrollments/import-confirm`, payload);
  },

  async bulkWithdraw(termId, studentTermIds) {
    return httpPatch(`/terms/${termId}/enrollments/bulk-withdraw`, { studentTermIds });
  },

  async getTemplate(termId) {
    return httpGet(`/terms/${termId}/enrollments/template`, {}, { responseType: 'blob' });
  },

  mapStudent,
  mapStudentForCreate,
  mapStudentForUpdate,
};
