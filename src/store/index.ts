import { useEffect, useState } from "react";
import { Subject, Subscription } from "../common/utils";
import { WidgetInfo } from "../components/widget/widgets";

export interface Status<T> {
  get: () => T;
  set: (v: T) => void;
  subscribe: (f: (v: T) => void) => Subscription;
}

function createStatus<T>(defaultValue: T) {
  let value = defaultValue;
  const subject = new Subject<T>();
  return {
    get(): T {
      return value;
    },
    set(v: T) {
      value = v;
      subject.next(value);
    },
    subscribe(f: (v: T) => void) {
      return subject.subscribe(f);
    },
  };
}

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

export const activeWidget = createStatus<WidgetInfo>(null);
export const activeWidgetType = createStatus<WidgetInfo>(null);
