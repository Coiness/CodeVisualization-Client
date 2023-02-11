import { getLocationQuery, sleep, Subject } from "../../common/utils";
import { WidgetRenderer } from "../../components/widget";
import { modelSwitcher, Video } from "../../core";
import { useUndo } from "../../core/undo";
import { initVideoInfo, snapshot, useStore } from "../../store";
import "./index.css";
import { getInitSnapshot } from "../../common/const";
import { Header } from "../../components/header";
import * as videoAPI from "../../net/videoAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, InputRef, Modal } from "antd";
import { closeDialog, openDialog } from "../dialogs/dialog";

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
    console.log("DEBUG: ", r);
    return {
      id: "",
      account: "",
      name: "",
      video: {} as any,
    };
  }
}

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
        // modelSwitcher.setModel(info.snapshot);
        console.log("DEBUG: ", info);
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
      <div className="videoPlayContent">content</div>
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
