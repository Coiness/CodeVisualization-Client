import { message } from "antd";
import { useEffect } from "react";
import { CommonModel } from "../../components/widget/widgets";
import { historyInfo, snapshot } from "../../store";
import { commitRedo, commitUndo } from "../action";
import { ChangeSet, doChange, doInvertedChange } from "../diff/objDiff";
import { Obj } from "../types";

const pathKey = Symbol("pathKey");

export type HistoryInfo = {
  history: { cs: ChangeSet }[];
  index: number;
};

export function useUndo(enable: boolean) {
  useEffect(() => {
    if (!enable) {
      return;
    }
    const fun = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
        commitUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z") && e.shiftKey) {
        commitRedo();
      }
    };
    document.addEventListener("keydown", fun);
    return () => {
      document.removeEventListener("keydown", fun);
    };
  }, [enable]);
}

function initPath(obj: unknown) {
  initPathDfs(obj, []);
}

// 监听 snapshot 每次 snapshot 更新时，执行 initPath
snapshot.subscribe((s) => {
  initPath(s);
});

type PathKeyObj = {
  [pathKey]: string;
};

export function initPathDfs(obj: unknown, path: string[]) {
  if (typeof obj === "object" && obj !== null) {
    for (let attr in obj) {
      path.push(attr);
      initPathDfs((obj as Obj)[attr], path);
      path.pop();
    }
    (obj as PathKeyObj)[pathKey] = path.join(".");
  }
}

function getPath(obj: Obj): string {
  return (obj as PathKeyObj)[pathKey];
}

export function execDo(cs: ChangeSet) {
  const data = snapshot.get();
  const historyInfoValue = historyInfo.get();
  doChange(data as Obj, cs);
  historyInfoValue.history[historyInfoValue.index] = { cs };
  historyInfoValue.index++;
  historyInfoValue.history.length = historyInfoValue?.index;
}

export function execUndo() {
  const data = snapshot.get();
  const historyInfoValue = historyInfo.get();
  if (historyInfoValue.index > 0) {
    historyInfoValue.index--;
    const { cs } = historyInfoValue.history[historyInfoValue.index];
    doInvertedChange(data as Obj, cs);
  } else {
    message.info("已经撤销到头了！");
  }
}

export function execRedo() {
  const data = snapshot.get();
  const historyInfoValue = historyInfo.get();
  if (historyInfoValue.history.length > historyInfoValue.index) {
    const { cs } = historyInfoValue.history[historyInfoValue.index];
    doChange(data as Obj, cs);
    historyInfoValue.index++;
  } else {
    message.info("已经重做到头了！");
  }
}

export enum CSType {
  DELETE = "DELETE",
}

// todo 治理这里的 any
export function getCS(target: any, change: [attr: string | number, value: unknown][], model?: CommonModel) {
  model = model ?? target;
  const mp = getPath(model!);
  const path = getPath(target);
  const cs = [] as ChangeSet;
  for (let item of change) {
    const [attr, value] = item;
    let p;
    if (path === "") {
      p = `${attr}`;
    } else {
      p = `${path}.${attr}`;
    }
    if (target.hasOwnProperty(attr) && value === CSType.DELETE) {
      cs.push({ modelPath: mp, t: "d", p, c: [target[attr]] });
    } else if (target.hasOwnProperty(attr)) {
      cs.push({ modelPath: mp, t: "u", p, c: [target[attr], value] });
    } else {
      cs.push({ modelPath: mp, t: "c", p, c: [value] });
    }
  }
  return cs;
}
