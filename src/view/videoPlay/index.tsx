import { getLocationQuery, sleep, Subject } from "../../common/utils";
import { WidgetRenderer } from "../../components/widget";
import { cloneAction, modelSwitcher, Player, Video } from "../../core";
import { useUndo } from "../../core/undo";
import { initVideoInfo, snapshot, useStore } from "../../store";
import "./index.css";
import { getInitSnapshot } from "../../common/const";
import { Header } from "../../components/header";
import * as videoAPI from "../../net/videoAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, InputRef, Modal, Slider } from "antd";
import { closeDialog, openDialog } from "../dialogs/dialog";
import {
  BackwardOutlined,
  ForwardOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export type VideoInfo = {
  id: string;
  account: string;
  name: string;
  video: Video;
};

async function getVideoInfo(id: string | null): Promise<VideoInfo | null> {
  if (id === null) {
    let info = initVideoInfo.get();
    return info;
  } else {
    let r = await videoAPI.getVideoInfo(id);
    let v: Video = JSON.parse(r.content);
    v.steps.forEach((step) => {
      for (let i = 0; i < step.actions.length; i++) {
        step.actions[i] = cloneAction(step.actions[i]);
      }
    });
    return {
      id: r.id,
      account: r.account,
      name: r.name,
      video: v,
    };
  }
}

const player = new Player();

export function VideoPlay() {
  const location = useLocation();
  const id = getLocationQuery("id", location.search);
  const [vInfo, setInfo] = useState<VideoInfo | null>(null);
  const nameRef = useRef<string>(vInfo?.name ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    getVideoInfo(id).then((info) => {
      if (info !== null) {
        setInfo(info);
        player.start(info.video);
        // modelSwitcher.setModel(info.snapshot);
      } else {
        navigate("/videoCenter");
      }
    });
  }, [id]);

  async function save(): Promise<string | null> {
    if (nameRef.current === "") {
      openDialog("setVideoName");
    } else {
      if (vInfo) {
        return await videoAPI.createVideo(
          nameRef.current,
          JSON.stringify(vInfo.video)
        );
      }
    }
    return null;
  }

  useEffect(() => {
    let sub = setVideoName.subscribe(async (name) => {
      console.log("DEBUG: sub", name);
      nameRef.current = name;
      let newId = await save();
      console.log("DEBUG: id", newId);
      if (newId) {
        navigate(`/videoPlay?id=${newId}`);
      }
    });
    return sub.unsubscribe;
  });

  return (
    <div className="videoPlay">
      <Header
        content={
          <div className="videoPlayHeader">
            <Button onClick={save}>保存</Button>
          </div>
        }
      ></Header>
      <div className="videoPlayContent">
        <MainCanvas></MainCanvas>
        <Control></Control>
      </div>
    </div>
  );
}

function MainCanvas() {
  const [data] = useStore(snapshot);

  useUndo();

  console.log("DEBUG: ", data);

  return (
    <div className="mainCanvas">
      {data && (
        <WidgetRenderer model={data.widgetManagerModel}></WidgetRenderer>
      )}
    </div>
  );
}

function Control() {
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  return (
    <div className="control">
      <div className="left">
        <div className="stop">
          {!autoPlay && (
            <Button shape="circle" icon={<PauseOutlined />}></Button>
          )}
          {autoPlay && (
            <Button shape="circle" icon={<PlayCircleOutlined />}></Button>
          )}
        </div>
        <div className="speed">
          <Slider defaultValue={30} />
        </div>
        <div className="restart">
          <Button shape="circle" icon={<ReloadOutlined />}></Button>
        </div>
      </div>
      <div className="middle">
        <Button
          type="text"
          shape="circle"
          icon={<BackwardOutlined />}
          onClick={() => player.last()}
        ></Button>
        <div className="progress">
          <Slider defaultValue={30} />
        </div>
        <Button
          type="text"
          shape="circle"
          icon={<ForwardOutlined />}
          onClick={() => player.next()}
        ></Button>
      </div>
      <div className="right">
        <Button>进入演示模式</Button>
      </div>
    </div>
  );
}

const setVideoName = new Subject<string>();

export function SetVideoNameDialog(visible: boolean) {
  const inp = useRef<InputRef | null>(null);

  const closePanel = useCallback(() => {
    closeDialog("setVideoName");
  }, [closeDialog]);

  const submit = useCallback(() => {
    const name = inp?.current?.input?.value;
    if (name) {
      console.log("DEBUG: next", name);
      setVideoName.next(name);
    }
  }, []);

  return (
    <Modal
      open={visible}
      maskClosable={true}
      onCancel={closePanel}
      footer={null}
      width={400}
      closable={false}
    >
      <Input.Group compact>
        <Input style={{ width: "75%" }} placeholder="请输入录像名" ref={inp} />
        <Button type="default" style={{ width: "25%" }} onClick={submit}>
          确定
        </Button>
      </Input.Group>
    </Modal>
  );
}
