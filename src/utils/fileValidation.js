export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

export const MAX_IMAGE_SIZE_MB = 5;

/**
 * Validates a file for image upload.
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} options.onError Callback to show error message
 * @param {Array} options.allowedTypes Custom allowed mime types
 * @param {number} options.maxSize Custom max size in MB
 * @returns {boolean}
 */
export const validateImageFile = (
  file,
  { onError, allowedTypes = IMAGE_MIME_TYPES, maxSize = MAX_IMAGE_SIZE_MB } = {}
) => {
  const isImage = allowedTypes.includes(file.type);

  if (!isImage) {
    const formatNames = allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ');
    onError?.(`Only ${formatNames} formats are supported`);
    return false;
  }

  const isLtSize = file.size / 1024 / 1024 < maxSize;
  if (!isLtSize) {
    onError?.(`Image must be less than ${maxSize}MB`);
    return false;
  }

  return true;
};
