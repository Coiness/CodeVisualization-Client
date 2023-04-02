import { Snapshot } from "../../view/project";

export function getDefaultSnapshot() {
  return {
    widgetManagerModel: {
      id: "widgetRenderer",
      width: 768,
      height: 432,
      widgets: [],
      color: "#eee",
    },
  } as Snapshot;
}
