import { httpDelete, httpGet, httpPost } from '@/services/http-client.service';

export const PublicHolidayService = {
  getAll(year) {
    return httpGet('/public-holidays', { year });
  },

  create(payload) {
    return httpPost('/public-holidays', payload);
  },

  delete(id) {
    return httpDelete(`/public-holidays/${id}`);
  },

  sync(year, countryCode = 'VN') {
    return httpPost('/public-holidays/sync', { year, countryCode });
  },
};
