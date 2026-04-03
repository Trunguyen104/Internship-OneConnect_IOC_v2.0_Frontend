import { httpGet } from '@/services/http-client.service';

const BASE_URL = '/internship-phases';

export const EnterprisePhaseService = {
  async getPhases(params = {}) {
    return httpGet(BASE_URL, {
      PageIndex: params.PageIndex || 1,
      PageSize: params.PageSize || 50,
      ...params,
    });
  },
  async getPhaseById(id) {
    return httpGet(`${BASE_URL}/${id}`);
  },
  async getMyPhases() {
    return httpGet(`${BASE_URL}/me`);
  },
};
