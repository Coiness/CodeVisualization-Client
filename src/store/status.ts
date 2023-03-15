import { Subject, Subscription } from "../common/utils";

export interface Status<T> {
  get: () => T;
  set: (v: T) => void;
  subscribe: (f: (v: T) => void) => Subscription;
}

export function createStatus<T>(defaultValue: T) {
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
