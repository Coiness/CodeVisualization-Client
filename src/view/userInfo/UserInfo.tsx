import "./index.css";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useEffect, useState } from "react";
import { getAccount } from "../../net/token";
import { getLocationQuery } from "../../common/utils";
import { useLocation, useNavigate } from "react-router-dom";
import * as userAPI from "../../net/userAPI";
import { Button } from "antd";
import { Follow } from "../../components/follow";

export function UserInfo() {
  return (
    <div className="userInfo">
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <Content></Content>
    </div>
  );
}

export interface UserInfoData {
  account: string;
  name: string;
  img: string;
}

function Content() {
  const [info, setInfo] = useState<UserInfoData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const r = getLocationQuery("account", location.search);
    if (!r) {
      navigate("/");
      return;
    }
    const account: string = r;
    userAPI.getUserInfo(account).then((info) => {
      setInfo({
        account,
        name: info.username,
        img: info.img,
      });
    });
  }, []);
  if (info === null) {
    return null;
  }

  const isMe = info.account === getAccount();

  return (
    <div className="userInfoContent">
      <div className="baseInfo">
        <div
          className="img"
          style={{ backgroundImage: `url(${info.img})` }}
        ></div>
        <div className="username">{info.name}</div>
        <div className="blank"></div>
        <div className="follow">
          {!isMe && <Follow account={info.account}></Follow>}
        </div>
      </div>
      <div className="bottom">
        <div className="friend"></div>
        <div className="works"></div>
      </div>
    </div>
  );
}
