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
    TermId: values.termId,
    FullName: values.fullName,
    StudentCode: values.studentCode,
    Email: values.email,
    Phone: values.phone || null,
    DateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
    Major: values.major,
  });
};

const mapStudentForUpdate = (values) => {
  return {
    StudentTermId: values.studentTermId,
    FullName: values.fullName,
    Email: values.email,
    Phone: values.phone || null,
    Major: values.major,
    DateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
    EnrollmentDate: values.enrollmentDate
      ? dayjs(values.enrollmentDate).format('YYYY-MM-DD')
      : null,
    EnrollmentStatus:
      REVERSE_ENROLLMENT_MAP[values.status] ??
      REVERSE_ENROLLMENT_MAP[values.enrollmentStatus] ??
      ENROLLMENT_STATUS.ACTIVE,
    EnrollmentNote: values.enrollmentNote || null,
    PlacementStatus: REVERSE_PLACEMENT_MAP[values.placementStatus] ?? PLACEMENT_STATUS.UNPLACED,
    EnterpriseId: values.enterpriseId || null,
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
