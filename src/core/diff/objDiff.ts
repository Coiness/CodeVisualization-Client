import { get, cloneDeep } from "lodash";
import { Subject } from "../../common/utils";
import { CommonModel } from "../../components/widget/widgets";
import { Obj } from "../types";

// export function objDiff(o1: any, o2: any): ChangeSet {
//   return [];
// }

// function diffDfs(o1: Obj, o2: Obj, cs: ChangeSet, p: string) {
//   for (let attr in o1) {
//     if (o2.hasOwnProperty(attr)) {
//     }
//   }
// }
export const modelChange = new Subject<CommonModel>();

export type ChangeSet = {
  modelPath: string; // 对应逻辑层 model path
  t: "u" | "d" | "c"; // 操作类型
  p: string; // 操作路径 path
  c: any[]; // 具体操作
}[];

export function getModelByPath(obj: Obj, path: string): CommonModel {
  const res = get(obj, path);
  return res;
}

export function doChange(obj: Obj, cs: ChangeSet) {
  cs.forEach((change) => {
    const path = change.p.split(".");
    let attr = path.pop();
    let p = path.join(".");
    let o = obj;
    if (p !== "") {
      o = get(obj, p);
    }
    if (!o || !attr) {
      console.log("DEBUG: ", o, attr);
      throw new Error("doChange error, o or attr is undefined");
    }
    if (change.t === "u") {
      o[attr] = change.c[1];
    } else if (change.t === "d") {
      delete o[attr];
    } else if (change.t === "c") {
      o[attr] = change.c[0];
    }
    modelChange.next(getModelByPath(obj, change.modelPath));
  });
}

export function doInvertedChange(obj: Obj, cs: ChangeSet) {
  doChange(obj, getInvertedChangeSet(cs));
}

function getInvertedChangeSet(cs: ChangeSet) {
  cs = cloneDeep(cs);
  cs.forEach((change) => {
    if (change.t === "c") {
      change.t = "d";
    } else if (change.t === "d") {
      change.t = "c";
    } else if (change.t === "u") {
      let temp = change.c[0];
      change.c[0] = change.c[1];
      change.c[1] = temp;
    }
  });
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
  // doChange(o1, d1);
  doInvertedChange(o2, d1);
  console.log("DEBUG: \n", JSON.stringify(o1), "\n", JSON.stringify(o2));
}
