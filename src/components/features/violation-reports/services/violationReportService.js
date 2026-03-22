import httpClient from '@/services/httpClient';

const BASE_URL = '/violationreports';

export const violationReportService = {
  async getReports(params) {
    // Mapping frontend params to backend GetViolationReportsQuery
    const queryParams = {
      PageNumber: params.PageNumber || 1,
      PageSize: params.PageSize || 10,
      SearchTerm: params.SearchTerm || undefined,
      GroupId: params.GroupId || undefined,
      OccurredFrom: params.OccurredFrom || undefined,
      OccurredTo: params.OccurredTo || undefined,
      CreatedById: params.CreatedById || undefined,
      OrderByCreatedAscending: params.OrderByCreatedAscending || false,
    };
    return httpClient.httpGet(BASE_URL, queryParams);
  },

  async getReportById(id) {
    return httpClient.httpGet(`${BASE_URL}/${id}`);
  },

  async createReport(payload) {
    // Payload: { StudentId, OccurredDate, Description }
    return httpClient.httpPost(BASE_URL, payload);
  },

  async updateReport(id, payload) {
    // Payload: { ViolationReportId, StudentId, OccurredDate, Description, LastUpdate, ForceUpdate }
    return httpClient.httpPut(`${BASE_URL}/${id}`, payload);
  },

  async deleteReport(id) {
    return httpClient.httpDelete(`${BASE_URL}/${id}`);
  },

  async getStudentsForMentor(params = {}) {
    // Mentors are part of the enterprise, so we use the enterprise student endpoint
    // status: 1 = ACCEPTED
    return httpClient.httpGet('/enterprises/me/applications', {
      pageSize: 100,
      ...params,
    });
  },

  async getGroupsForMentor(params = {}) {
    // Fetching groups for the enterprise
    return httpClient.httpGet('/internship-groups', {
      pageSize: 100,
      ...params,
    });
  },

  async getGroupDetail(id) {
    return httpClient.httpGet(`/internship-groups/${id}`);
  },
};
