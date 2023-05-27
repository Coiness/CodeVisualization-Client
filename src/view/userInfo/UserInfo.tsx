import "./index.css";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useCallback, useEffect, useState } from "react";
import { getAccount } from "../../net/token";
import { getLocationQuery } from "../../common/utils";
import { useLocation, useNavigate } from "react-router-dom";
import * as userAPI from "../../net/userAPI";
import { Button, Input, Menu, Modal, message } from "antd";
import { Follow } from "../../components/follow";
import { UserCard } from "../../components/userCard";
import { Works } from "./Works";
import { Empty } from "../../components/empty";
import { EditOutlined } from "@ant-design/icons";
import { closeDialog, openDialog } from "../dialogs/dialog";
import Dragger from "antd/es/upload/Dragger";
import { Loading } from "../../components/loading";
import { RcFile } from "antd/es/upload";

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
          onClick={() => {
            if (isMe) {
              openDialog("uploadImageDialog");
            }
          }}
        ></div>
        <div className="username">
          {usernameMode === "view" && (
            <>
              <div className="name">{info.name}</div>
              {isMe && (
                <Button
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setUsernameMode("edit");
                  }}
                ></Button>
              )}
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
                  const name = (e.nativeEvent.target as any).value.trim();
                  if (!name) {
                    message.error("名称不能为空");
                    setUsernameMode("view");
                    return;
                  }
                  let res = await userAPI.modifyUsername(name);
                  if (res) {
                    message.success("修改成功");
                    setInfo({
                      ...info,
                      name: name,
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

export function UploadImageDialog(visible: boolean) {
  const [uploading, setUploading] = useState<boolean>(false);

  const closePanel = useCallback(() => {
    closeDialog("uploadImageDialog");
  }, []);

  const upload = useCallback(
    async (file: RcFile) => {
      let res = await userAPI.uploadImage(file);
      if (res) {
        message.success("上传成功");
        window.location.reload();
      }
      setUploading(false);
      if (res) {
        closePanel();
      }
    },
    [setUploading, closePanel]
  );

  return (
    <Modal
      open={visible}
      maskClosable={true}
      onCancel={closePanel}
      footer={null}
      width={400}
      closable={false}
    >
      <div className="upload" style={{ height: "200px" }}>
        {!uploading && (
          <Dragger
            name="file"
            multiple={false}
            beforeUpload={async (file) => {
              setUploading(true);
              upload(file);
              return false;
            }}
            showUploadList={false}
          >
            请选择图片或拖拽上传
          </Dragger>
        )}
        {uploading && <Loading></Loading>}
      </div>
    </Modal>
  );
}
