import { nav } from "../common/utils";
import { get, post } from "./request";
import { getAccount } from "./token";
import { ResultCode } from "./type";

export interface ProjectInfo {
  account: string;
  createTime: string;
  descrition: string;
  id: number;
  modifyTime: string;
  name: string;
  persimmion: number;
  snapshot: string;
  user: {
    img: string;
    username: string;
  };
}

export interface GetProjectResponseData {
  projects: ProjectInfo[];
}

export async function createProject(name: string, snapshot: string, descrition: string) {
  let r = await post("/project/create", { name, snapshot, descrition });
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

export async function saveProject(id: string, snapshot: string) {
  let r = await post("/project/save", { id, snapshot });
  return r.flag;
}
export async function updateProjectDescrition(id: string, descrition: string) {
  let r = await post("/project/updateDescrition", { id, descrition });
  return r.flag;
}

export async function changeProjectPermission(id: string, permission: number) {
  let r = await post("/project/updatePermission", { id, permission });
  return r.flag;
}

export async function getProjectInfo(id: string) {
  let r = await get("/project/loadInfo", { id });
  if (r.code === ResultCode.NoPermission) {
    nav("/projectCenter");
  }
  return r.data;
}

export async function searchProject(name: string): Promise<GetProjectResponseData> {
  let account = getAccount();
  let r;
  if (account === null) {
    r = await get("/project/search", { name });
  } else {
    r = await get("/project/searchContainMine", { name });
  }
  return r.data;
}

export async function getMyProject(): Promise<GetProjectResponseData> {
  let r = await get("/project/mine", {});
  return r.data;
}

export async function searchProjectByUser(account: string): Promise<GetProjectResponseData> {
  let self = getAccount();
  let r;
  if (account !== self) {
    r = (await get("/project/searchByUser", { account })).data;
  } else {
    r = await getMyProject();
  }
  return r;
}
