import { useCallback, useRef, useState } from "react";
import { Action, applyAction, execUndo, modelSwitcher } from "../../../core";
import { Recorder } from "../../../core/videotape";
import { mode, useStore } from "../../../store";

const recorder = new Recorder();

export function VideoControl() {
  const [recording, setRecording] = useState(false);
  const [canvasMode, setMode] = useStore(mode);

  const actions = useRef<Action[]>([]);
  const [index, setIndex] = useState<number>(0);

  const handleClick = useCallback(() => {
    if (!recording) {
      recorder.start();
    } else {
      const video = recorder.end();
      const { snapshot, actions: acs } = video;
      modelSwitcher.pushModel(snapshot);
      actions.current = acs;
      setMode("play");
    }
    setRecording(!recording);
  }, [recording, setMode]);

  const handleLast = useCallback(() => {
    if (index === 0) {
      console.log("DEBUG: ", "last end");
      return;
    }
    execUndo();
    setIndex(index - 1);
  }, [index]);
  const handleNext = useCallback(() => {
    if (index === actions.current.length) {
      console.log("DEBUG: ", "next end");
      return;
    }
    applyAction(actions.current[index]);
    setIndex(index + 1);
  }, [index]);
  return (
    <div>
      <div onClick={handleClick}>{!recording ? "录制" : "停止"}</div>
      {canvasMode === "play" && (
        <div>
          <span onClick={handleLast}>last</span>|
          <span onClick={handleNext}>next</span>
        </div>
      )}
    </div>
  );
}
