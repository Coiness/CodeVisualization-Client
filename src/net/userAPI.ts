import { message } from "antd";
import { get, post } from "./request";
import { clear, setAccount, setToken } from "./token";

/*
 * get 用于发送GET请求
 * post 用于发送POST请求
 * clear 用于清除本地存储
 * setAccount 用于设置账号
 * setToken 用于设置token
 **/

export enum RegisterErrorCode {
  Success = "success",
  CheckCodeError = "CheckCodeError", // 验证码错误
  AccountExist = "AccountExist", // 账号已存在
  InvitationCodeUsed = "InvitationCodeUsed", // 邀请码已经被使用
  InvitationCodeInvalid = "InvitationCodeInvalid", // 邀请码无效
  Other = "other", // 其它未知错误
}

// 发送验证码
export async function sendCheckCode(account: string): Promise<boolean> {
  let r = await post("/user/sendCheckCode", { account });
  return r.flag;
}

// 注册
export async function register(
  account: string,
  pwd: string,
  checkCode: string,
  invitationCode: string,
): Promise<{ flag: boolean; code: RegisterErrorCode }> {
  let r = await post("/user/register", {
    account,
    pwd,
    checkCode,
    invitationCode,
  });
  return { flag: r.flag, code: r.data.code };
}

// 登录
export async function login(account: string, pwd: string): Promise<boolean> {
  let r = await post("/user/login", { account, pwd });
  if (r.flag) {
    setAccount(account);
    setToken(r.data.token);
  }
  return r.flag;
}

// 退出登录
export function logout() {
  clear();
  window.location.reload();
}

// 定义用户信息
export type UserInfoData = {
  username: string;
  img: string;
};

// 获取用户信息
export async function getUserInfo(account: string): Promise<UserInfoData> {
  let r = await get("/user/getUserInfo", { account });
  return r.data;
}

// 修改用户名
export async function modifyUsername(username: string) {
  let res = await post("/user/modifyUsername", { username });
  return res.flag;
}

// 关注用户
export async function follow(account: string) {
  let res = await post("/user/follow", { followAccount: account });
  return res.flag;
}

// 取消关注
export async function cancelfollow(account: string) {
  let res = await post("/user/removeFollow", { followAccount: account });
  return res.flag;
}

// 获取关注信息
export async function getFollowInfo(account: string) {
  let res = await get("/user/getFollowInfo", { followAccount: account });
  return {
    ...res.data,
  };
}

// 获取关注列表
export async function getFollowList(account: string) {
  let res = await get("/user/followList", { account });
  return res.data.list;
}

// 获取粉丝列表
export async function getFansList(account: string) {
  let res = await get("/user/fansList", { account });
  return res.data.list;
}

// 上传头像
export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  let res = await post("/user/uploadImage", form);
  return res.flag;
}
