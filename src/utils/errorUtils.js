const VIETNAMESE_TO_ENGLISH_ERRORS = {
  'Ngày bắt đầu không được là hôm nay. Vui lòng chọn ngày ít nhất 1 tuần sau hôm nay hoặc ngày trước đó.':
    'Start date cannot be today. Please select a date at least 1 week after today or a previous date.',
  'Học kỳ này đã tồn tại.': 'This term already exists.',
  'Không thể xóa kỳ thực tập này.': 'Cannot delete this internship term.',
  'Sinh viên đã tham gia kỳ thực tập này.': 'Student has already participated in this term.',
  'Mã sinh viên đã tồn tại.': 'Student code already exists.',
  'Email đã tồn tại.': 'Email already exists.',
  'Vui lòng chọn ít nhất 1 sinh viên.': 'Please select at least 1 student.',
  'Tên nhóm đã tồn tại.': 'Group name already exists.',
  'Ngày kết thúc phải sau ngày bắt đầu.': 'End date must be after start date.',
  'Phải có ít nhất 1 bản ghi hợp lệ.': 'There must be at least 1 valid record.',
};

/**
 * Translates known Vietnamese error messages to English.
 */
const translateMessage = (msg) => {
  if (typeof msg !== 'string') return msg;
  const trimmed = msg.trim();
  return VIETNAMESE_TO_ENGLISH_ERRORS[trimmed] || trimmed;
};

/**
 * Extracts detailed error message from API response error.
 * Handles validationErrors, errors array, and single error message.
 * @param {Error} error - The error object thrown by httpClient.
 * @param {string} defaultMessage - The fallback message if no detail is found.
 * @returns {string} The extracted error message.
 */
export const getErrorDetail = (error, defaultMessage = 'An unexpected error occurred') => {
  const errorData = error.data || error.response?.data;

  if (!errorData) return translateMessage(error.message) || defaultMessage;

  let detail = null;

  // 1. Handle validationErrors (FluentValidation style) - Highest priority
  if (errorData.validationErrors && typeof errorData.validationErrors === 'object') {
    const vals = Object.values(errorData.validationErrors).flat();
    if (vals.length > 0 && vals[0]) {
      detail = vals[0];
    }
  }

  // 2. Handle errors array
  if (!detail && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    detail = errorData.errors[0];
  }

  // 3. Handle single error string in 'errors' field
  if (!detail && typeof errorData.errors === 'string' && errorData.errors.length > 0) {
    detail = errorData.errors;
  }

  // 4. Handle 'message' property only if it's not a generic "Validation Error" or similar
  if (
    !detail &&
    errorData.message &&
    !['Validation Error', 'Error', 'Exception'].includes(errorData.message)
  ) {
    detail = errorData.message;
  }

  const finalMessage =
    translateMessage(detail) || translateMessage(error.message) || defaultMessage;
  return finalMessage;
};
