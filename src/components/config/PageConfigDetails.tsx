import Department from "../../pages/department/Department";
import CreateEmployee from "../../pages/employee/CreateEmployee";
import Employee from "../../pages/employee/Employee";
import UpdateEmployee from "../../pages/employee/UpdateEmployee";
import KeyInformationGroup from "../../pages/keyInformationGroup/KeyInformationGroup";
import KeyInformationGroupPermission from "../../pages/keyInformationGroupPermission/KeyInformationGroupPermission";
import UpdateLocationByCustomer from "../../pages/location/UpdateLocationByCustomer";
import Organization from "../../pages/organization/Organization";
import OrganizationPermission from "../../pages/organizationPermission/OrganizationPermission";
import ChangePassword from "../../pages/profile/ChangePassword";
import CreateRole from "../../pages/role/CreateRole";
import Role from "../../pages/role/Role";
import UpdateRole from "../../pages/role/UpdateRole";
import ServiceGroup from "../../pages/serviceGroup/ServiceGroup";
import ServiceGroupPermission from "../../pages/serviceGroupPermission/ServiceGroupPermission";
import CreateTransaction from "../../pages/transaction/CreateTransaction";
import Transaction from "../../pages/transaction/Transaction";
import UpdateTransaction from "../../pages/transaction/UpdateTransaction";
import TransactionGroup from "../../pages/transactionGroup/TransactionGroup";
import TransactionGroupPermission from "../../pages/transactionGroupPermission/TransactionGroupPermission";
import RedirecProfile from "../redirect/RedirectProfile";

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
    element: <TransactionGroupPermission />,
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

const SERVICE_GROUP_CONFIG = {
  SERVICE_GROUP: {
    name: "service_group",
    label: "Nhóm dịch vụ",
    path: "/service-group",
    role: "SE_G_L",
    element: <ServiceGroup />,
  },
  CREATE_SERVICE_GROUP: {
    label: "Thêm mới nhóm dịch vụ",
    role: "SE_G_C",
  },
  UPDATE_SERVICE_GROUP: {
    label: "Cập nhật nhóm dịch vụ",
    role: "SE_G_U",
  },
  DELETE_SERVICE_GROUP: {
    label: "Xóa nhóm dịch vụ",
    role: "SE_G_D",
  },
};

const SERVICE_GROUP_PERMISSION_CONFIG = {
  SERVICE_GROUP_PERMISSION: {
    label: "Phân quyền nhóm dịch vụ",
    path: "/service-group/permission/:serviceGroupId",
    role: "SER_P_L",
    element: <ServiceGroupPermission />,
  },
  CREATE_SERVICE_GROUP_PERMISSION: {
    label: "Thêm quyền nhóm dịch vụ",
    role: "SER_P_C",
  },
  DELETE_SERVICE_GROUP_PERMISSION: {
    label: "Xóa quyền nhóm dịch vụ",
    role: "SER_P_D",
  },
};

const KEY_INFORMATION_GROUP_CONFIG = {
  KEY_INFORMATION_GROUP: {
    name: "key_information_group",
    label: "Nhóm key",
    path: "/key-information-group",
    role: "KE_I_G_L",
    element: <KeyInformationGroup />,
  },
  CREATE_KEY_INFORMATION_GROUP: {
    label: "Thêm mới nhóm key",
    role: "KE_I_G_C",
  },
  UPDATE_KEY_INFORMATION_GROUP: {
    label: "Cập nhật nhóm key",
    role: "KE_I_G_U",
  },
  DELETE_KEY_INFORMATION_GROUP: {
    label: "Xóa nhóm key",
    role: "KE_I_G_D",
  },
};

const KEY_INFORMATION_GROUP_PERMISSION_CONFIG = {
  KEY_INFORMATION_GROUP_PERMISSION: {
    label: "Phân quyền nhóm key",
    path: "/key-information-group/permission/:keyInformationGroupId",
    role: "KE_I_P_L",
    element: <KeyInformationGroupPermission />,
  },
  CREATE_KEY_INFORMATION_GROUP_PERMISSION: {
    label: "Thêm quyền nhóm key",
    role: "KE_I_P_C",
  },
  DELETE_KEY_INFORMATION_GROUP_PERMISSION: {
    label: "Xóa quyền nhóm key",
    role: "KE_I_P_D",
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
  LOCATION: {
    label: "Khu vực của tôi",
    path: "/location",
    element: <UpdateLocationByCustomer />,
  },
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

const ORGANIZATION_CONFIG = {
  ORGANIZATION: {
    name: "organization",
    label: "Công ty",
    path: "/organization",
    role: "OR_L",
    element: <Organization />,
  },
  CREATE_ORGANIZATION: {
    label: "Thêm mới công ty",
    role: "OR_C",
  },
  UPDATE_ORGANIZATION: {
    label: "Cập nhật công ty",
    role: "OR_U",
  },
  DELETE_ORGANIZATION: {
    label: "Xóa công ty",
    role: "OR_D",
  },
};

const ORGANIZATION_PERMISSION_CONFIG = {
  ORGANIZATION_PERMISSION: {
    label: "Phân quyền công ty",
    path: "/organization/permission/:organizationId",
    role: "OR_P_L",
    element: <OrganizationPermission />,
  },
  CREATE_ORGANIZATION_PERMISSION: {
    label: "Thêm quyền công ty",
    role: "OR_P_C",
  },
  DELETE_ORGANIZATION_PERMISSION: {
    label: "Xóa quyền công ty",
    role: "OR_P_D",
  },
};

export {
  TRANSACTION_CONFIG,
  TRANSACTION_GROUP_CONFIG,
  TRANSACTION_GROUP_PERMISSION_CONFIG,
  SERVICE_GROUP_CONFIG,
  ROLE_CONFIG,
  EMPLOYEE_CONFIG,
  DEPARTMENT_CONFIG,
  PROFILE_CONFIG,
  SERVICE_GROUP_PERMISSION_CONFIG,
  KEY_INFORMATION_GROUP_CONFIG,
  KEY_INFORMATION_GROUP_PERMISSION_CONFIG,
  ORGANIZATION_CONFIG,
  ORGANIZATION_PERMISSION_CONFIG,
};
