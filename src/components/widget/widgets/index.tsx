import { Obj } from "../../../core";
import { snapshot } from "../../../store";
import { BaseModel } from "./type";

export * from "./type";
export * from "./widgetRenders";
export * from "./numberWidget";

export function getModelById(id: string): BaseModel | null {
  const s = snapshot.get();
  if (s === null) {
    throw new Error("get model by id: snapshot is null");
  }
  return getModelByIdDfs(id, s);
}

function getModelByIdDfs(id: string, now: Obj): BaseModel | null {
  if (now["id"] === id) {
    return now as BaseModel;
  }
  for (let attr in now) {
    if (typeof now[attr] === "object") {
      const res = getModelByIdDfs(id, now[attr]);
      if (res !== null) {
        return res;
      }
    }
  }
  return null;
}
