import exp from "constants";
import { get, post } from "./request";
import { ResultCode } from "./type";
import { getAccount } from "./token";

/*
 * nav 用于导航到指定URL
 * get 用于发送GET请求
 * post 用于发送POST请求
 * getAccount 用于获取当前账号
 * ResultCode 定义了统一的状态响应码格式
 */

export interface Chat {
  account: string;
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
  let res = await get("/chat/list", {});
  const sortedChats = res.data.chats.sort((a: Chat, b: Chat) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
  return { chats: sortedChats };
}

// 更改聊天名称
export async function renamechat(id: string, name: string): Promise<boolean> {
  let res = await post("/chat/rename", { id, name });
  return res.flag;
}

// 删除聊天
export async function deletechat(id: string): Promise<boolean> {
  let res = await post("/chat/delete", { id });
  return res.flag;
}

// 新增聊天
export async function addchat(): Promise<Chat> {
  let res = await post("/chat/add", {});
  console.log("chat/add的回复res", res);
  console.log("chat/add的回复res.data的id", res.data.id);
  let newChat: Chat;
  let account = getAccount();
  if (account) {
    newChat = {
      account: account,
      id: res.data.id,
      name: "新对话",
      time: new Date().toISOString(),
    };
    console.log("chat/add的回复newChat", newChat);
    return newChat;
  } else {
    newChat = {
      account: "",
      id: "",
      name: "未登录（不过这种情况真的存在吗）",
      time: new Date().toISOString(),
    };
    return newChat;
  }
}
