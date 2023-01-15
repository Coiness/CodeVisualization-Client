import { HistoryInfo } from "..";
import { historyInfo, snapshot } from "../../store";
import { Snapshot } from "../../view/project";

export class ModelSwitcher {
  private models: { snapshot: Snapshot; historyInfo: HistoryInfo }[] = [];
  pushModel(ss: Snapshot) {
    const hi = { history: [], index: 0 };
    this.models.push({ snapshot: ss, historyInfo: hi });
    snapshot.set(ss);
    historyInfo.set(hi);
  }
  popModel() {
    if (this.models.length === 0) {
      throw new Error("model switcher popModel: models is empty");
    }
    const model = this.models.pop();
    if (!model) {
      throw new Error("model switcher popModel: model is null");
    }
    const { snapshot: ss, historyInfo: hi } = model;
    snapshot.set(ss);
    historyInfo.set(hi);
  }
}

export const modelSwitcher = new ModelSwitcher();