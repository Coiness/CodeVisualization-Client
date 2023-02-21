import { get, post } from "./request";
import { getAccount } from "./token";

export async function createVideo(name: string, content: string) {
  let r = await post("/video/create", { name, content });
  return r.data.id;
}

export async function removeVideo(id: string) {
  let r = await post("/video/remove", { id });
  return r.flag;
}

export async function renameVideo(id: string, name: string) {
  let r = await post("/video/rename", { id, name });
  return r.flag;
}

export async function changeVideoPermission(id: string, permission: number) {
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

export async function searchVideoByUser(account: string) {
  let self = getAccount();
  let r;
  if (account !== self) {
    r = (await get("/video/searchByUser", { account })).data;
  } else {
    r = await getMyVideo();
  }
  return r;
}
