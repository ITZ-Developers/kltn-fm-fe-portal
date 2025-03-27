import useFetch from "./useFetch.ts";
import { authController } from "../controllers/authController.ts";
import mediaController from "../controllers/mediaController.ts";
import { roleController } from "../controllers/roleController.ts";
import { transactionController } from "../controllers/transactionController.ts";
import { departmentController } from "../controllers/departmentController.ts";
import { employeeController } from "../controllers/employeeController.ts";
import { transactionGroupController } from "../controllers/transactionGroupController.ts";
import { transactionPermissionController } from "../controllers/transactionPermissionController.ts";
import { serviceGroupController } from "../controllers/serviceGroupController.ts";
import { servicePermissionController } from "../controllers/servicePermissionController.ts";
import { keyInformationPermissionController } from "../controllers/keyInformationPermissionController.ts";
import { keyInformationGroupController } from "../controllers/keyInformationGroupController.ts";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const auth = authController(fetchApi);
  const media = mediaController(fetchApi);
  const role = roleController(fetchApi);
  const department = departmentController(fetchApi);
  const employee = employeeController(fetchApi);
  const transaction = transactionController(fetchApi);
  const transactionGroup = transactionGroupController(fetchApi);
  const transactionPermission = transactionPermissionController(fetchApi);
  const serviceGroup = serviceGroupController(fetchApi);
  const servicePermission = servicePermissionController(fetchApi);
  const keyInformationGroup = keyInformationGroupController(fetchApi);
  const keyInformationPermission = keyInformationPermissionController(fetchApi);

  return {
    auth,
    media,
    loading,
    role,
    location,
    transaction,
    transactionGroup,
    transactionPermission,
    employee,
    department,
    serviceGroup,
    servicePermission,
    keyInformationGroup,
    keyInformationPermission,
  };
};

export default useApi;
