import "./index.css";
import { Button, Input, Popover, message } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useEffect, useState, useCallback } from "react";
import * as projectAPI from "../../net/projectAPI";
import {
  downloadString,
  getDateString,
  getIntRandom,
  randomColor,
} from "../../common/utils";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/loading";
import { UserCard } from "../../components/userCard";
import { Empty } from "../../components/empty";
import { useAccount } from "../../components/header/userInfo";
import { DownloadProjectInfo, getProjectData } from "../project";
import { openDialog } from "../dialogs/dialog";
import { FileEndNameMap, FileType } from "../../components/uploadFile";
import { isLogin } from "../../net/token";

export type Project = {
  id: string;
  name: string;
  user: {
    account: string;
    img: string;
    name: string;
  };
  createTime: number;
  modifyTime: number;
  bgi: string;
  permission: number;
};

export function constructProjectList(videos: any[]): Project[] {
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
      modifyTime: parseInt(item.modifyTime),
      bgi: `linear-gradient(${deg}deg, ${c1}, ${c2})`,
      permission: item.permission,
    };
  });
}

export function ProjectCenter() {
  const [projectList, setList] = useState<Project[] | null>(null);
  const navigate = useNavigate();

  async function getProjectList(
    type: "all" | "search" | "mine",
    search?: string
  ) {
    let list: any[] = [];
    if (type === "all") {
      let res = await projectAPI.searchProject("");
      list = res.projects;
    } else if (type === "search") {
      let res = await projectAPI.searchProject(search ?? "");
      list = res.projects;
    } else if (type === "mine") {
      if (!isLogin()) {
        message.info("请先登录");
        openDialog("login");
        return;
      }
      let res = await projectAPI.getMyProject();
      list = res.projects;
    }
    setList(constructProjectList(list));
  }

  useEffect(() => {
    getProjectList("all");
  }, []);

  return (
    <div className="projectCenter">
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <div className="projectCenterContent">
        <div className="left">
          <div className="search">
            <Input.Search
              onSearch={(e) => getProjectList("search", e)}
            ></Input.Search>
          </div>
          <div className="all">
            <Button type="text" onClick={() => getProjectList("all")}>
              全部演示
            </Button>
          </div>
          <div className="mine">
            <Button type="text" onClick={() => getProjectList("mine")}>
              我的演示
            </Button>
          </div>
          <div className="blank"></div>
          <div className="upload">
            <Button
              type="default"
              onClick={() => {
                openDialog("uploadFileDialog", FileType.Project);
              }}
            >
              上传演示
            </Button>
          </div>
          <div className="create">
            <Button
              type="default"
              onClick={() => {
                navigate("/project");
              }}
            >
              新建演示
            </Button>
          </div>
        </div>
        <div className="right">
          <ProjectList list={projectList}></ProjectList>
        </div>
      </div>
    </div>
  );
}

export function ProjectList(props: { list: Project[] | null }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const navigate = useNavigate();
  const account = useAccount();

  useEffect(() => {
    setProjects(props.list);
  }, [props.list]);

  const downLoadProject = useCallback(async (id: string) => {
    let data = await getProjectData(id);
    let info = {
      name: data.name,
      snapshot: data.snapshot,
      descrition: data.descrition,
    } as DownloadProjectInfo;
    downloadString(
      `${data.name}.${FileEndNameMap[FileType.Project]}`,
      JSON.stringify(info)
    );
  }, []);

  return projects ? (
    projects.length > 0 ? (
      <div className="listContainer">
        <div className="projectList">
          {projects.map((item) => {
            const editable = item.user.account === account;
            const readable = editable || item.permission >= 1;
            return (
              <div
                className="project"
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
                        icon={editable ? <EditOutlined /> : <EyeOutlined />}
                        onClick={() => {
                          navigate(`/project?id=${item.id}`);
                        }}
                      ></Button>
                    )}
                    {readable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          downLoadProject(item.id);
                        }}
                      ></Button>
                    )}
                    {editable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<DeleteOutlined />}
                        onClick={async () => {
                          let res = await projectAPI.removeProject(item.id);
                          if (res && projects) {
                            let newArr = [];
                            for (let i = 0; i < projects.length; i++) {
                              if (projects[i].id !== item.id) {
                                newArr.push(projects[i]);
                              }
                            }
                            setProjects(newArr);
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
                    content={
                      <UserCard
                        account={item.user.account}
                        width="300px"
                      ></UserCard>
                    }
                  >
                    <div
                      className="img"
                      style={{ backgroundImage: `url(${item.user.img})` }}
                    ></div>
                  </Popover>
                </div>
                <div className="time">
                  最近修改：{getDateString(item.modifyTime)}
                </div>
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
