import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleCheckIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  DatabaseIcon,
  GlobeIcon,
} from "lucide-react";

const MIME_TYPES = {
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".bmp": "image/bmp",

  // Videos
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".m3u8": "application/x-mpegURL",
  ".ts": "video/mp2t",

  // Soundtracks
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",

  // Documents
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".xml": "application/xml",
  ".md": "text/markdown",
  ".html": "text/html",
};

const VALID_PATTERN = {
  NAME: /^[\p{L}][\p{L} ]*[\p{L}]$/u,
  EMAIL: /^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^0[35789][0-9]{8}$/,
  USERNAME: /^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/,
  PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+\-=]{6,}$/,
  HOST: /^(localhost|(([a-z0-9\-]+\.)*[a-z]{2,})|(\d{1,3}\.){3}\d{1,3}|\[([0-9a-f:]+)\])$/,
  PORT: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  COLOR_CODE: /^#[0-9A-F]{6}$/i,
  MONEY: /^-?\d+(\.\d+)?$/,
};

const API_URL = {
  MASTER_API: "https://finance-master-jmdi.onrender.com",
  TENANT_API: "https://finance-tenant.onrender.com",
  MEDIA_API: "https://finance-cache.onrender.com",
  SOCKET_URL: "wss://finance-socket.onrender.com/ws",
};

const API_HEADER = {
  X_TENANT: "X-tenant",
};

const ERROR_CODE = {
  SYSTEM_NOT_READY: "ERROR-SYSTEM-NOT-READY",
};

const AUTH_TYPE = {
  NONE: "none",
  BEARER: "bearer",
  BASIC: "basic",
};

const GRANT_TYPE = {
  PASSWORD: "password",
  CUSTOMER: "customer",
  EMPLOYEE: "employee",
};

const ENV = {
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_CLIENT_SECRET,
  STORAGE_KEY: import.meta.env.VITE_STORAGE_KEY,
};

const LOCAL_STORAGE = {
  ACCESS_TOKEN: "portal_access_token",
  COLLAPSED_GROUPS: "portal_collapsed_groups",
  SESSION_KEY: "portal_session_key",
};

const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const ALIGNMENT = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
};

const GRANT_TYPE_MAP = {
  CUSTOMER: {
    value: GRANT_TYPE.CUSTOMER,
    label: "Khách hàng",
    className: "bg-yellow-900 text-yellow-300",
  },
  EMPLOYEE: {
    value: GRANT_TYPE.EMPLOYEE,
    label: "Nhân viên",
    className: "bg-red-900 text-red-300",
  },
};

const STATUS_MAP = {
  ACTIVE: {
    value: 1,
    label: "Hoạt động",
    className: "bg-green-900 text-green-300",
  },
  PENDING: {
    value: 0,
    label: "Chờ",
    className: "bg-yellow-900 text-yellow-300",
  },
  LOCKED: { value: -1, label: "Khóa", className: "bg-gray-900 text-gray-300" },
  DELETED: { value: -2, label: "Xóa", className: "bg-red-900 text-red-300" },
};

const GROUP_KIND_MAP = {
  ADMIN: {
    value: 1,
    label: "Quản trị viên",
    className: "bg-blue-900 text-blue-300",
  },
  CUSTOMER: {
    value: 2,
    label: "Khách hàng",
    className: "bg-yellow-900 text-yellow-300",
  },
  EMPLOYEE: {
    value: 3,
    label: "Nhân viên",
    className: "bg-red-900 text-red-300",
  },
};

const TRANSACTION_KIND_MAP = {
  INCOME: {
    value: 1,
    label: "Thu",
    className: "bg-green-900 text-green-300",
    textColor: "text-green-600",
    icon: ArrowUpIcon,
  },
  EXPENSE: {
    value: 2,
    label: "Chi",
    className: "bg-red-900 text-red-300",
    textColor: "text-red-600",
    icon: ArrowDownIcon,
  },
};

const TASK_STATE_MAP = {
  PENDING: {
    value: 1,
    label: "Đang xử lý",
    className: "bg-yellow-900 text-yellow-300",
    textColor: "text-yellow-600",
    icon: CircleDotDashedIcon,
  },
  DONE: {
    value: 2,
    label: "Hoàn thành",
    className: "bg-green-900 text-green-300",
    textColor: "text-green-600",
    icon: CircleDotIcon,
  },
};

const TRANSACTION_UPDATE_STATE_MAP = {
  CREATED: {
    value: 1,
    label: "Đã tạo",
    className: "bg-yellow-900 text-yellow-300",
  },
  APPROVE: {
    value: 2,
    label: "Chấp nhận",
    className: "bg-blue-900 text-blue-300",
  },
};

const TRANSACTION_STATE_MAP = {
  ...TRANSACTION_UPDATE_STATE_MAP,
  REJECT: {
    value: 3,
    label: "Từ chối",
    className: "bg-red-900 text-red-300",
  },
  PAID: {
    value: 4,
    label: "Thanh toán",
    className: "bg-green-900 text-green-300",
  },
};

const PAYMENT_PERIOD_STATE_MAP = {
  CREATED: {
    value: 1,
    label: "Đã tạo",
    className: "bg-yellow-900 text-yellow-300",
    textColor: "text-yellow-600",
    icon: CircleDotIcon,
  },
  APPROVE: {
    value: 2,
    label: "Đã duyệt",
    className: "bg-blue-900 text-blue-300",
    textColor: "text-blue-600",
    icon: CircleCheckIcon,
  },
};

const PERIOD_KIND_MAP = {
  FIXED_DATE: {
    value: 1,
    label: "Ngày cố định",
    className: "bg-indigo-900 text-indigo-300",
  },
  MONTHLY: {
    value: 2,
    label: "Theo tháng",
    className: "bg-yellow-900 text-yellow-300",
  },
  YEARLY: {
    value: 3,
    label: "Theo năm",
    className: "bg-green-900 text-green-300",
  },
};

const KEY_KIND_MAP = {
  SERVER: {
    value: 1,
    label: "Server",
    className: "bg-blue-900 text-blue-300",
    textColor: "text-blue-600",
    icon: DatabaseIcon,
  },
  WEB: {
    value: 2,
    label: "Web",
    className: "bg-blue-900 text-blue-300",
    textColor: "text-blue-600",
    icon: GlobeIcon,
  },
};

const ITEMS_PER_PAGE = 20;
const TRUNCATE_LENGTH = 150;
const FETCH_INTERVAL = 300;
const PING_INTERVAL = 5000; // 5s
const SESSION_KEY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

const SOCKET_CMD = {
  CMD_LOCK_DEVICE: "CMD_LOCK_DEVICE",
};

const PERMISSION_KIND = {
  ITEM: 1,
  GROUP: 2,
};

const IS_PAGED = {
  TRUE: 1,
  FALSE: 0,
};

const SORT_DATE = {
  ASC: 1,
  DESC: 2,
};

const NOTIFICATION_STATE = {
  SENT: 0,
  READ: 1,
};

const TAG_KIND = {
  TRANSACTION: 1,
  SERVICE: 2,
  KEY_INFORMATION: 3,
  PROJECT: 4,
};

const FILE_TYPES = {
  AVATAR: "AVATAR",
  DOCUMENT: "DOCUMENT",
};

const TOAST = {
  SUCCESS: "success",
  ERROR: "error",
  WARN: "warning",
};

const BASIC_MESSAGES = {
  INVALID_FORM: "Vui lòng kiểm tra lại thông tin",
  VERIFY_FAILED: "Xác thực thất bại",
  SUCCESS: "Yêu cầu thành công",
  FAILED: "Yêu cầu thất bại",
  LOGGED_IN: "Đăng nhập thành công",
  LOG_IN_FAILED: "Đăng nhập thất bại",
  CREATED: "Thêm thành công",
  UPDATED: "Cập nhật thành công",
  DELETED: "Xóa thành công",
  RESETED: "Đặt lại thành công",
  EXPORTED: "Xuất tệp thành công",
  NO_DATA: "Không có dữ liệu",
  APPROVE: "Xét duyệt thành công",
  REJECT: "Từ chối yêu cầu thành công",
};

const BUTTON_TEXT = {
  DB_CONFIG: "Cấu hình CSDL",
  SUBMIT: "Xác nhận",
  CONTINUE: "Tiếp tục",
  LOGIN: "Đăng nhập",
  TWO_FACTOR: "Xác thực hai bước",
  RESET_MFA: "Đặt lại MFA",
  PERMISSION: "Phân quyền",
  ADD_MEMBER: "Thêm thành viên",
  SEARCH: "Tìm kiếm",
  REFRESH: "Làm mới",
  CREATE: "Thêm mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  CANCEL: "Hủy",
  DONE: "Hoàn thành",
  EXPORT_EXCEL: "Xuất Excel",
  IMPORT_EXCEL: "Nhập Excel",
  DECRYPT: "Giải mã",
  RESOLVE: "Giải quyết",
  BACK: "Trở về",
  REJECT: "Từ chối",
  APPROVE: "Chấp nhận",
  RECALCULATE: "Tính lại",
};

export {
  VALID_PATTERN,
  ALIGNMENT,
  API_URL,
  ENV,
  AUTH_TYPE,
  LOCAL_STORAGE,
  METHOD,
  GRANT_TYPE,
  STATUS_MAP,
  ITEMS_PER_PAGE,
  GROUP_KIND_MAP,
  FILE_TYPES,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  FETCH_INTERVAL,
  TRUNCATE_LENGTH,
  TOAST,
  PING_INTERVAL,
  SOCKET_CMD,
  API_HEADER,
  GRANT_TYPE_MAP,
  ERROR_CODE,
  SESSION_KEY_TIMEOUT,
  PERMISSION_KIND,
  TRANSACTION_KIND_MAP,
  TAG_KIND,
  TASK_STATE_MAP,
  SORT_DATE,
  IS_PAGED,
  MIME_TYPES,
  KEY_KIND_MAP,
  PERIOD_KIND_MAP,
  NOTIFICATION_STATE,
  TRANSACTION_STATE_MAP,
  TRANSACTION_UPDATE_STATE_MAP,
  PAYMENT_PERIOD_STATE_MAP,
};
