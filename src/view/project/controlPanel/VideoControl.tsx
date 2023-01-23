import { useCallback, useState } from "react";
import { Player, Recorder } from "../../../core/videotape";
import { mode, useStore } from "../../../store";

const recorder = new Recorder();
const player = new Player();

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
