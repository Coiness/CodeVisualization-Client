import "./userInfo.css";
import { useEffect, useState } from "react";
import { getUserInfo, UserInfoData, logout as lo } from "../../../net";
import { getAccount, getToken } from "../../../net/token";
import { Button, Divider, Popover } from "antd";
import { nowAccount } from "../../../store";
import { openDialog } from "../../../view/dialogs/dialog";
import { useNavigate } from "react-router-dom";

export const DefaultImg = "/image/get?fileName=Default";

function logined(): string | null {
  let account = getAccount();
  let token = getToken();
  if (account === null || token === null) {
    return null;
  } else {
    if (nowAccount.get() !== account) {
      nowAccount.set(account);
    }
    return account;
  }
}

function logout() {
  lo();
}

export function useAccount(): string | null {
  const [account, setAccount] = useState<string | null>(logined());
  useEffect(() => {
    let sub = nowAccount.subscribe((ac) => {
      setAccount(ac);
    });
    return sub.unsubscribe;
  }, []);
  return account;
}

export function UserInfo() {
  const account = useAccount();
  const [name, setName] = useState<string | null>(null);
  const [img, setImg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [setName, setImg, account, img, name]);

  function openLoginDialog() {
    openDialog("login");
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
          {account && <div className="username singleLineHidden">{name}</div>}
          {account && (
            <Button
              type="text"
              onClick={() => {
                navigate(`/userInfo?account=${account}`);
              }}
            >
              个人中心
            </Button>
          )}
          <Divider className="divider" />
          {!account && (
            <Button type="text" onClick={openLoginDialog}>
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
