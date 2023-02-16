import { get, post } from "./request";
import { getAccount } from "./token";

export async function createProject(name: string, snapshot: string) {
  let r = await post("/project/create", { name, snapshot });
  return r.data.id;
}

export async function removeProject(id: string) {
  let r = await post("/project/remove", { id });
  return r.flag;
}

export async function renameProject(id: string, name: string) {
  let r = await post("/project/rename", { id, name });
  return r.flag;
}

export async function changePermission(id: string, permission: number) {
  let r = await post("/project/updatePermission", { id, permission });
  return r.flag;
}

export async function getProjectInfo(id: string) {
  let r = await get("/project/loadInfo", { id });
  return r.data;
}

export async function searchProject(name: string) {
  let account = getAccount();
  let r;
  if (account === null) {
    r = await get("/project/search", { name });
  } else {
    r = await get("/project/searchContainMine", { name });
  }
  return r.data;
}

export async function getMyProject() {
  let r = await get("/project/mine", {});
  return r.data;
}
