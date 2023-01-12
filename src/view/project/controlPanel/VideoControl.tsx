import { useCallback, useRef, useState } from "react";
import { applyAction, execUndo, modelSwitcher } from "../../../core";
import { Recorder, Step } from "../../../core/videotape";
import { mode, useStore } from "../../../store";

const recorder = new Recorder();

export function VideoControl() {
  const [recording, setRecording] = useState(false);
  const [canvasMode, setMode] = useStore(mode);

  const steps = useRef<Step[]>([]);
  const [index, setIndex] = useState<number>(0);

  const handleClick = useCallback(() => {
    if (!recording) {
      recorder.start();
    } else {
      const video = recorder.end();
      const { snapshot, steps: sts } = video;
      modelSwitcher.pushModel(snapshot);
      steps.current = sts;
      setMode("play");
    }
    setRecording(!recording);
  }, [recording, setMode]);

  const handleLast = useCallback(() => {
    if (index === 0) {
      console.log("DEBUG: ", "last end");
      return;
    }
    const len = steps.current[index - 1].actions.length;
    for (let i = 0; i < len; i++) {
      execUndo();
    }
    setIndex(index - 1);
  }, [index]);
  const handleNext = useCallback(() => {
    if (index === steps.current.length) {
      console.log("DEBUG: ", "next end");
      return;
    }
    for (let action of steps.current[index].actions) {
      applyAction(action);
    }
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
