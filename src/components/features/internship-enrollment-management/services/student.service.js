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
  const rawPlacementStatus = item.placementStatus ?? student.placementStatus;
  const entName = item.enterpriseName || student.enterpriseName;

  // Intelligently map placement status based on code and presence of enterprise
  let finalPlacementStatus = 'UNPLACED';

  if (
    rawPlacementStatus === 6 ||
    rawPlacementStatus === 'PLACED' ||
    rawPlacementStatus === 'Placed'
  ) {
    finalPlacementStatus = 'PLACED';
  } else if (rawPlacementStatus === 1) {
    // Current API uses 1 for placed, but check if there's actually an enterprise assigned
    finalPlacementStatus = entName && entName !== '— Unassigned —' ? 'PLACED' : 'UNPLACED';
  } else if (
    rawPlacementStatus === 4 ||
    rawPlacementStatus === 'PENDING_ASSIGNMENT' ||
    rawPlacementStatus === 'Pending'
  ) {
    finalPlacementStatus = 'PENDING_ASSIGNMENT';
  } else if (rawPlacementStatus === 5 || rawPlacementStatus === 'UNPLACED') {
    finalPlacementStatus = 'UNPLACED';
  }

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
    status:
      item.enrollmentStatus === ENROLLMENT_STATUS.WITHDRAWN ||
      student.enrollmentStatus === ENROLLMENT_STATUS.WITHDRAWN
        ? 'WITHDRAWN'
        : 'ACTIVE',
    placementStatus: finalPlacementStatus,
    enterpriseId: item.enterpriseId || student.enterpriseId,
    enterpriseName: entName,
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
    return httpGet(`/terms/${termId}/enrollments`, cleanPayload(params));
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
