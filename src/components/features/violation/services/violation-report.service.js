import httpClient from '@/services/http-client.service';

const BASE_URL = '/violationreports';

export const violationReportService = {
  async getReports(params) {
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
    const response = await httpClient.httpGet(BASE_URL, queryParams);
    if (response?.data?.items) {
      response.data.items = response.data.items.map((item) => {
        const id = item.violationReportId || item.id;
        return {
          ...item,
          violationReportId: typeof id === 'string' ? id.toLowerCase() : id,
        };
      });
    }
    return response;
  },

  async getReportById(id) {
    const response = await httpClient.httpGet(`${BASE_URL}/${id}`);
    const data = response?.data || response;
    const rawId = data?.violationReportId || data?.id;
    if (data && rawId) {
      data.violationReportId = typeof rawId === 'string' ? rawId.toLowerCase() : rawId;
    }
    return response;
  },
  async getGroupsForMentor(params = {}) {
    const response = await httpClient.httpGet('/internship-groups', {
      pageSize: 100,
      ...params,
    });

    if (response?.data?.items) {
      response.data.items = response.data.items.map((g) => {
        const gid = g.internshipGroupId || g.id;
        return {
          ...g,
          internshipGroupId: typeof gid === 'string' ? gid.toLowerCase() : gid,
          id: typeof gid === 'string' ? gid.toLowerCase() : gid,
        };
      });
    }
    return response;
  },
};
