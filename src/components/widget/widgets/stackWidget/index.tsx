import "./index.css";
import { listenModelChange, widgetModelManager } from "../..";
import { cls, Subject, useDomPropertyListener } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { StackActionPop, StackActionPush } from "../../../../core/action/StackAction";
import { ValueAction } from "../../../../core/action/ValueAction";
import { snapshot } from "../../../../store";
import { WidgetDefaultInfo } from "../../../../view/project/widgetPanel";
import { WidgetInfoView } from "../../controlPanelItem";
import { StackControl, WidgetContainer } from "../../controlPanelItem/StackControl";
import { IWidget, WidgetModel, WidgetRenderProps, WidgetType } from "../type";
import { useValueWidget } from "../ValueWidget";
import { useStackActionAnimation } from "./animation";
import { DeleteWidget } from "../../controlPanelItem/DeleteWidget";
import { ColorEdit } from "../../controlPanelItem/ColorEdit";

type Value = WidgetModel[];

export interface StackWidgetModel extends WidgetModel {
  value: Value;
}

export const stackWidgetDefaultInfo: WidgetDefaultInfo = {
  defaultData: {
    id: "",
    type: WidgetType.Stack,
    x: 0,
    y: 0,
    width: 100,
    height: 200,
    color: "rgb(255, 242, 213)",
    value: [],
  },
  name: "栈",
};

export class StackWidget implements IWidget {
  private value: Value;
  private model: StackWidgetModel;
  private discard: () => void = () => {};
  private closeListen: () => void = () => {};
  value$: Subject<Value>;

  constructor(model: StackWidgetModel) {
    this.value = model.value;
    this.value$ = new Subject<Value>();
    this.model = model;
    this.init();
  }

  getModel() {
    return this.model;
  }

  init = () => {
    this.closeListen = listenModelChange(this.model, (m) => {
      this.model = m as StackWidgetModel;
      this._updateValue();
    });
    let sub = snapshot.subscribe(() => {
      sub.unsubscribe();
      this.destory();
    });
  };

  setDiscard(discard: () => void) {
    this.discard = discard;
  }

  private _updateValue() {
    this.value = this.model.value;
    this.value$.next(this.value);
  }

  setValue = (value: unknown) => {
    const action = ValueAction.create(this.model, { value });
    commitAction(action);
  };

  getValue = () => {
    return this.value;
  };

  push(m: WidgetModel) {
    const action = StackActionPush.create(this.model, {
      fromWidgetModel: m,
    });
    commitAction(action);
  }

  pop(): WidgetModel | null {
    if (this.value.length) {
      let res = this.value[this.value.length - 1];
      const action = StackActionPop.create(this.model);
      commitAction(action);
      return res;
    } else {
      return null;
    }
  }

  peek(): WidgetModel | null {
    if (this.value.length) {
      let res = this.value[this.value.length - 1];
      return res;
    } else {
      return null;
    }
  }

  toStringValue() {
    return "";
  }

  destory() {
    this.closeListen();
    this.discard();
  }
}

export function StackWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = props.model as StackWidgetModel;
  const { value, dom } = useValueWidget(widget, model);
  const height = (useDomPropertyListener(dom.current, "offsetHeight") ?? model.height) as number;
  const count = Math.floor(height / 30);
  const widgets = value.map((item: WidgetModel) => {
    return widgetModelManager.getWidget(item);
  });
  const isLittle = count <= 2 && value.length > count;
  useStackActionAnimation(model, () => (dom.current?.children[0] as HTMLDivElement) ?? null, height);
  let list: (IWidget | null)[] = [];
  list = [...widgets];
  if (widgets.length > count) {
    list.splice(1, widgets.length - count + 1, {
      toStringValue: () => "...",
    } as IWidget);
  }

  return (
    <div className={cls("stackWidget", props.className)} ref={dom}>
      {isLittle && (
        <div className="value">
          <div className="item">显示不下啦</div>
        </div>
      )}
      {!isLittle && (
        <div className="value">
          {list.map((item, index) => {
            return (
              <div className="item" key={index}>
                {item && <WidgetContainer widget={item}></WidgetContainer>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CreateStackWidget(model: WidgetModel) {
  return new StackWidget(model as StackWidgetModel);
}

export function StackWidgetControlPanel() {
  return (
    <div className="stackControlPanel">
      <WidgetInfoView></WidgetInfoView>
      <StackControl></StackControl>
      <ColorEdit></ColorEdit>
      <DeleteWidget></DeleteWidget>
    </div>
  );
}
