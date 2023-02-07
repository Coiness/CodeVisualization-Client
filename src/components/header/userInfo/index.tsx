import "./userInfo.css";
import { useState } from "react";
import { getUserInfo, UserInfoData, logout as lo } from "../../../net";
import { getAccount, getToken } from "../../../net/token";
import { Button, Divider, Popover } from "antd";
import { openLogin } from "../../login";

export const DefaultImg =
  "data:image/jpeg;base64,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";

function logined(): string | null {
  let account = getAccount();
  let token = getToken();
  if (account === null || token === null) {
    return account;
  } else {
    return null;
  }
}

function logout() {
  lo();
  // TODO 更新 account 状态
}

export function useAccount(): string | null {
  const [account, setAccount] = useState<string | null>(logined());
  // TODO 监听 account 变化并更新 state
  return account;
}

export function UserInfo() {
  const account = useAccount();
  const [name, setName] = useState<string | null>(null);
  const [img, setImg] = useState<string | null>(null);
  if (account === null) {
    if (name !== null || img !== null) {
      setName(null);
      setImg(null);
    }
  } else {
    if (name === null || img === null) {
      getUserInfo(account).then((info: UserInfoData) => {
        setName(info.username);
        setImg(info.img);
      });
    }
  }

  function openDialog() {
    openLogin();
  }

  return (
    <Popover
      placement="bottomRight"
      // trigger={"click"}
      content={
        <div className="userInfoPopover">
          <div
            className="innerUserImg"
            style={{
              backgroundImage: `url(${account ? (img as string) : DefaultImg})`,
            }}
          ></div>
          <div>{account ? name : "未登录"}</div>
          <Divider className="divider" />
          {!account && (
            <Button type="text" onClick={openDialog}>
              登录
            </Button>
          )}
          {account && (
            <Button type="text" onClick={logout}>
              退出登录
            </Button>
          )}
        </div>
      }
    >
      <div
        className="outterUserImg"
        style={{
          backgroundImage: `url(${account ? (img as string) : DefaultImg})`,
        }}
      ></div>
    </Popover>
  );
}
