import httpClient from '@/services/http-client.service';

const BASE_URL = '/internship-phases';

const mapPhase = (item) => {
  if (!item) return null;
  return {
    ...item,
    id: item.phaseId || item.id, // Support both formats
    internPhaseId: item.phaseId || item.id,
    capacity: item.capacity !== undefined ? item.capacity : item.maxStudents,
    jobPostingCount: item.jobPostingCount ?? item.jobPostingsCount ?? item.jobPostings?.length ?? 0,
    placedCount:
      item.placedCount ??
      (item.capacity !== undefined && item.remainingCapacity !== undefined
        ? item.capacity - item.remainingCapacity
        : 0),
  };
};

export const InternPhaseService = {
  async getAll(params) {
    const res = await httpClient.httpGet(BASE_URL, params);
    // Support both direct response and wrapped in { data: { ... } }
    const responseData = res?.data || res;
    return {
      items: (responseData?.items || []).map(mapPhase),
      totalCount: responseData?.totalCount || 0,
    };
  },

  async getById(id) {
    const res = await httpClient.httpGet(`${BASE_URL}/${id}`);
    return mapPhase(res?.data || res);
  },

  async create(payload) {
    const bePayload = {
      enterpriseId: payload.enterpriseId,
      name: payload.name,
      startDate: payload.startDate, // Should be YYYY-MM-DD
      endDate: payload.endDate,
      capacity: Number(payload.capacity),
      description: payload.description,
      majorFields: Array.isArray(payload.majorFields)
        ? payload.majorFields.join(',')
        : payload.majorFields,
    };
    const res = await httpClient.httpPost(BASE_URL, bePayload);
    return mapPhase(res?.data || res);
  },

  async update(id, payload) {
    const bePayload = {
      phaseId: id,
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      capacity: Number(payload.capacity),
      description: payload.description,
      majorFields: Array.isArray(payload.majorFields)
        ? payload.majorFields.join(',')
        : payload.majorFields,
    };
    return httpClient.httpPut(`${BASE_URL}/${id}`, bePayload);
  },

  async delete(id) {
    return httpClient.httpDelete(`${BASE_URL}/${id}`);
  },

  async getJobPostings(phaseId, params) {
    try {
      const res = await httpClient.httpGet(`${BASE_URL}/${phaseId}/job-postings`, params);
      return res?.data || res;
    } catch {
      // Fallback: This endpoint might not exist yet, DetailView uses initialData from getById
      return { data: [], totalCount: 0 };
    }
  },

  async getGroups(phaseId, params) {
    try {
      const res = await httpClient.httpGet('/internship-groups', {
        ...params,
        phaseId: phaseId,
      });
      const responseData = res?.data || res;
      // Backend might return array directly or wrapped in items
      const items = responseData?.items || (Array.isArray(responseData) ? responseData : []);
      return {
        items: items,
        totalCount: responseData?.totalCount || items.length || 0,
      };
    } catch {
      return { items: [], totalCount: 0 };
    }
  },

  async getStudents(phaseId) {
    try {
      // AC-11 Fix: Backend does NOT have /{phaseId}/students.
      // Students are included in the placedStudents field of the phase detail.
      const phase = await this.getById(phaseId);
      const students = phase?.placedStudents || [];

      return {
        data: students,
        totalCount: students.length || 0,
      };
    } catch {
      return {
        data: [],
        totalCount: 0,
      };
    }
  },
};
