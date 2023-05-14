import { get, post } from "./request";
import { clear, setAccount, setToken } from "./token";

export enum RegisterErrorCode {
  Success = "success",
  CheckCodeError = "CheckCodeError", // 验证码错误
  AccountExist = "AccountExist", // 账号已存在
  InvitationCodeUsed = "InvitationCodeUsed", // 邀请码已经被使用
  InvitationCodeInvalid = "InvitationCodeInvalid", // 邀请码无效
  Other = "other", // 其它未知错误
}

export async function sendCheckCode(account: string): Promise<boolean> {
  let r = await post("/user/sendCheckCode", { account });
  return r.flag;
}

export async function register(
  account: string,
  pwd: string,
  checkCode: string,
  invitationCode: string
): Promise<{ flag: boolean; code: RegisterErrorCode }> {
  let r = await post("/user/register", {
    account,
    pwd,
    checkCode,
    invitationCode,
  });
  return { flag: r.flag, code: r.data.code };
}

export async function login(account: string, pwd: string): Promise<boolean> {
  let r = await post("/user/login", { account, pwd });
  if (r.flag) {
    setAccount(account);
    setToken(r.data.token);
  }
  return r.flag;
}

export function logout() {
  clear();
}

export type UserInfoData = {
  username: string;
  img: string;
};

export async function getUserInfo(account: string): Promise<UserInfoData> {
  let r = await get("/user/getUserInfo", { account });
  return r.data;
}

export async function modifyUsername(username: string) {
  let res = await post("/user/modifyUsername", { username });
  return res.flag;
}

export async function follow(account: string) {
  let res = await post("/user/follow", { followAccount: account });
  return res.flag;
}

export async function cancelfollow(account: string) {
  let res = await post("/user/removeFollow", { followAccount: account });
  return res.flag;
}

export async function getFollowInfo(account: string): Promise<any> {
  let res = await get("/user/getFollowInfo", { followAccount: account });
  return {
    ...res.data,
  };
}

export async function getFollowList(account: string) {
  let res = await get("/user/followList", { account });
  return res.data.list;
}

export async function getFansList(account: string) {
  let res = await get("/user/fansList", { account });
  return res.data.list;
}
