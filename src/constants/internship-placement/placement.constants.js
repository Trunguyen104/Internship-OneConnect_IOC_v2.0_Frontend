export const PLACEMENT_STATUS = {
  // Overall Student Status (StudentStatus Enum)
  NO_INTERNSHIP: 1,
  APPLIED: 2,
  INTERNSHIP_IN_PROGRESS: 3,
  COMPLETED: 4,
  UNPLACED: 5,
  PLACED: 6,

  // Application specific (from InternshipApplicationStatus)
  PENDING_ASSIGNMENT: 4,
};

export const PLACEMENT_STATUS_LABELS = {
  [PLACEMENT_STATUS.NO_INTERNSHIP]: 'No Internship',
  [PLACEMENT_STATUS.APPLIED]: 'Applied',
  [PLACEMENT_STATUS.INTERVIEWING]: 'Interviewing', // Fallback for conflict
  [PLACEMENT_STATUS.OFFERED]: 'Offered', // Fallback for conflict
  [PLACEMENT_STATUS.INTERNSHIP_IN_PROGRESS]: 'In Progress',
  [PLACEMENT_STATUS.COMPLETED]: 'Completed',
  [PLACEMENT_STATUS.UNPLACED]: 'Unplaced',
  [PLACEMENT_STATUS.PLACED]: 'Placed',
  [PLACEMENT_STATUS.PENDING_ASSIGNMENT]: 'Pending Assignment',
};

export const PLACEMENT_STATUS_VARIANTS = {
  [PLACEMENT_STATUS.NO_INTERNSHIP]: 'muted',
  [PLACEMENT_STATUS.UNPLACED]: 'muted',
  [PLACEMENT_STATUS.APPLIED]: 'info-soft',
  [PLACEMENT_STATUS.INTERNSHIP_IN_PROGRESS]: 'success-soft',
  [PLACEMENT_STATUS.PLACED]: 'success-soft',
  [PLACEMENT_STATUS.COMPLETED]: 'secondary',
  [PLACEMENT_STATUS.PENDING_ASSIGNMENT]: 'warning-soft',
  2: 'info-soft', // Interviewing fallback
  3: 'warning-soft', // Offered fallback
};

export const APPLICATION_STATUS = {
  APPLIED: 1,
  INTERVIEWING: 2,
  OFFERED: 3,
  PENDING_ASSIGNMENT: 4,
  PLACED: 5,
  REJECTED: 6,
  WITHDRAWN: 7,
};

export const SEMESTER_STATUS = {
  UPCOMING: 1,
  ACTIVE: 2,
  ENDED: 3,
  CLOSED: 4,
};

export const PLACEMENT_UI_TEXT = {
  STATUS_LABELS: {
    PENDING: 'Pending',
    BLOCKED: 'BLOCKED',
    BLOCKED_MIXED: 'Blocked',
    NEW: 'Mới',
  },
  TABLE: {
    FULL_NAME: 'FULL NAME',
    EMAIL: 'EMAIL',
    MAJOR: 'MAJOR',
    ENTERPRISE: 'ENTERPRISE',
    STATUS: 'PLACEMENT STATUS',
    LOGBOOK: 'LOGBOOK',
    ACTION: 'ACTION',
    UNASSIGNED: '— Unassigned —',
    STUDENTS_SELECTED: 'Students selected',
    ACTION_ASSIGN: 'Assign',
    ACTION_CHANGE: 'Change',
    ACTION_CANCEL: 'Cancel Placement',
    SELECTED: 'Selected',
  },
  PAGE: {
    TITLE: 'Placement Management',
    SUBTITLE: 'Assign enterprises and intern phases to students.',
    TERM_LABEL: 'Selected Term',
    INITIALIZING: 'Initializing placement data...',
    SELECT_TERM_PLACEHOLDER: 'Select a term...',
    ACTIVE_SUFFIX: '(Active)',
    EMPTY_STATE: {
      ICON: '📭',
      TITLE: 'No Semester Selected',
      DESC: 'Please select an active internship semester from the dropdown to manage placements.',
    },
  },
  POPOVER: {
    QUICK_ASSIGNMENT: 'Gán Nhanh Doanh Nghiệp',
    SEARCH_PLACEHOLDER: 'Tìm doanh nghiệp...',
    SELECT_PHASE: 'Chọn giai đoạn...',
    ASSIGN: 'Gán',
    CANCEL: 'Hủy',
    REASSIGN_TITLE: 'Xác nhận đổi Enterprise',
    REASSIGN_CONFIRM_BTN: 'Xác nhận đổi',
    GOT_IT: 'Đã hiểu',
    CONFLICT_TITLE: 'Xung đột tự ứng tuyển',
    CONFLICT_DESC: 'Sinh viên đang có đơn tự ứng tuyển Active tại doanh nghiệp này.',
    CONFLICT_ERROR: (name, ent, status) =>
      `Sinh viên ${name} đang có đơn tự ứng tuyển đang xử lý tại ${ent} (trạng thái: ${status}). Vui lòng chọn doanh nghiệp khác hoặc yêu cầu sinh viên rút đơn trước.`,
    SUCCESS: (ent, stu) => `Đã gửi chỉ định [${ent}] cho [${stu}]. Đang chờ doanh nghiệp xác nhận.`,
    REASSIGN_CONFIRM: (name, oldEnt, newEnt) =>
      `${name} đang được assign tại ${oldEnt}. Xác nhận sẽ hủy placement cũ và gửi chỉ định mới đến ${newEnt} — chờ doanh nghiệp xác nhận. Bạn có muốn tiếp tục?`,
  },
  ACTIONS: {
    ASSIGN_TITLE: 'Assign Enterprise',
    CHANGE_TITLE: 'Change Enterprise',
    CANCEL_TITLE: 'Hủy Placement',
    ENDED_TOOLTIP: 'Không thể thay đổi placement khi kỳ đã kết thúc.',
    DATA_EXISTS_TOOLTIP: (name, ent) =>
      `Không thể đổi enterprise cho ${name}. Sinh viên này đã có dữ liệu thực tập (logbook / sprint / đánh giá) tại ${ent}. Vui lòng liên hệ quản trị viên hệ thống nếu cần xử lý đặc biệt.`,
  },
  MODALS: {
    BULK_ASSIGN: {
      TITLE: (count) => `Assign enterprise cho ${count} sinh viên`,
      TARGET_LABEL: 'TARGET ENTERPRISE & PHASE',
      STUDENTS_LABEL: 'DANH SÁCH SINH VIÊN SẼ BỊ ẢNH HƯỞNG',
      ELIGIBLE_LABEL: (count) => `Có thể assign (${count})`,
      BLOCKED_LABEL: (count) => `Bị block do xung đột (${count})`,
      CONFLICT_REASON: (status) => `Đơn tự ứng tuyển: ${status}`,
      CONFIRM: 'Xác nhận',
      CANCEL: 'Hủy',
      CAPACITY_ERROR: (phase, ent, remaining, selecting) =>
        `Intern Phase ${phase} của ${ent} chỉ còn ${remaining} slot. Bạn đang assign ${selecting} sinh viên. Vui lòng giảm số lượng hoặc chọn phase/doanh nghiệp khác.`,
      CONFLICT_MSG: (count) => `${count} sinh viên có xung đột tự ứng tuyển tại doanh nghiệp này.`,
      CONFLICT_DESC: 'Chỉ định bị block theo AC-11 cho những sinh viên này.',
      REASSIGN_WARNING: (count) =>
        `${count} sinh viên đã có chỉ định hoặc placement. Xác nhận sẽ hủy chỉ định cũ và tạo chỉ định mới.`,
    },

    BULK_REASSIGN: {
      TITLE: (count) => `Đổi enterprise cho ${count} sinh viên`,
      IMPACT_TITLE: 'Thông tin quan trọng',
      IMPACT_DESC: (count) =>
        `${count} sinh viên đang được assign tại các enterprise khác nhau. Xác nhận sẽ hủy placement cũ và gửi chỉ định mới đến enterprise mới — chờ doanh nghiệp xác nhận.`,
      TARGET_LABEL: 'NEW ENTERPRISE & PHASE',
      ELIGIBLE_LABEL: (count) => `Có thể đổi (${count})`,
      BLOCKED_LABEL: (count) => `Bị block (${count})`,
      ALL_BLOCKED_ERROR:
        'Không có sinh viên nào trong danh sách có thể đổi enterprise. Tất cả đã có dữ liệu thực tập.',
      BLOCKED_REASON: 'Đã có dữ liệu thực tập (Logbook/Sprint/Evaluation)',
      CONFIRM: 'Xác nhận đổi',
      CANCEL: 'Hủy',
      CURRENT_ENTERPRISE_FALLBACK: 'Doanh nghiệp cũ',
      ARROW: '→',
      SUCCESS: (ent, count) =>
        `Đã gửi chỉ định mới cho ${count} sinh viên sang ${ent}. Đang chờ doanh nghiệp xác nhận.`,
    },
    BULK_UNASSIGN: {
      TITLE: (count) => `Hủy placement cho ${count} sinh viên`,
      WARNING_TITLE: 'Thông tin quan trọng',
      WARNING_DESC:
        'Hệ thống sẽ thực hiện hủy placement hiện tại của các sinh viên hợp lệ. Hành động này sẽ thông báo đến doanh nghiệp và hoàn trả slot thực tập (nếu đã Placed).',
      ELIGIBLE_LABEL: (count) => `Có thể hủy (${count})`,
      BLOCKED_LABEL: (count) => `Bị block (${count})`,
      EMPTY_PLACEMENTS_ERROR:
        'Không có sinh viên nào đang ở trạng thái Placed hoặc Pending Assignment trong danh sách đã chọn.',
      ALL_BLOCKED_ERROR:
        'Không có sinh viên nào trong danh sách có thể hủy placement. Tất cả đã có dữ liệu thực tập.',
      EMPTY_ELIGIBLE: 'No eligible students for unassignment.',
      SUCCESS: (count) => `Đã hủy chỉ định của ${count} sinh viên.`,
      CONFIRM: 'Xác nhận hủy',
      CANCEL: 'Hủy',
    },
  },
  SELECT: {
    PHASE_PLACEHOLDER: 'Chọn một Phase...',
    LEFT: 'slot',
    SLOT_LABEL: 'Còn',
    MAJORS: 'Ngành nhận:',
  },
};
