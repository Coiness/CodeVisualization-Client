import { useEffect } from "react";
import { historyInfo, snapshot } from "../../store";
import { ChangeSet, doChange, doInvertedChange } from "../diff/objDiff";
import { Obj } from "../types";

const pathKey = Symbol("pathKey");

export type HistoryInfo = {
  history: { cs: ChangeSet }[];
  index: number;
};

export function initUndo() {
  initPath(snapshot.get());
}

export function useUndo() {
  useEffect(() => {
    const fun = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "z" || e.key === "Z") &&
        !e.shiftKey
      ) {
        execUndo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "z" || e.key === "Z") &&
        e.shiftKey
      ) {
        execRedo();
      }
    };
    document.addEventListener("keydown", fun);
    return () => {
      document.removeEventListener("keydown", fun);
    };
  }, []);
}

function initPath(obj: any) {
  initPathDfs(obj, []);
}

function initPathDfs(obj: any, path: string[]) {
  if (typeof obj === "object" && obj !== null) {
    for (let attr in obj) {
      path.push(attr);
      initPathDfs(obj[attr], path);
      path.pop();
    }
    obj[pathKey] = path.join(".");
  }
}

function getPath(obj: any) {
  return obj[pathKey];
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
    console.log("DEBUG: ", "undo empty");
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
    console.log("DEBUG: ", "redo empty");
  }
}

export function getCS(obj: any, change: [attr: string | number, value: any][]) {
  const path = getPath(obj);
  const cs = [] as ChangeSet;
  for (let item of change) {
    const [attr, value] = item;
    let p;
    if (path === "") {
      p = `${attr}`;
    } else {
      p = `${path}.${attr}`;
    }
    if (obj.hasOwnProperty(attr)) {
      cs.push({ t: "u", p, c: [obj[attr], value] });
    } else {
      cs.push({ t: "c", p, c: [value] });
    }
  }
  return cs;
}

export function xSet(obj: any, change: [attr: string | number, value: any][]) {
  if (typeof obj === "object") {
    const cs = getCS(obj, change);
    execDo(cs);
  } else {
    throw new Error("xSet obj not object type");
  }
}

export function xRm(obj: any, attr: string | number) {
  if (typeof obj === "object") {
    const path = getPath(obj);
    let p;
    if (path === "") {
      p = "attr";
    } else {
      p = `${path}.${attr}`;
    }
    if (obj.hasOwnProperty(attr)) {
      const cs = [{ t: "d", p, c: [obj[attr]] }] as ChangeSet;
      execDo(cs);
    }
  } else {
    throw new Error("xSet obj not object type");
  }
}
