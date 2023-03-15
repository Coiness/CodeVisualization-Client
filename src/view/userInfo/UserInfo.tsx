import "./index.css";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useEffect, useState } from "react";
import { getAccount } from "../../net/token";
import { getLocationQuery } from "../../common/utils";
import { useLocation, useNavigate } from "react-router-dom";
import * as userAPI from "../../net/userAPI";
import { Button, Input, Menu, message } from "antd";
import { Follow } from "../../components/follow";
import { UserCard } from "../../components/userCard";
import { Works } from "./Works";
import { Empty } from "../../components/empty";
import { EditOutlined } from "@ant-design/icons";

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

type UserList = {
  account: string;
  name: string;
  img: string;
}[];

export interface UserInfoData {
  account: string;
  name: string;
  img: string;
  followList: UserList;
  fansList: UserList;
}

function Content() {
  const [info, setInfo] = useState<UserInfoData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [friendNow, setFriendNow] = useState<string>("follow");
  const [usernameMode, setUsernameMode] = useState<"edit" | "view">("view");

  useEffect(() => {
    const r = getLocationQuery("account", location.search);
    if (!r) {
      navigate("/");
      return;
    }
    const account: string = r;
    userAPI.getUserInfo(account).then(async (info) => {
      const followList = await userAPI.getFollowList(account);
      const fansList = await userAPI.getFansList(account);

      setInfo({
        account,
        name: info.username,
        img: info.img,
        followList,
        fansList,
      });
    });
  }, [location, navigate]);

  if (info === null) {
    return null;
  }

  const isMe = info.account === getAccount();

  const friendMenuData = [
    {
      label: (
        <>
          <div style={{ height: "24px", lineHeight: "24px" }}>关注</div>
          <div style={{ height: "24px", lineHeight: "15px", fontSize: "12px" }}>
            {info.followList.length}
          </div>
        </>
      ),
      key: "follow",
    },
    {
      label: (
        <>
          <div style={{ height: "24px", lineHeight: "24px" }}>粉丝</div>
          <div style={{ height: "24px", lineHeight: "15px", fontSize: "12px" }}>
            {info.fansList.length}
          </div>
        </>
      ),
      key: "fans",
    },
  ];

  return (
    <div className="userInfoContent">
      <div className="baseInfo">
        <div
          className="img"
          style={{ backgroundImage: `url(${info.img})` }}
        ></div>
        <div className="username">
          {usernameMode === "view" && (
            <>
              <div className="name">{info.name}</div>
              <Button
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  setUsernameMode("edit");
                }}
              ></Button>
            </>
          )}
          {usernameMode === "edit" && (
            <Input
              defaultValue={info.name}
              onBlur={() => {
                setUsernameMode("view");
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const text = (e.nativeEvent.target as any).value;
                  let res = await userAPI.modifyUsername(text);
                  if (res) {
                    message.success("修改成功");
                    setInfo({
                      ...info,
                      name: text,
                    });
                  } else {
                    message.error("修改失败");
                  }
                  setUsernameMode("view");
                }
              }}
            ></Input>
          )}
        </div>
        <div className="blank"></div>
        <div className="follow">
          {!isMe && <Follow account={info.account}></Follow>}
        </div>
      </div>
      <div className="bottom">
        <div className="friend">
          <Menu
            className="friendMenu"
            mode="horizontal"
            items={friendMenuData}
            onClick={(info) => {
              setFriendNow(info.key);
            }}
            defaultActiveFirst
          ></Menu>
          <div className="blank"></div>
          {friendNow === "follow" && (
            <UserListComp list={info.followList}></UserListComp>
          )}
          {friendNow === "fans" && (
            <UserListComp list={info.fansList}></UserListComp>
          )}
        </div>
        <Works account={info.account}></Works>
      </div>
    </div>
  );
}

function UserListComp(props: { list: UserList }) {
  const list = props.list;
  return list.length > 0 ? (
    <div className="userList">
      {list.map((item) => {
        return <UserCard account={item.account}></UserCard>;
      })}
    </div>
  ) : (
    <div style={{ flex: 1 }}>
      <Empty></Empty>
    </div>
  );
}
