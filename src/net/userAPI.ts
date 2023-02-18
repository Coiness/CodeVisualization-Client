import { get, post } from "./request";
import { clear, setAccount, setToken } from "./token";

export async function register(account: string, pwd: string): Promise<boolean> {
  let r = await post("/user/register", { account, pwd });
  return r.flag;
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

export async function modifyUsername() {}

export async function getFollowInfo(account: string): Promise<any> {
  return {
    followed: false,
    reverseFollowed: false,
  };
}
