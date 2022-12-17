import { useEffect, useState } from "react";
import { Status } from "./stores";

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

export * from "./stores";
