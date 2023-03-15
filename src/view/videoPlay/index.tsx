import { getLocationQuery, Subject } from "../../common/utils";
import { cloneAction, Player, Video } from "../../core";
import { animateSpeed, initVideoInfo, initProjectInfo } from "../../store";
import "./index.css";
import { Header } from "../../components/header";
import * as videoAPI from "../../net/videoAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, InputRef, message, Modal, Select, Slider } from "antd";
import { closeDialog, openDialog } from "../dialogs/dialog";
import {
  BackwardOutlined,
  ForwardOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Console } from "./Console";
import { ShowCode } from "./ShowCode";
import { MainCanvas } from "../../components/mainCanvas/MainCanvas";
import { cloneDeep } from "lodash";
import { InfoEditDialogParams } from "../../components/infoEdit";

export type VideoInfo = {
  id: string;
  account: string;
  name: string;
  video: Video;
  permission: number;
  descrition: string;
};

async function getVideoInfo(id: string | null): Promise<VideoInfo | null> {
  if (id === null) {
    let info = cloneDeep(initVideoInfo.get());
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
      descrition: r.descrition,
    };
  }
}

export const player = new Player();

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
  }, [id, navigate]);

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
      if (newId) {
        navigate(`/videoPlay?id=${newId}`);
      }
    });
    return sub.unsubscribe;
  });

  function handleSelectChange(v: number) {
    if (vInfo) {
      videoAPI.changeVideoPermission(vInfo.id, v).then((flag) => {
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
              {vInfo.name === "" && <Button onClick={save}>保存</Button>}
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
              {vInfo.id && (
                <Button
                  onClick={() => {
                    openDialog("infoEditDialog", {
                      initText: vInfo.descrition,
                      callback: async (str: string) => {
                        let flag = await videoAPI.updateVideoDescrition(
                          vInfo.id,
                          str
                        );
                        if (flag) {
                          setInfo({
                            ...vInfo,
                            descrition: str,
                          });
                          message.success("修改成功");
                        } else {
                          message.error("修改失败");
                        }
                      },
                    } as InfoEditDialogParams);
                  }}
                >
                  编辑录像说明
                </Button>
              )}
            </div>
          ) : (
            <></>
          )
        }
      ></Header>
      <div className="videoPlayContent">
        <div className="middle">
          <div className="left">
            <MainCanvas className={"mainCanvas"} editable={false}></MainCanvas>
          </div>
          <div className="right">
            {vInfo?.video.showCode && (
              <div className="top">
                <ShowCode code={vInfo.video.showCode}></ShowCode>
              </div>
            )}
            <div className="bottom">
              <Console></Console>
            </div>
          </div>
        </div>
        <Control></Control>
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
          message.info("录像已经播放结束了！");
          setAutoPlay(false);
        } else {
          player.next();
        }
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
            min={0.1}
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
              descrition: "",
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
  }, []);

  const submit = useCallback(() => {
    const name = inp?.current?.input?.value;
    if (name) {
      console.log("DEBUG: next", name);
      setVideoName.next(name);
      closePanel();
    }
  }, [closePanel]);

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
