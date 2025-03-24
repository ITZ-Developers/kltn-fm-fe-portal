import { useEffect } from "react";
import { useGlobalContext } from "../../components/GlobalProvider";
import { ConfirmationDialog } from "../../components/page/Dialog";
import useModal from "../../hooks/useModal";
import { removeSessionCache } from "../../services/storages";
import { SOCKET_CMD } from "../../services/constant";

const UnauthorizedDialog = () => {
  const {
    isUnauthorized,
    setIsUnauthorized,
    isSystemNotReady,
    setIsSystemNotReady,
    message,
  } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  useEffect(() => {
    if (
      message?.responseCode === 400 ||
      message?.cmd === SOCKET_CMD.CMD_LOCK_DEVICE
    ) {
      setIsUnauthorized(true);
    }
  }, [message]);

  useEffect(() => {
    if (isUnauthorized) {
      removeSessionCache();
      showModal({
        title: "Phiên đăng nhập hết hạn",
        message: "Vui lòng đăng nhập lại để tiếp tục",
        confirmText: "Đồng ý",
        color: "goldenrod",
        onConfirm: () => {
          hideModal();
          window.location.href = "/";
        },
      });
    } else if (isSystemNotReady) {
      setIsSystemNotReady(false);
      showModal({
        title: "Hệ thống hiện chưa sẵn sàng",
        message: "Vui lòng liên hệ với quản trị viên để kích hoạt hệ thống",
        confirmText: "Đã hiểu",
        color: "goldenrod",
        onConfirm: () => {
          hideModal();
        },
        onCancel: () => {
          hideModal();
        },
      });
    }
  }, [isUnauthorized, isSystemNotReady]);

  return (
    <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
  );
};

export default UnauthorizedDialog;
