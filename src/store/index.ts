import { useEffect, useState } from "react";
import { Status } from "./status";
import { activeWidget, activeWidgetType, snapshot, historyInfo, mode } from "./projectStores";
import { initProjectInfo, initVideoInfo, initAlgorithmInfo } from "./initData";
export * from "./commonStores";
export * from "./projectStores";
export * from "./initData";

export function useStore<T>(status: Status<T>): [v: T, f: (v: T) => void] {
  const [state, setState] = useState<T>(status.get());
  useEffect(() => {
    const sub = status.subscribe((v) => {
      setState(v);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [status, state, setState]);
  function set(v: T) {
    status.set(v);
  }
  return [state, set];
}

const stores = {
  activeWidget,
  activeWidgetType,
  snapshot,
  historyInfo,
  mode,
  initProjectInfo,
  initVideoInfo,
  initAlgorithmInfo,
};

// todo 开发调试时代码，运行时去掉
(window as any).stores = stores;
