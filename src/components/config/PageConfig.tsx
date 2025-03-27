import {
  ArrowLeftRightIcon,
  HeadsetIcon,
  KeyIcon,
  UserIcon,
} from "lucide-react";
import {
  DEPARTMENT_CONFIG,
  EMPLOYEE_CONFIG,
  KEY_INFORMATION_GROUP_CONFIG,
  KEY_INFORMATION_GROUP_PERMISSION_CONFIG,
  PROFILE_CONFIG,
  ROLE_CONFIG,
  SERVICE_GROUP_CONFIG,
  SERVICE_GROUP_PERMISSION_CONFIG,
  TRANSACTION_CONFIG,
  TRANSACTION_GROUP_CONFIG,
  TRANSACTION_GROUP_PERMISSION_CONFIG,
} from "./PageConfigDetails";

const PAGE_CONFIG = {
  ...TRANSACTION_CONFIG,
  ...ROLE_CONFIG,
  ...EMPLOYEE_CONFIG,
  ...PROFILE_CONFIG,
  ...DEPARTMENT_CONFIG,
  ...TRANSACTION_GROUP_CONFIG,
  ...TRANSACTION_GROUP_PERMISSION_CONFIG,
  ...SERVICE_GROUP_CONFIG,
  ...SERVICE_GROUP_PERMISSION_CONFIG,
  ...KEY_INFORMATION_GROUP_CONFIG,
  ...KEY_INFORMATION_GROUP_PERMISSION_CONFIG,
};

const SESSION_KEY_PAGES: Set<string> = new Set([
  PAGE_CONFIG.TRANSACTION.name,
  PAGE_CONFIG.TRANSACTION_GROUP.name,
  PAGE_CONFIG.SERVICE_GROUP.name,
]);

const DECRYPT_FIELDS = {
  TRANSACTION_GROUP: ["name", "description"],
  SERVICE_GROUP: ["name", "description"],
  KEY_INFORMATION_GROUP: ["name", "description"],
};

const SIDEBAR_MENUS = [
  {
    name: "Quản lý giao dịch",
    icon: <ArrowLeftRightIcon size={20} />,
    items: [PAGE_CONFIG.TRANSACTION, PAGE_CONFIG.TRANSACTION_GROUP],
  },
  {
    name: "Quản lý dịch vụ",
    icon: <HeadsetIcon size={20} />,
    items: [PAGE_CONFIG.SERVICE_GROUP],
  },
  {
    name: "Quản lý key",
    icon: <KeyIcon size={20} />,
    items: [PAGE_CONFIG.KEY_INFORMATION_GROUP],
  },
  {
    name: "Quản lý người dùng",
    icon: <UserIcon size={20} />,
    items: [PAGE_CONFIG.EMPLOYEE, PAGE_CONFIG.ROLE, PAGE_CONFIG.DEPARTMENT],
  },
];

export { PAGE_CONFIG, SIDEBAR_MENUS, SESSION_KEY_PAGES, DECRYPT_FIELDS };
