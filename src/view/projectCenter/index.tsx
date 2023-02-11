import "./index.css";
import { Button, Input } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useEffect, useState } from "react";
import * as projectAPI from "../../net/projectAPI";
import { getDateString, getIntRandom, randomColor } from "../../common/utils";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
};

export function ProjectCenter() {
  const [projectList, setList] = useState<Project[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectList === null) {
      projectAPI.searchProject("").then((res) => {
        if (projectList === null) {
          setList(
            res.projects.map((item: any) => {
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
              };
            })
          );
        }
      });
    }
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
            <Input.Search></Input.Search>
          </div>
          <div className="all">
            <Button type="text">全部演示</Button>
          </div>
          <div className="mine">
            <Button type="text">我的演示</Button>
          </div>
          <div className="blank"></div>
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

function ProjectList(props: { list: Project[] | null }) {
  let projects = props.list;
  const navigate = useNavigate();
  return projects ? (
    <div className="projectList">
      {projects.map((item) => {
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
                <Button
                  shape="circle"
                  size="large"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/project?id=${item.id}`);
                  }}
                ></Button>
                <Button
                  shape="circle"
                  size="large"
                  icon={<DownloadOutlined />}
                ></Button>
                <Button
                  shape="circle"
                  size="large"
                  icon={<DeleteOutlined />}
                ></Button>
              </div>
            </div>
            <div className="user">
              <div
                className="img"
                style={{ backgroundImage: `url(${item.user.img})` }}
              ></div>
            </div>
            <div className="time">
              最近修改：{getDateString(item.modifyTime)}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>加载中</div>
  );
}
