import { API_URL, AUTH_TYPE, METHOD } from "../services/constant.ts";

export const mediaController = (fetchApi: any) => {
  const upload = ({ file, type }: { file: File; type: string }) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("type", type);

    return fetchApi({
      apiUrl: API_URL.MEDIA_API,
      endpoint: "/v1/file/upload",
      method: METHOD.POST,
      payload: formData,
      authType: AUTH_TYPE.BEARER,
    });
  };

  return {
    upload,
  };
};

export default mediaController;
