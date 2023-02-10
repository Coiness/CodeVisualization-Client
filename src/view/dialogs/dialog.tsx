import { useEffect, useState } from "react";
import { Subject } from "../../common/utils";
import { Login } from "../../components/login";

const dialogs: { [key: string]: (v: boolean) => JSX.Element } = {
  login: Login,
  // setProjectName: ,
};

const sub = new Subject<{ key: string; status: boolean }>();

export function Dialogs() {
  const [status, setStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    let s = sub.subscribe((d) => {
      status[d.key] = d.status;
      setStatus({ ...status });
    });
    return s.unsubscribe;
  }, []);

  return (
    <>
      {Object.keys(dialogs).map((key: string) => {
        let x = dialogs[key](status[key]);
        return x;
      })}
    </>
  );
}

export function openDialog(key: string) {
  sub.next({ key, status: true });
}

export function closeDialog(key: string) {
  sub.next({ key, status: false });
}
