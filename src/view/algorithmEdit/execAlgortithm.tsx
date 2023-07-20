import "./execAlgortithm.css";
import { Modal } from "antd";
import { useCallback } from "react";
import { InputContent } from "../../components/inputList";
import { ApiDriver, EL } from "../../openAPI/driver";
import { closeDialog, openDialog } from "../dialogs/dialog";
import { ShowCodeInfo } from "./ShowCode";

export async function execAlgorithm(
  code: string,
  showCode: ShowCodeInfo | null,
  descrition: string,
  navigate: (url: string) => void,
  initData?: InputContent[],
) {
  let res = await ApiDriver.start(code, showCode, descrition, initData);
  if (res === true) {
    navigate("/videoPlay");
  } else {
    openDialog("execCodeErrorDialog", res);
  }
}

export function ExecCodeErrorDialog(visible: boolean, data?: EL) {
  const closePanel = useCallback(() => {
    closeDialog("execCodeErrorDialog");
  }, []);

  if (!data) {
    return <></>;
  }

  return (
    <Modal open={visible} maskClosable={true} onCancel={closePanel} footer={null} width={500} closable={true}>
      <div className="execCodeErrorContent">
        <h2>执行出错</h2>
        {data.error && (
          <div className="error">
            <div className="title">错误信息：</div>
            <div className="code">{data.error.message}</div>
          </div>
        )}
        <div className="logs">
          <div className="title">logs：</div>
          <div className="code">
            {data.logs.map((item) => {
              return <div className="logItem">{item.join(", ")}</div>;
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
