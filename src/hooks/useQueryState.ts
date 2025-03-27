import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/GlobalProvider";
import { useEffect } from "react";

const useQueryState = ({ path, requireSessionKey = false }: any) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sessionKey } = useGlobalContext();

  useEffect(() => {
    if (requireSessionKey && !sessionKey) {
      handleNavigateBack();
    }
  }, [sessionKey]);

  const handleNavigateBack = () => {
    navigate(path, { state });
  };

  return {
    handleNavigateBack,
  };
};

export default useQueryState;
