import { useEffect, useState } from "react";
import {
  Algorithm,
  AlgorithmList,
  constructAlgorithmList,
} from "../algorithmCenter";
import { constructProjectList, Project, ProjectList } from "../projectCenter";
import { constructVideoList, Video, VideoList } from "../videoCenter";
import * as api from "../../net";
import "./works.css";
import { Menu } from "antd";

type nowType = "project" | "video" | "algorithm";

export function Works(props: { account: string }) {
  const account = props.account;
  console.log("DEBUG: ", account);
  const [projectList, setProjectList] = useState<Project[] | null>(null);
  const [videoList, setVideoList] = useState<Video[] | null>(null);
  const [algorithmList, setAlgorithmList] = useState<Algorithm[] | null>(null);
  const [now, setNow] = useState<nowType>("project");

  useEffect(() => {
    api.searchProjectByUser(account).then((res) => {
      setProjectList(constructProjectList(res.projects));
    });
    api.searchVideoByUser(account).then((res) => {
      setVideoList(constructVideoList(res.videos));
    });
    api.searchAlgorithmByUser(account).then((res) => {
      setAlgorithmList(constructAlgorithmList(res.algorithms));
    });
  }, [props.account]);

  const workMenuData = [
    {
      label: <div>演示</div>,
      key: "project",
    },
    {
      label: <div>录像</div>,
      key: "video",
    },
    {
      label: <div>算法</div>,
      key: "algorithm",
    },
  ];

  return (
    <div className="works">
      <Menu
        className="friendMenu"
        mode="horizontal"
        items={workMenuData}
        onClick={(info) => {
          setNow(info.key as nowType);
        }}
      ></Menu>
      <div className="blank"></div>
      {now === "project" && <ProjectList list={projectList}></ProjectList>}
      {now === "video" && <VideoList list={videoList}></VideoList>}
      {now === "algorithm" && (
        <AlgorithmList list={algorithmList}></AlgorithmList>
      )}
    </div>
  );
}
