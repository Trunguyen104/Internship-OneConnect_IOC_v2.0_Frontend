import httpClient from '@/services/http-client.service';

const BASE_URL = '/internship-phases';

const mapPhase = (item) => {
  if (!item) return null;
  return {
    ...item,
    id: item.phaseId || item.id, // Support both formats
    internPhaseId: item.phaseId || item.id,
    capacity: item.capacity !== undefined ? item.capacity : item.maxStudents,
    // Add other mappings if necessary in the future
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

  async getJobPostings(_phaseId, _params) {
    // Backend endpoint not yet implemented in provided C# controller
    // Returning empty array directly to avoid 404 errors in console/network tab
    return { data: [], totalCount: 0 };
  },

  async getStudents(_phaseId, _params) {
    // Backend endpoint not yet implemented in provided C# controller
    // Returning empty array directly to avoid 404 errors in console/network tab
    return { data: [], totalCount: 0 };
  },
};
