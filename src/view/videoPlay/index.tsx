import { getLocationQuery, sleep, Subject } from "../../common/utils";
import { WidgetRenderer } from "../../components/widget";
import { cloneAction, modelSwitcher, Player, Video } from "../../core";
import { useUndo } from "../../core/undo";
import {
  animateSpeed,
  initVideoInfo,
  initProjectInfo,
  snapshot,
  useStore,
} from "../../store";
import "./index.css";
import { getInitSnapshot } from "../../common/const";
import { Header } from "../../components/header";
import * as videoAPI from "../../net/videoAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, InputRef, Modal, Select, Slider } from "antd";
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
  permission: number;
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
      permission: r.permission,
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

  function handleSelectChange(v: number) {
    if (vInfo) {
      videoAPI.changePermission(vInfo.id, v).then((flag) => {
        if (flag) {
          setInfo({
            ...vInfo,
            permission: v,
          });
        }
      });
    }
  }

  return (
    <div className="videoPlay">
      <Header
        content={
          vInfo ? (
            <div className="videoPlayHeader">
              <div>{vInfo.name}</div>
              <Button onClick={save}>保存</Button>
              {vInfo.name !== "" && (
                <Select
                  value={vInfo.permission}
                  onChange={handleSelectChange}
                  options={[
                    { value: 0, label: "仅自己可见" },
                    { value: 1, label: "所有人可见" },
                  ]}
                />
              )}
            </div>
          ) : (
            <></>
          )
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

  const [zoom, setZoom] = useState<number>(1);

  function handelMouseWhell(e: any) {
    if (e.deltaY > 0) {
      if (zoom > 0.2) {
        setZoom(zoom - 0.05);
      }
    } else {
      if (zoom < 2) {
        setZoom(zoom + 0.05);
      }
    }
  }

  return (
    <div className="mainCanvas" onWheel={handelMouseWhell}>
      <div className="zoom" style={{ zoom }}>
        {data && (
          <WidgetRenderer model={data.widgetManagerModel}></WidgetRenderer>
        )}
      </div>
    </div>
  );
}

function Control() {
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    animateSpeed.set(speed);
  }, [speed]);

  useEffect(() => {
    if (autoPlay) {
      let t = setInterval(() => {
        if (progress === player.getStepCount()) {
          setAutoPlay(false);
        }
        player.next();
      }, 400 / animateSpeed.get());
      return () => {
        clearInterval(t);
      };
    }
  }, [autoPlay, progress]);

  useEffect(() => {
    let sub = player.progress.subscribe((p) => {
      setProgress(p);
    });
    return sub.unsubscribe;
  });

  return (
    <div className="control">
      <div className="left">
        <div className="stop">
          {autoPlay && (
            <Button
              shape="circle"
              icon={<PauseOutlined />}
              onClick={() => {
                setAutoPlay(false);
              }}
            ></Button>
          )}
          {!autoPlay && (
            <Button
              shape="circle"
              icon={<PlayCircleOutlined />}
              disabled={progress === player.getStepCount()}
              onClick={() => {
                setAutoPlay(true);
              }}
            ></Button>
          )}
        </div>
        <div className="speed">
          <Slider
            defaultValue={speed}
            max={5}
            min={0.5}
            step={0.1}
            onChange={(v) => setSpeed(v)}
            disabled={autoPlay}
          />
        </div>
        <div className="restart">
          <Button
            shape="circle"
            icon={<ReloadOutlined />}
            disabled={autoPlay || progress === 0}
            onClick={() => {
              player.go(0);
            }}
          ></Button>
        </div>
      </div>
      <div className="middle">
        <Button
          type="text"
          shape="circle"
          icon={<BackwardOutlined />}
          onClick={() => player.last()}
          disabled={autoPlay}
        ></Button>
        <div className="progress">
          <Slider
            value={progress}
            max={player.getStepCount()}
            onChange={(v) => player.go(v)}
            disabled={autoPlay}
          />
        </div>
        <Button
          type="text"
          shape="circle"
          icon={<ForwardOutlined />}
          onClick={() => player.next()}
          disabled={autoPlay}
        ></Button>
      </div>
      <div className="right">
        <Button
          onClick={() => {
            let s = player.getSnapshot();
            initProjectInfo.set({
              id: "",
              account: "",
              name: "",
              snapshot: s,
              permission: 0,
            });
            navigate("/project");
          }}
        >
          进入演示模式
        </Button>
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
      closePanel();
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
