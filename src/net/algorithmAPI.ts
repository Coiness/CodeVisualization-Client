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

export interface AlgorithmInfo {
  account: string;
  content: string;
  createTime: string;
  descrition: string;
  id: number;
  modifyTime: string;
  name: string;
  permission: number;
  user: {
    img: string;
    username: string;
  };
}

// 定义获取算法列表式的响应结构
export interface GetAlgorithmResponseData {
  algorithms: AlgorithmInfo[];
}

// 创建算法
export async function createAlgorithm(name: string, content: string, descrition: string) {
  let r = await post("/algorithm/create", { name, content, descrition });
  return r.data.id;
}

// 移除算法
export async function removeAlgorithm(id: string) {
  let r = await post("/algorithm/remove", { id });
  return r.flag;
}

// 重命名算法
export async function renameAlgorithm(id: string, name: string) {
  let r = await post("/algorithm/rename", { id, name });
  return r.flag;
}

// 保存算法
export async function saveAlgorithm(id: string, content: string) {
  let r = await post("/algorithm/save", { id, content });
  return r.flag;
}

// 更新算法描述
export async function updateAlgorithmDescrition(id: string, descrition: string) {
  let r = await post("/algorithm/updateDescrition", { id, descrition });
  return r.flag;
}

// 更改算法权限
export async function changeAlgorithmPermission(id: string, permission: number) {
  let r = await post("/algorithm/updatePermission", { id, permission });
  return r.flag;
}

// 获取算法信息
export async function getAlgorithmInfo(id: string) {
  let r = await get("/algorithm/loadInfo", { id });
  if (r.code === ResultCode.NoPermission) {
    nav("/algorithmCenter");
  }
  return r.data;
}

// 根据名称搜索算法
export async function searchAlgorithm(name: string): Promise<GetAlgorithmResponseData> {
  let account = getAccount();
  let r;
  if (account === null) {
    r = await get("/algorithm/search", { name });
  } else {
    r = await get("/algorithm/searchContainMine", { name });
  }
  return r.data;
}

// 获取我的算法
export async function getMyAlgorithm(): Promise<GetAlgorithmResponseData> {
  let r = await get("/algorithm/mine", {});
  return r.data;
}

// 根据用户搜索算法
export async function searchAlgorithmByUser(account: string): Promise<GetAlgorithmResponseData> {
  let self = getAccount();
  let r;
  if (account !== self) {
    r = (await get("/algorithm/searchByUser", { account })).data;
  } else {
    r = await getMyAlgorithm();
  }
  return r;
}
