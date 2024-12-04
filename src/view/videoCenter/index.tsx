import "./index.css";
import { Button, Input, message, Popover } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useEffect, useState, useCallback } from "react";
import * as videoAPI from "../../net/videoAPI";
import { downloadString, getDateString, getIntRandom, randomColor } from "../../common/utils";
import { DeleteOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/loading";
import { UserCard } from "../../components/userCard";
import { Empty } from "../../components/empty";
import { useAccount } from "../../components/header/userInfo";
import { DownloadVideoInfo, getVideoInfo } from "../videoPlay";
import { openDialog } from "../dialogs/dialog";
import { FileEndNameMap, FileType } from "../../components/uploadFile";
import { isLogin } from "../../net/token";

export type Video = {
  id: string;
  name: string;
  user: {
    account: string;
    img: string;
    name: string;
  };
  createTime: number;
  bgi: string;
  permission: number;
};

export function constructVideoList(videos: videoAPI.VideoInfo[]): Video[] {
  return videos.map((item: any) => {
    let deg = getIntRandom(0, 180);
    let c1 = randomColor(180, 220);
    let c2 = randomColor(180, 220);
    return {
      id: item.id,
      name: item.name,
      user: {
        account: item.account,
        img: item.user.img,
        name: item.user.username,
      },
      createTime: parseInt(item.createTime),
      bgi: `linear-gradient(${deg}deg, ${c1}, ${c2})`,
      permission: item.permission,
    };
  });
}

export function VideoCenter() {
  const [videoList, setList] = useState<Video[] | null>(null);

  async function getVideoList(type: "all" | "search" | "mine", search?: string) {
    let list: videoAPI.VideoInfo[] = [];
    if (type === "all") {
      let res = await videoAPI.searchVideo("");
      list = res.videos;
    } else if (type === "search") {
      let res = await videoAPI.searchVideo(search ?? "");
      list = res.videos;
    } else if (type === "mine") {
      if (!isLogin()) {
        message.info("请先登录");
        openDialog("login");
        return;
      }
      let res = await videoAPI.getMyVideo();
      list = res.videos;
    }
    setList(constructVideoList(list));
  }

  useEffect(() => {
    getVideoList("all");
  }, []);

  return (
    <div className="videoCenter">
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <div className="videoCenterContent">
        <div className="left">
          <div className="search">
            <Input.Search
              onSearch={(e) => {
                getVideoList("search", e);
              }}
            ></Input.Search>
          </div>
          <div className="all">
            <Button type="text" onClick={() => getVideoList("all")}>
              全部录像
            </Button>
          </div>
          <div className="mine">
            <Button type="text" onClick={() => getVideoList("mine")}>
              我的录像
            </Button>
          </div>
          <div className="blank"></div>
          <div className="upload">
            <Button
              type="default"
              onClick={() => {
                openDialog("uploadFileDialog", FileType.Video);
              }}
            >
              上传录像
            </Button>
          </div>
        </div>
        <div className="right">
          <VideoList list={videoList}></VideoList>
        </div>
      </div>
    </div>
  );
}

export function VideoList(props: { list: Video[] | null }) {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const navigate = useNavigate();
  const account = useAccount();

  useEffect(() => {
    setVideos(props.list);
  }, [props.list]);

  const downloadVideo = useCallback(async (id: string) => {
    let data = await getVideoInfo(id);
    if (data === null) {
      message.error("下载失败");
      return;
    }
    let info = {
      name: data.name,
      video: data.video,
      description: data.description,
    } as DownloadVideoInfo;
    downloadString(`${data.name}.${FileEndNameMap[FileType.Video]}`, JSON.stringify(info));
  }, []);

  return videos ? (
    videos.length > 0 ? (
      <div className="listContainer">
        <div className="videoList">
          {videos.map((item) => {
            const editable = item.user.account === account;
            const readable = true;
            return (
              <div
                className="video"
                key={item.id}
                style={{
                  backgroundImage: item.bgi,
                }}
              >
                <div className="name">{item.name}</div>
                <div className="control">
                  <div className="btns">
                    {readable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          navigate(`/videoPlay?id=${item.id}`);
                        }}
                      ></Button>
                    )}
                    {readable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          downloadVideo(item.id);
                        }}
                      ></Button>
                    )}
                    {editable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<DeleteOutlined />}
                        onClick={async () => {
                          const confirm = await openDialog("confirmDialog", {
                            content: "确定要删除该录像吗",
                            okText: "确定",
                            cancelText: "取消",
                          });
                          if (!confirm) {
                            return;
                          }
                          let res = await videoAPI.removeVideo(item.id);
                          if (res && videos) {
                            let newArr = [];
                            for (let i = 0; i < videos.length; i++) {
                              if (videos[i].id !== item.id) {
                                newArr.push(videos[i]);
                              }
                            }
                            setVideos(newArr);
                          }
                        }}
                      ></Button>
                    )}
                  </div>
                </div>
                <div className="user">
                  <Popover
                    overlayInnerStyle={{ padding: "0px" }}
                    placement="right"
                    trigger={"click"}
                    zIndex={500}
                    content={<UserCard account={item.user.account} width="300px"></UserCard>}
                  >
                    <div className="img" style={{ backgroundImage: `url(${item.user.img})` }}></div>
                  </Popover>
                </div>
                <div className="time">创建时间：{getDateString(item.createTime)}</div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="listContainer">
        <Empty></Empty>
      </div>
    )
  ) : (
    <Loading></Loading>
  );
}
