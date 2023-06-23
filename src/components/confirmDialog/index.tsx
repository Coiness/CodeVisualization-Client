import { useCallback } from "react";
import { closeDialog } from "../../view/dialogs/dialog";
import { Modal } from "antd";

interface ConfirmDialogParams {
  content: string;
  okText: string;
  cancelText: string;
}

export function ConfirmDialog(visible: boolean, params?: ConfirmDialogParams) {
  params = params ?? { content: "", okText: "", cancelText: "" };
  const { content, okText, cancelText } = params;

  const closePanel = useCallback((res: boolean) => {
    closeDialog("confirmDialog", res);
  }, []);

  return (
    <Modal
      open={visible}
      maskClosable={true}
      width={300}
      closable={true}
      okText={okText}
      cancelText={cancelText}
      onOk={() => {
        closePanel(true);
      }}
      onCancel={() => {
        closePanel(false);
      }}
    >
      {content}
    </Modal>
  );
}
