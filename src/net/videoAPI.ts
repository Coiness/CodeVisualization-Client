import { nav } from "../common/utils";
import { get, post } from "./request";
import { getAccount } from "./token";
import { ResultCode } from "./type";

/*
 * nav 用于导航到指定URL
 * get 用于发送GET请求
 * post 用于发送POST请求
 * getAccount 用于获取当前账号
 * ResultCode 用于存储返回码
 **/

export interface VideoInfo {
  account: string;
  content: string;
  createTime: string;
  descrition: string;
  id: number;
  name: string;
  permission: number;
  user: {
    img: string;
    username: string;
  };
}

export interface GetVideosResponseData {
  videos: VideoInfo[];
}

// 创建视频
export async function createVideo(name: string, content: string, descrition: string) {
  let r = await post("/video/create", { name, content, descrition });
  return r.data.id;
}

// 移除视频
export async function removeVideo(id: string) {
  let r = await post("/video/remove", { id });
  return r.flag;
}

// 重命名视频
export async function renameVideo(id: string, name: string) {
  let r = await post("/video/rename", { id, name });
  return r.flag;
}

//更新视频描述
export async function updateVideoDescrition(id: string, descrition: string) {
  let r = await post("/video/updateDescrition", { id, descrition });
  return r.flag;
}

//更改视频权限
export async function changeVideoPermission(id: string, permission: number) {
  let r = await post("/video/updatePermission", { id, permission });
  return r.flag;
}

//获取视频信息
export async function getVideoInfo(id: string) {
  let r = await get("/video/loadInfo", { id });
  if (r.code === ResultCode.NoPermission) {
    nav("/videoCenter");
  }
  return r.data;
}

//搜索视频
export async function searchVideo(name: string): Promise<GetVideosResponseData> {
  let account = getAccount();
  let r;
  if (account === null) {
    r = await get("/video/search", { name });
  } else {
    r = await get("/video/searchContainMine", { name });
  }
  return r.data;
}

//获取我的视频
export async function getMyVideo(): Promise<GetVideosResponseData> {
  let r = await get("/video/mine", {});
  return r.data;
}

//搜索用户视频
export async function searchVideoByUser(account: string): Promise<GetVideosResponseData> {
  let self = getAccount();
  let r;
  if (account !== self) {
    r = (await get("/video/searchByUser", { account })).data;
  } else {
    r = await getMyVideo();
  }
  return r;
}
