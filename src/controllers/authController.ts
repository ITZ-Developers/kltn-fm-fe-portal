import { useGlobalContext } from "../components/GlobalProvider.tsx";
import {
  API_HEADER,
  API_URL,
  AUTH_TYPE,
  GRANT_TYPE,
  METHOD,
} from "../services/constant.ts";

export const authController = (fetchApi: any) => {
  const { tenantInfo, isCustomer } = useGlobalContext();

  const myLocation = () => {
    return fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/customer/my-location",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const loginEmployee = (payload: any) => {
    return fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/account/login",
      method: METHOD.POST,
      payload: { ...payload, grantType: GRANT_TYPE.EMPLOYEE },
      authType: AUTH_TYPE.NONE,
      headers: {
        [API_HEADER.X_TENANT]: payload.tenantId,
      },
    });
  };

  const login = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/api/token",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BASIC,
    });

  const profileCustomer = () =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/profile",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const profileEmployee = () =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/account/profile",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const profile = () => {
    if (isCustomer) {
      return profileCustomer();
    } else {
      return profileEmployee();
    }
  };

  const updateProfile = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/update-profile-admin",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const updateProfileEmployee = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/account/update-profile-admin",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const changePassword = (payload: any) => {
    if (isCustomer) {
      return fetchApi({
        apiUrl: API_URL.MASTER_API,
        endpoint: "/v1/account/change-profile-password",
        method: METHOD.PUT,
        payload,
        authType: AUTH_TYPE.BEARER,
      });
    } else {
      return fetchApi({
        apiUrl: API_URL.TENANT_API,
        endpoint: "/v1/account/change-profile-password",
        method: METHOD.PUT,
        payload,
        authType: AUTH_TYPE.BEARER,
        headers: {
          [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
        },
      });
    }
  };

  const verifyCreditial = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/verify-credential",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const requestForgetPassword = (email: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/request-forget-password",
      method: METHOD.POST,
      payload: { email },
      authType: AUTH_TYPE.NONE,
    });

  const requestForgetPasswordEmployee = (email: any, tenantId: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/account/request-forget-password",
      method: METHOD.POST,
      payload: { email },
      authType: AUTH_TYPE.NONE,
      headers: {
        [API_HEADER.X_TENANT]: tenantId,
      },
    });

  const resetPassword = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/reset-password",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const resetPasswordEmployee = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/account/reset-password",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
      headers: {
        [API_HEADER.X_TENANT]: payload.tenantId,
      },
    });

  return {
    login,
    profile,
    updateProfile,
    changePassword,
    verifyCreditial,
    requestForgetPassword,
    resetPassword,
    loginEmployee,
    myLocation,
    requestForgetPasswordEmployee,
    resetPasswordEmployee,
    updateProfileEmployee,
  };
};
