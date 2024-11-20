import { Snapshot } from "../../view/project";

export const getInitSnapshot = () => {
  let width = document.documentElement.clientWidth - 440 - 1; // 多减 1 px 防止误差
  let height = document.documentElement.clientHeight - 60 - 1;
  return {
    widgetManagerModel: {
      id: "widgetRenderer",
      width,
      height,
      widgets: [],
      color: "#eee",
    },
  } as Snapshot;
};

// 设置初始快照，用于界面初始化
