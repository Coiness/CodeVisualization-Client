import { createOnlyId } from "../../common/utils";
import { WidgetRendererModel } from "../../components/widget";
import { BaseModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { BaseAction } from "./baseAction";

type WidgetRendererActionCreateData = {
  type: "create"; // create widget
  model: BaseModel;
};

type WidgetRendererActionDeleteData = {
  type: "delete"; // delete widget
  modelId: string;
};

export type WidgetRendererActionData = WidgetRendererActionCreateData | WidgetRendererActionDeleteData;

export class WidgetRendererAction extends BaseAction {
  private commited = false;
  data: WidgetRendererActionData;

  constructor(data: WidgetRendererActionData, cs: ChangeSet) {
    super(data, cs, "WidgetRenderer");
    this.data = data;
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

  reload(): void {
    this.commited = false;
    super.reload();
  }
}

export class WidgetRendererActionCreate extends WidgetRendererAction {
  data: WidgetRendererActionCreateData;
  static create(widgetManagerModel: WidgetRendererModel, model: BaseModel) {
    model.id = createOnlyId("widget");
    const data: WidgetRendererActionCreateData = {
      type: "create",
      model: model,
    };
    let cs = getCS(
      widgetManagerModel.widgets,
      [
        ["length", widgetManagerModel.widgets.length + 1],
        [widgetManagerModel.widgets.length, model],
      ],
      widgetManagerModel,
    );
    return new WidgetRendererActionCreate(data, cs);
  }

  constructor(data: WidgetRendererActionCreateData, cs: ChangeSet) {
    super(data, cs);
    this.data = data;
  }
}

export class WidgetRendererActionDelete extends WidgetRendererAction {
  data: WidgetRendererActionDeleteData;
  static create(widgetManagerModel: WidgetRendererModel, model: BaseModel) {
    const data: WidgetRendererActionDeleteData = {
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
    let cs = getCS(widgetManagerModel.widgets, [[index, null]], widgetManagerModel);
    return new WidgetRendererActionDelete(data, cs);
  }

  constructor(data: WidgetRendererActionDeleteData, cs: ChangeSet) {
    super(data, cs);
    this.data = data;
  }
}
