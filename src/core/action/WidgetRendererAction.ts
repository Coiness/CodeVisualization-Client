import { createOnlyId } from "../../common/utils";
import { WidgetRendererModel } from "../../components/widget";
import { BaseModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { BaseAction } from "./baseAction";

export type WidgetRendererActionData = {
  type: "create"; // create widget
  model: BaseModel;
};

type CreateWidgetRendererActionParams = {
  model: BaseModel;
};

export class WidgetRendererAction extends BaseAction {
  constructor(data: WidgetRendererActionData, cs: ChangeSet) {
    super(data, cs, "Value");
  }

  static create(
    widgetManagerModel: WidgetRendererModel,
    params: CreateWidgetRendererActionParams
  ) {
    const { model } = params;
    model.id = createOnlyId("widget");
    const data: WidgetRendererActionData = {
      type: "create",
      model: model,
    };
    let cs = getCS(
      widgetManagerModel.widgets,
      [[widgetManagerModel.widgets.length, model]],
      widgetManagerModel
    );
    return new WidgetRendererAction(data, cs);
  }
}
