export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

interface Subscription {
  unsubscribe: () => void;
}

export class Subject<T> {
  private map = new Map<number, (value: T) => void>();
  next(value: T): void {
    const map = this.map;
    map.forEach((f) => {
      f(value);
    });
  }
  subscribe(f: (value: T) => void): Subscription {
    const map = this.map;
    const key = Date.now();
    map.set(key, f);

    return {
      unsubscribe: () => {
        map.delete(key);
      },
    };
  }
}
