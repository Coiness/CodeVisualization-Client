import { get, post } from "./request";
import { getAccount } from "./token";

export async function createVideo(name: string, content: string) {
  let r = await post("/video/create", { name, content });
  return r.data;
}

export async function removeVideo(id: string) {
  let r = await post("/video/remove", { id });
  return r.flag;
}

export async function renameVideo(id: string, name: string) {
  let r = await post("/video/rename", { id, name });
  return r.flag;
}

export async function changePermission(id: string, permission: number) {
  let r = await post("/video/updatePermission", { id, permission });
  return r.flag;
}

export async function getVideoInfo(id: string) {
  let r = await get("/video/loadInfo", { id });
  return r.data;
}

export async function searchVideo(name: string) {
  let account = getAccount();
  let r;
  if (account === null) {
    r = await get("/video/search", { name });
  } else {
    r = await get("/video/searchContainMine", { name });
  }
  return r.data;
}

export async function getMyVideo() {
  let r = await get("/video/mine", {});
  return r.data;
}
