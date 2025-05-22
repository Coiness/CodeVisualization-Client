import { get, post } from "./request";
import { getAccount } from "./token";

function formatDateTime(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/*
 * nav 用于导航到指定URL
 * get 用于发送GET请求
 * post 用于发送POST请求
 * getAccount 用于获取当前账号
 * ResultCode 定义了统一的状态响应码格式
 */

export interface Chat {
  account: string;
  chat_id: string;
  title: string;
  time: string;
}

export interface GetChatResponseData {
  chats: Chat[];
}

// 获取聊天列表
// 不用传参，在token中获取用户信息
export async function getChatList(): Promise<GetChatResponseData | null> {
  let res = await get("/chat/list", {});
  console.log("res", res);
  console.log("res.data.chats:", res.data);
  if (res.data === null) {
    return null;
  }
  let sortedChats = res.data.sort((a: Chat, b: Chat) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
  return { chats: sortedChats };
}

// 更改聊天名称
export async function renamechat(chat_id: string, name: string): Promise<boolean> {
  let res = await post("/chat/rename", { chat_id, name });
  return res.flag;
}

// 删除聊天
export async function deletechat(chat_id: string): Promise<boolean> {
  let res = await post("/chat/delete", { chat_id });
  return res.flag;
}

// 新增聊天
// 后端创建后会返回一个chat_id
export async function addchat(): Promise<Chat> {
  let res = await post("/chat/add", {});
  let newChat: Chat;
  let account = getAccount();
  if (account) {
    newChat = {
      account: account,
      chat_id: res.data.chat_id,
      title: "新对话"+ formatDateTime(new Date()),
      time: new Date().toISOString(),
    };
    return newChat;
  } else {
    newChat = {
      account: "",
      chat_id: "",
      title: "未登录（不过这种情况真的存在吗）",
      time: new Date().toISOString(),
    };
    return newChat;
  }
}
