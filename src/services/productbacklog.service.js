// src/services/productbacklog.service.js
import httpClient from './httpClient';

export const productBacklogService = {
  async getAll() {
    // nếu bạn đang dùng mockServer/MSW thì endpoint này sẽ được intercept
    // còn nếu chưa cấu hình mock thì bạn có thể đổi sang import JSON trực tiếp ở UI
    const res = await httpClient.get('/product-backlog');
    return res.data;
  },
};
