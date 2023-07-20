import { get, cloneDeep } from "lodash";
import { Subject } from "../../common/utils";
import { CommonModel } from "../../components/widget/widgets";
import { Obj } from "../types";
import { initPathDfs } from "../undo";

export const modelChange = new Subject<CommonModel>();

interface ChangeBase {
  modelPath: string; // 对应逻辑层 model path
  p: string; // 操作路径 path
}

interface ChangeCreate extends ChangeBase {
  t: "c";
  c: [unknown];
}

interface ChangeDelete extends ChangeBase {
  t: "d";
  c: [unknown];
}

interface ChangeUpdate extends ChangeBase {
  t: "u";
  c: [unknown, unknown];
}

type Change = ChangeCreate | ChangeDelete | ChangeUpdate;

export type ChangeSet = Change[];

export function getModelByPath(obj: Obj, path: string): CommonModel {
  const res = get(obj, path);
  return res;
}

export function doChange(obj: Obj, cs: ChangeSet) {
  // 防止 cs 中 create 的对象被修改，导致影响 cs
  cs = cloneDeep(cs);
  cs.forEach((change) => {
    const path = change.p.split(".");
    let attr = path.pop();
    let p = path.join(".");
    let o = obj;
    if (p !== "") {
      o = get(obj, p);
    }
    if (!o || !attr) {
      throw new Error("doChange error, o or attr is undefined");
    }
    if (change.t === "u") {
      o[attr] = change.c[1];
      initPathDfs(o[attr], [...path, attr]);
    } else if (change.t === "d") {
      delete o[attr];
    } else if (change.t === "c") {
      o[attr] = change.c[0];
      initPathDfs(o[attr], [...path, attr]);
    }
    modelChange.next(getModelByPath(obj, change.modelPath));
  });
}

export function doInvertedChange(obj: Obj, cs: ChangeSet) {
  doChange(obj, getInvertedChangeSet(cs));
}

function getInvertedChangeSet(cs: ChangeSet) {
  cs = cloneDeep(cs);
  cs = cs.map((change: Change): Change => {
    if (change.t === "c") {
      return {
        ...change,
        t: "d",
      };
    } else if (change.t === "d") {
      return {
        ...change,
        t: "c",
      };
    } else if (change.t === "u") {
      let temp = change.c[0];
      change.c[0] = change.c[1];
      change.c[1] = temp;
      return { ...change };
    } else {
      throw new Error("getInvertedChangeSet: change type error");
    }
  });
  cs.reverse(); // CS 中可能会有先后依赖关系，所以获取反向 CS 后需要将其反转
  return cs;
}

export function test() {
  let o1 = {
    a: 1,
    b: {
      c: 2,
      d: 3,
    },
    e: 4,
  };

  let o2 = {
    a: 5,
    b: {
      c: 2,
    },
    e: 4,
    f: {
      g: 6,
    },
  };

  let d1 = [
    { t: "u", p: "a", c: [1, 5] },
    { t: "d", p: "b.d", c: [3] },
    { t: "c", p: "f", c: [{ g: 6 }] },
  ] as ChangeSet;

  // let d2 = [
  //   { t: "u", p: "a", c: [5, 1] },
  //   { t: "c", p: "b.d", c: [3] },
  //   { t: "d", p: "f", c: [{ g: 6 }] },
  // ];
  doChange(o1, d1);
  doInvertedChange(o2, d1);
  console.log("DEBUG: \n", JSON.stringify(o1), "\n", JSON.stringify(o2));
}
