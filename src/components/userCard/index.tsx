import "./index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as userAPI from "../../net/userAPI";
import { Spin } from "antd";
import { Follow } from "../follow";
import { getAccount } from "../../net/token";

export interface UserCardProps {
  account: string;
}

interface UserCardInfo {
  account: string;
  name: string;
  img: string;
}

export function UserCard(props: UserCardProps) {
  const navigate = useNavigate();
  const [info, setInfo] = useState<UserCardInfo | null>(null);

  useEffect(() => {
    userAPI.getUserInfo(props.account).then((r) => {
      setInfo({
        account: props.account,
        name: r.username,
        img: r.img,
      });
    });
  }, [props.account]);

  if (info === null) {
    return (
      <div className="userCard">
        <div className="loading">
          <Spin></Spin>
        </div>
      </div>
    );
  }

  const isMe = info.account === getAccount();

  function jump() {
    if (info !== null) {
      navigate(`/userInfo?account=${info.account}`);
    }
  }

  return (
    <div className="userCard" onClick={jump}>
      <div
        className="img"
        style={{ backgroundImage: `url(${info.img})` }}
      ></div>
      <div className="username">{info.name}</div>
      <div className="blank"></div>
      <div className="follow">
        {isMe && <Follow account={info.account}></Follow>}
      </div>
    </div>
  );
}
