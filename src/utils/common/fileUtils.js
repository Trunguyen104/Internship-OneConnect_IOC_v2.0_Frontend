/**
 * Utility for file-related operations.
 */

/**
 * Transforms a URL to force a browser download.
 * Specifically handles Cloudinary URLs by adding the 'fl_attachment' flag.
 *
 * @param {string} url - The original URL of the file.
 * @param {string} fileName - Optional filename for the download.
 * @returns {string} The transformed URL or the original URL if not a Cloudinary link.
 */
export const getDownloadUrl = (url) => {
  if (!url) return '';

  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    // Check if it's already an attachment URL
    if (url.includes('fl_attachment')) return url;

    // Cloudinary URL format: .../upload/[transformations]/v[version]/...
    // We insert fl_attachment into the transformations segment
    if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
  }

  // Fallback for non-Cloudinary or unrecognized patterns
  return url;
};

/**
 * Triggers a file download from a Blob or data chunk.
 *
 * @param {Blob|any} data - The file data (blob or stream data)
 * @param {string} defaultFileName - Fallback name if header is missing
 * @param {object} headers - Optional Axios/Fetch headers to extract filename from
 */
export const downloadBlob = (data, defaultFileName = 'download', headers = {}) => {
  if (!data) return;

  // Extract filename from Content-Disposition if available
  let fileName = defaultFileName;
  const contentDisposition = headers['content-disposition'] || headers['Content-Disposition'];

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
    if (filenameMatch?.[1]) {
      fileName = filenameMatch[1];
    }
  }

  // Create Blob and URL
  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = window.URL.createObjectURL(blob);

  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);
};
