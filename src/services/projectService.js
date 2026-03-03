import { httpGet } from './httpClient';

export const ProjectService = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return httpGet(`/projects${query ? `?${query}` : ''}`);
  },
};
