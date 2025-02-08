import exp from "constants";
import { get, post } from "./request";
import { ResultCode } from "./type";

/*
 * nav 用于导航到指定URL
 * get 用于发送GET请求
 * post 用于发送POST请求
 * getAccount 用于获取当前账号
 * ResultCode 定义了统一的状态响应码格式
 */

export interface Chat {
  id: string;
  name: string;
  time: string;
}

export interface GetChatResponseData {
  chats: Chat[];
}

// 获取聊天列表
// 不用传参，在token中获取用户信息
export async function getChatList(): Promise<GetChatResponseData> {
  let res = await get("chat/list", {});
  return res.data.sort((a: Chat, b: Chat) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
}

// 更改聊天名称
export async function renamechat(id: string, name: string) {
  let res = await post("chat/rename", { id, name });
  return res.flag;
}

// 删除聊天
export async function deletechat(id: string) {
  let res = await post("chat/delete", { id });
  return res.flag;
}

// 新增聊天
export async function addchat(): Promise<Chat> {
  let res = await get("chat/add", {});
  return res.data;
}
