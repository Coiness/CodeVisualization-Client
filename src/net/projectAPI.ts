import { nav } from "../common/utils";
import { get, post } from "./request";
import { getAccount } from "./token";
import { ResultCode } from "./type";

/*
 * nav 用于导航到指定URL
 * get 用于发送GET请求
 * post 用于发送POST请求
 * getAccount 用于获取当前账号
 * ResultCode 定义了统一的状态响应码格式
 */

// 定义项目信息
export interface ProjectInfo {
  account: string;
  createTime: string;
  description: string;
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

// 定义获取项目响应数据
export interface GetProjectResponseData {
  projects: ProjectInfo[];
}

// 创建项目
export async function createProject(name: string, snapshot: string, description: string) {
  let r = await post("/project/create", { name, snapshot, description });
  return r.data.id;
}

// 移除项目
export async function removeProject(id: string) {
  let r = await post("/project/remove", { id });
  return r.flag;
}

// 重命名项目
export async function renameProject(id: string, name: string) {
  let r = await post("/project/rename", { id, name });
  return r.flag;
}

// 保存项目
export async function saveProject(id: string, snapshot: string) {
  let r = await post("/project/save", { id, snapshot });
  return r.flag;
}

// 更新项目描述
export async function updateProjectDescription(id: string, description: string) {
  let r = await post("/project/updateDescription", { id, description });
  return r.flag;
}

// 更改项目权限
export async function changeProjectPermission(id: string, permission: number) {
  let r = await post("/project/updatePermission", { id, permission });
  return r.flag;
}

// 获取项目信息
export async function getProjectInfo(id: string) {
  let r = await get("/project/loadInfo", { id });
  if (r.code === ResultCode.NoPermission) {
    nav("/projectCenter");
  }
  return r.data;
}

// 搜索项目
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

// 获取我的项目
export async function getMyProject(): Promise<GetProjectResponseData> {
  let r = await get("/project/mine", {});
  return r.data;
}

// 按照用户搜索项目
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
