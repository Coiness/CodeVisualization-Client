import { get, post } from "./request";
import { getAccount } from "./token";

export async function createAlgorithm(name: string, content: string) {
  let r = await post("/algorithm/create", { name, content });
  return r.data.id;
}

export async function removeAlgorithm(id: string) {
  let r = await post("/algorithm/remove", { id });
  return r.flag;
}

export async function renameAlgorithm(id: string, name: string) {
  let r = await post("/algorithm/rename", { id, name });
  return r.flag;
}

export async function changeAlgorithmPermission(
  id: string,
  permission: number
) {
  let r = await post("/algorithm/updatePermission", { id, permission });
  return r.flag;
}

export async function getAlgorithmInfo(id: string) {
  let r = await get("/algorithm/loadInfo", { id });
  return r.data;
}

export async function searchAlgorithm(name: string) {
  let account = getAccount();
  let r;
  if (account === null) {
    r = await get("/algorithm/search", { name });
  } else {
    r = await get("/algorithm/searchContainMine", { name });
  }
  return r.data;
}

export async function getMyAlgorithm() {
  let r = await get("/algorithm/mine", {});
  return r.data;
}

export async function searchAlgorithmByUser(account: string) {
  let self = getAccount();
  let r;
  if (account !== self) {
    r = (await get("/algorithm/searchByUser", { account })).data;
  } else {
    r = await getMyAlgorithm();
  }
  return r;
}
