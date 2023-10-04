import "./index.css";
import { listenModelChange } from "../..";
import { Subject, cls } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { ValueAction } from "../../../../core/action/ValueAction";
import { snapshot } from "../../../../store";
import { WidgetInfoView } from "../../controlPanelItem";
import { DeleteWidget } from "../../controlPanelItem/DeleteWidget";
import { IWidget, WidgetModel, WidgetRenderProps } from "../type";
import { ColorEdit } from "../../controlPanelItem/ColorEdit";

export interface LineWidgetModel extends WidgetModel {
  size: number;
  startNodeId: string;
  endNodeId: string;
}

export class LineWidget implements IWidget {
  private model: LineWidgetModel;
  private discard: () => void = () => {};
  private closeListen: () => void = () => {};
  value$: Subject<any>;

  constructor(model: LineWidgetModel) {
    this.model = model;
    this.value$ = new Subject<number>();
    this.init();
  }

  getModel() {
    return this.model;
  }

  init = () => {
    this.closeListen = listenModelChange(this.model, (m) => {
      this.model = m as LineWidgetModel;
    });
    let sub = snapshot.subscribe(() => {
      sub.unsubscribe();
      this.destory();
    });
  };

  setDiscard(discard: () => void) {
    this.discard = discard;
  }

  setValue = (value: unknown) => {
    const action = ValueAction.create(this.model, { value });
    commitAction(action);
  };

  getValue = () => {
    return 0;
  };

  toStringValue() {
    return `line`;
  }

  destory() {
    this.closeListen();
    this.discard();
  }
}

export function LineWidgetRender(props: WidgetRenderProps) {
  return (
    <div className={cls("lineWidget", props.className)}>
      <div className="arrow" style={{ borderLeftColor: props.model.color }}></div>
    </div>
  );
}

export function CreateLineWidget(model: WidgetModel) {
  return new LineWidget(model as LineWidgetModel);
}

export function LineWidgetControlPanel() {
  return (
    <div className="lineControlPanel">
      <WidgetInfoView></WidgetInfoView>
      <ColorEdit></ColorEdit>
      <DeleteWidget></DeleteWidget>
    </div>
  );
}
