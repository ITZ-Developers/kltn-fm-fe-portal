import useFetch from "./useFetch.ts";
import { authController } from "../controllers/authController.ts";
import mediaController from "../controllers/mediaController.ts";
import { roleController } from "../controllers/roleController.ts";
import { transactionController } from "../controllers/transactionController.ts";
import { departmentController } from "../controllers/departmentController.ts";
import { employeeController } from "../controllers/employeeController.ts";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const auth = authController(fetchApi);
  const media = mediaController(fetchApi);
  const role = roleController(fetchApi);
  const department = departmentController(fetchApi);
  const employee = employeeController(fetchApi);
  const transaction = transactionController(fetchApi);

  return {
    auth,
    media,
    loading,
    role,
    location,
    transaction,
    employee,
    department,
  };
};

export default useApi;
