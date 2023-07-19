import { useEffect, useState } from "react";
import { Subject, createPromise } from "../../common/utils";
import { InfoEditDialog } from "../../components/infoEdit";
import { InputListDialog } from "../../components/inputList";
import { Login } from "../../components/login";
import { UploadFileDialog } from "../../components/uploadFile";
import { SetAlgorithmNameDialog } from "../algorithmEdit";
import { ExecCodeErrorDialog } from "../algorithmEdit/execAlgortithm";
import { SetProjectNameDialog } from "../project/headerToolBar";
import { SetVideoNameDialog } from "../videoPlay";
import { UploadImageDialog } from "../userInfo/UserInfo";
import { ConfirmDialog } from "../../components/confirmDialog";

// todo any 治理 定义 Dialog 类型
const dialogs: { [key: string]: (v: boolean, d?: any) => JSX.Element } = {
  login: Login,
  setProjectName: SetProjectNameDialog,
  setAlgorithmName: SetAlgorithmNameDialog,
  setVideoName: SetVideoNameDialog,
  inputListDialog: InputListDialog,
  infoEditDialog: InfoEditDialog,
  execCodeErrorDialog: ExecCodeErrorDialog,
  uploadFileDialog: UploadFileDialog,
  uploadImageDialog: UploadImageDialog,
  confirmDialog: ConfirmDialog,
};

const sub = new Subject<{ key: string; status: boolean; data?: unknown }>();

export function Dialogs() {
  const [status, setStatus] = useState<{
    [key: string]: { v: boolean; d?: unknown };
  }>({});

  useEffect(() => {
    let s = sub.subscribe((d) => {
      status[d.key] = { v: d.status, d: d.data };
      setStatus({ ...status });
    });
    return s.unsubscribe;
  }, [status, setStatus]);

  return (
    <>
      {Object.keys(dialogs).map((key: string) => {
        let x = dialogs[key](status[key] ? status[key].v : false, status[key] ? status[key].d : undefined);
        return <div key={key}>{x}</div>;
      })}
    </>
  );
}

const dialogPromiseMap = new Map<string, Function>();

export function openDialog<T>(key: string, data?: unknown): Promise<T> {
  const [p, r] = createPromise();
  dialogPromiseMap.set(key, r);
  sub.next({ key, status: true, data });
  return p as Promise<T>;
}

export function closeDialog<T>(key: string, res?: T) {
  sub.next({ key, status: false });
  dialogPromiseMap.get(key)?.(res);
}
