import { ArrowLeftRightIcon, UserIcon } from "lucide-react";
import Transaction from "../pages/transaction/Transaction";
import CreateTransaction from "../pages/transaction/CreateTransaction";
import UpdateTransaction from "../pages/transaction/UpdateTransaction";
import UpdateRole from "../pages/role/UpdateRole";
import CreateRole from "../pages/role/CreateRole";
import Role from "../pages/role/Role";
import ChangePassword from "../pages/profile/ChangePassword";
import Employee from "../pages/employee/Employee";
import CreateEmployee from "../pages/employee/CreateEmployee";
import UpdateEmployee from "../pages/employee/UpdateEmployee";
import Department from "../pages/department/Department";
import RedirecProfile from "./redirect/RedirectProfile";
import TransactionGroup from "../pages/transactionGroup/TransactionGroup";
import TransactionPermission from "../pages/transactionGroupPermission/TransactionGroupPermission";

const TRANSACTION_CONFIG = {
  TRANSACTION: {
    name: "transaction",
    label: "Giao dịch",
    path: "/transaction",
    role: "TR_L",
    element: <Transaction />,
  },
  CREATE_TRANSACTION: {
    label: "Thêm mới giao dịch",
    path: "/transaction/create",
    role: "TR_C",
    element: <CreateTransaction />,
  },
  UPDATE_TRANSACTION: {
    label: "Cập nhật giao dịch",
    path: "/transaction/update/:id",
    role: "TR_U",
    element: <UpdateTransaction />,
  },
  DELETE_TRANSACTION: {
    label: "Xóa giao dịch",
    role: "TR_D",
  },
};

const TRANSACTION_GROUP_CONFIG = {
  TRANSACTION_GROUP: {
    name: "transaction_group",
    label: "Nhóm giao dịch",
    path: "/transaction-group",
    role: "TR_G_L",
    element: <TransactionGroup />,
  },
  CREATE_TRANSACTION_GROUP: {
    label: "Thêm mới nhóm giao dịch",
    role: "TR_G_C",
  },
  UPDATE_TRANSACTION_GROUP: {
    label: "Cập nhật nhóm giao dịch",
    role: "TR_G_U",
  },
  DELETE_TRANSACTION_GROUP: {
    label: "Xóa nhóm giao dịch",
    role: "TR_G_D",
  },
};

const TRANSACTION_GROUP_PERMISSION_CONFIG = {
  TRANSACTION_GROUP_PERMISSION: {
    label: "Phân quyền nhóm giao dịch",
    path: "/transaction-group/permission/:transactionGroupId",
    role: "TR_P_L",
    element: <TransactionPermission />,
  },
  CREATE_TRANSACTION_GROUP_PERMISSION: {
    label: "Thêm quyền nhóm giao dịch",
    role: "TR_P_C",
  },
  DELETE_TRANSACTION_GROUP_PERMISSION: {
    label: "Xóa quyền nhóm giao dịch",
    role: "TR_P_D",
  },
};

const ROLE_CONFIG = {
  ROLE: {
    name: "role",
    label: "Quyền hạn",
    path: "/role",
    role: "RO_L",
    element: <Role />,
  },
  UPDATE_ROLE: {
    label: "Cập nhật quyền hạn",
    path: "/role/update/:id",
    role: "RO_U",
    element: <UpdateRole />,
  },
  CREATE_ROLE: {
    label: "Thêm mới quyền hạn",
    path: "/role/create",
    role: "RO_C",
    element: <CreateRole />,
  },
  DELETE_ROLE: {
    label: "Xóa quyền hạn",
    role: "RO_D",
  },
};

const EMPLOYEE_CONFIG = {
  EMPLOYEE: {
    name: "employee",
    label: "Nhân viên",
    path: "/employee",
    role: "EMP_L",
    element: <Employee />,
  },
  CREATE_EMPLOYEE: {
    label: "Thêm mới nhân viên",
    path: "/employee/create",
    role: "EMP_C_AD",
    element: <CreateEmployee />,
  },
  UPDATE_EMPLOYEE: {
    label: "Cập nhật nhân viên",
    path: "/employee/update/:id",
    role: "EMP_U_AD",
    element: <UpdateEmployee />,
  },
  DELETE_EMPLOYEE: {
    label: "Xóa nhân viên",
    role: "EMP_D",
  },
};

const DEPARTMENT_CONFIG = {
  DEPARTMENT: {
    name: "department",
    label: "Phòng ban",
    path: "/department",
    role: "DE_L",
    element: <Department />,
  },
  CREATE_DEPARTMENT: {
    label: "Thêm mới phòng ban",
    role: "DE_C",
  },
  UPDATE_DEPARTMENT: {
    label: "Cập nhật phòng ban",
    role: "DE_U",
  },
  DELETE_DEPARTMENT: {
    label: "Xóa phòng ban",
    role: "DE_D",
  },
};

const PROFILE_CONFIG = {
  PROFILE: {
    label: "Hồ sơ",
    path: "/profile",
    element: <RedirecProfile />,
  },
  CHANGE_PASSWORD: {
    label: "Đổi mật khẩu",
    path: "/change-password",
    element: <ChangePassword />,
  },
};

const PAGE_CONFIG = {
  ...TRANSACTION_CONFIG,
  ...ROLE_CONFIG,
  ...EMPLOYEE_CONFIG,
  ...PROFILE_CONFIG,
  ...DEPARTMENT_CONFIG,
  ...TRANSACTION_GROUP_CONFIG,
  ...TRANSACTION_GROUP_PERMISSION_CONFIG,
};

const SESSION_KEY_PAGES: Set<string> = new Set([
  PAGE_CONFIG.TRANSACTION.name,
  PAGE_CONFIG.TRANSACTION_GROUP.name,
]);

const DECRYPT_FIELDS = {
  TRANSACTION_GROUP: ["name", "description"],
};

const SIDEBAR_MENUS = [
  {
    name: "Quản lý giao dịch",
    icon: <ArrowLeftRightIcon size={20} />,
    items: [PAGE_CONFIG.TRANSACTION, PAGE_CONFIG.TRANSACTION_GROUP],
  },
  {
    name: "Quản lý người dùng",
    icon: <UserIcon size={20} />,
    items: [PAGE_CONFIG.EMPLOYEE, PAGE_CONFIG.ROLE, PAGE_CONFIG.DEPARTMENT],
  },
];

export { PAGE_CONFIG, SIDEBAR_MENUS, SESSION_KEY_PAGES, DECRYPT_FIELDS };
