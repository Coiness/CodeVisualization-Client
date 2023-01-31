import { useCallback, useEffect, useState } from "react";
import { Subject } from "../../../common/utils";
import { Player, Recorder, Video } from "../../../core/videotape";
import { mode, useStore } from "../../../store";

const recorder = new Recorder();
const player = new Player();

// 用于让外界触发 play，目前 open api 在使用
export const playCaller = new Subject<Video>();

export function VideoControl() {
  const [recording, setRecording] = useState(false);
  const [canvasMode, setMode] = useStore(mode);

  const handleClick = useCallback(() => {
    if (!recording) {
      recorder.start();
    } else {
      const video = recorder.end();
      player.start(video);
      setMode("play");
    }
    setRecording(!recording);
  }, [recording, setMode]);

  useEffect(() => {
    const sub = playCaller.subscribe((video: Video) => {
      player.start(video);
      setMode("play");
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div>
      <div onClick={handleClick}>{!recording ? "录制" : "停止"}</div>
      {canvasMode === "play" && (
        <div>
          <span onClick={() => player.last()}>last</span>|
          <span onClick={() => player.next()}>next</span>
        </div>
      )}
    </div>
  );
}
