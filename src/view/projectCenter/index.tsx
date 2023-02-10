import "./index.css";
import { Button, Input } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
export function ProjectCenter() {
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
            <Button type="default">新建演示</Button>
          </div>
        </div>
        <div className="right">
          <ProjectList></ProjectList>
        </div>
      </div>
    </div>
  );
}

function ProjectList() {
  let projects = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ];
  return (
    <div className="projectList">
      {projects.map(() => {
        return <div className="project"></div>;
      })}
    </div>
  );
}
