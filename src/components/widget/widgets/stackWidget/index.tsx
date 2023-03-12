import { listenModelChange } from "../..";
import { cls, Subject, useDomPropertyListener } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { ValueAction } from "../../../../core/action/ValueAction";
import { snapshot } from "../../../../store";
import { WidgetDefaultInfo } from "../../../../view/project/widgetPanel";
import { ValueEdit, WidgetInfoView } from "../../controlPanelItem";
import {
  StackControl,
  WidgetContainer,
} from "../../controlPanelItem/StackControl";
import { IWidget, WidgetModel, WidgetRenderProps, WidgetType } from "../type";
import { useValueWidget, ValueWidgetModel } from "../ValueWidget";
import "./index.css";

type Value = IWidget[];

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

  push(w: IWidget) {
    this.value.push(w);
    this.setValue([...this.value]);
  }

  pop(): IWidget | null {
    if (this.value.length) {
      let res = this.value.pop()!;
      this.setValue([...this.value]);
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
  const model = props.model;
  const { value, dom } = useValueWidget(widget, model as ValueWidgetModel);
  const height =
    useDomPropertyListener(dom.current, "offsetHeight") ?? model.height;
  const count = Math.floor(height / 30);
  const isLittle = count <= 2 && value.length > count;
  let list: (IWidget | null)[] = [];
  list = [...value];
  if (value.length > count) {
    list.splice(1, value.length - count + 1, {
      toStringValue: () => "...",
    } as IWidget);
  } else {
    while (list.length < count) {
      list.push(null);
    }
  }
  list.reverse();

  return (
    <div className={cls("stackWidget", props.className)} ref={dom}>
      {isLittle && (
        <div className="value">
          <div className="item">显示不下啦</div>
        </div>
      )}
      {!isLittle && (
        <div className="value">
          {list.map((item) => {
            return (
              <div className="item">
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
      <ValueEdit></ValueEdit>
      <StackControl></StackControl>
    </div>
  );
}
