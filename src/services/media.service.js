import { httpPost } from '@/services/http-client.service';

export const mediaService = {
  /**
   * Upload an image to the server
   * @param {File} file - The file object to upload
   * @param {string} folder - Destination folder (Universities, Enterprises, etc.)
   * @returns {Promise<ApiResponse<string>>} - Response containing the public URL
   */
  uploadImage(file, folder = 'General') {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Folder', folder);

    return httpPost('/uploads/image', formData);
  },
};
