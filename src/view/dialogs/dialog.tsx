import { useEffect, useState } from "react";
import { Subject } from "../../common/utils";
import { InputListDialog } from "../../components/inputList";
import { Login } from "../../components/login";
import { SetAlgorithmNameDialog } from "../algorithmEdit";
import { SetProjectNameDialog } from "../project/headerToolBar";
import { SetVideoNameDialog } from "../videoPlay";

const dialogs: { [key: string]: (v: boolean, d?: any) => JSX.Element } = {
  login: Login,
  setProjectName: SetProjectNameDialog,
  setAlgorithmName: SetAlgorithmNameDialog,
  setVideoName: SetVideoNameDialog,
  inputListDialog: InputListDialog,
};

const sub = new Subject<{ key: string; status: boolean; data?: any }>();

export function Dialogs() {
  const [status, setStatus] = useState<{
    [key: string]: { v: boolean; d?: any };
  }>({});

  useEffect(() => {
    let s = sub.subscribe((d) => {
      status[d.key] = { v: d.status, d: d.data };
      setStatus({ ...status });
    });
    return s.unsubscribe;
  }, []);

  return (
    <>
      {Object.keys(dialogs).map((key: string) => {
        let x = dialogs[key](
          status[key] ? status[key].v : false,
          status[key] ? status[key].d : undefined
        );
        return <div key={key}>{x}</div>;
      })}
    </>
  );
}

export function openDialog(key: string, data?: any) {
  sub.next({ key, status: true, data });
}

export function closeDialog(key: string) {
  sub.next({ key, status: false });
}
