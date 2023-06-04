import { createOnlyId } from "../../common/utils";
import { WidgetRendererModel } from "../../components/widget";
import { BaseModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { BaseAction } from "./baseAction";

export type WidgetRendererActionData =
  | {
      type: "create"; // create widget
      model: BaseModel;
    }
  | {
      type: "delete"; // delete widget
      modelId: string;
    };

type CreateWidgetRendererActionParams = {
  type: "create" | "delete";
  model: BaseModel;
};

export class WidgetRendererAction extends BaseAction {
  private commited = false;

  constructor(data: WidgetRendererActionData, cs: ChangeSet) {
    super(data, cs, "WidgetRenderer");
  }

  static create(
    widgetManagerModel: WidgetRendererModel,
    params: CreateWidgetRendererActionParams
  ) {
    const { type, model } = params;
    if (type === "create") {
      model.id = createOnlyId("widget");
      const data: WidgetRendererActionData = {
        type: "create",
        model: model,
      };
      let cs = getCS(
        widgetManagerModel.widgets,
        [
          ["length", widgetManagerModel.widgets.length + 1],
          [widgetManagerModel.widgets.length, model],
        ],
        widgetManagerModel
      );
      return new WidgetRendererAction(data, cs);
    } else if (type === "delete") {
      const data: WidgetRendererActionData = {
        type: "delete",
        modelId: model.id,
      };
      let index: number = -1;
      for (let i = 0; i < widgetManagerModel.widgets.length; i++) {
        if (widgetManagerModel.widgets[i]?.id === model.id) {
          index = i;
        }
      }
      if (index === -1) {
        throw new Error("WidgetRendererAction: delete widget not found model");
      }
      let cs = getCS(
        widgetManagerModel.widgets,
        [[index, null]],
        widgetManagerModel
      );
      return new WidgetRendererAction(data, cs);
    } else {
      throw new Error("WidgetRendererAction: create type error");
    }
  }

  async play() {
    this.commited = false;
  }

  commit(): void {
    if (this.commited) {
      return;
    }
    super.commit();
    this.commited = true;
  }

  stop() {
    if (!this.commited) {
      this.commit();
    }
  }
}
