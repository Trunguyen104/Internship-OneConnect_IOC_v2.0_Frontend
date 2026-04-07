const VIETNAMESE_TO_ENGLISH_ERRORS = {
  'Ngày bắt đầu không được là hôm nay. Vui lòng chọn ngày ít nhất 1 tuần sau hôm nay hoặc ngày trước đó.':
    'Start date cannot be today. Please select a date at least 1 week after today or a previous date.',
  'Học kỳ này đã tồn tại.': 'This term already exists.',
  'Không thể xóa kỳ thực tập này.': 'Cannot delete this internship term.',
  'Sinh viên đã tham gia kỳ thực tập này.': 'Student has already participated in this term.',
  'Mã sinh viên đã tồn tại.': 'Student code already exists.',
  'Mã sinh viên không hợp lệ. Chỉ được dùng chữ cái thường (a-z), chữ số (0-9) và các ký tự -, _, .':
    'Invalid Student ID. Only lowercase letters (a-z), numbers (0-9), and characters (-, _, .) are allowed.',
  'Email đã tồn tại.': 'Email already exists.',
  'Email này đã được đăng ký trong hệ thống. Mỗi email chỉ được gắn với một tài khoản sinh viên duy nhất.':
    'This email is already registered. Each email must be linked to a unique student account.',
  'Số điện thoại này đã được đăng ký trong hệ thống. Mỗi số điện thoại chỉ được gắn với một tài khoản sinh viên duy nhất.':
    'This phone number is already registered. Each number must be linked to a unique student account.',
  'Số điện thoại đã tồn tại.': 'Phone number already exists.',
  'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.':
    'A system error occurred. Please try again later.',
  'Vui lòng chọn ít nhất 1 sinh viên.': 'Please select at least 1 student.',
  'Tên nhóm đã tồn tại.': 'Group name already exists.',
  'Ngày kết thúc phải sau ngày bắt đầu.': 'End date must be after start date.',
  'Phải có ít nhất 1 bản ghi hợp lệ.': 'There must be at least 1 valid record.',
  'đã được thêm vào kỳ thực tập thành công':
    'This student is already enrolled in the internship term.',
  'Ngày bắt đầu không được là ngày trong quá khứ.': 'Start date cannot be in the past.',
  'Ngày kết thúc không được là ngày trong quá khứ': 'End date cannot be in the past',
  'Tên chu kỳ không được để trống': 'Cycle name is required',
  "'Weight' phải nhỏ hơn hoặc bằng '100'": 'Weight must be less than or equal to 100',
  "'Max Score' phải nhỏ hơn hoặc bằng '100'": 'Max Score must be less than or equal to 100',
  'Rút hàng loạt sinh viên thành công. Các sinh viên đang có vị trí thực tập (Placed) đã được bỏ qua tự động và không bị ảnh hưởng.':
    'Bulk withdrawal successful. Placed students were automatically skipped and remains unaffected.',
  'Rút sinh viên thành công': 'Student withdrawn successfully',
};

/**
 * Translates known Vietnamese error messages to English.
 * Supports partial matching for dynamic messages.
 */
export const translateMessage = (msg) => {
  if (typeof msg !== 'string') return msg;
  const trimmed = msg.trim();

  // 1. Exact match
  if (VIETNAMESE_TO_ENGLISH_ERRORS[trimmed]) return VIETNAMESE_TO_ENGLISH_ERRORS[trimmed];

  // 2. Partial match for dynamic messages (like validation errors with appended details)
  const entry = Object.entries(VIETNAMESE_TO_ENGLISH_ERRORS).find(([vn]) => trimmed.includes(vn));
  if (entry) return entry[1];

  return trimmed;
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
