import { useEffect } from "react";
import { getModelById } from "..";
import { listenModelChange, widgetModelManager } from "../..";
import { cls, Subject, useDomPropertyListener } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import {
  StackAction,
  StackActionData,
  stackWidgetExecer,
} from "../../../../core/action/StackAction";
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
    const action = StackAction.create(this.model, {
      type: "push",
      info: {
        fromWidgetModel: m,
      },
    });
    commitAction(action);
  }

  pop(): WidgetModel | null {
    if (this.value.length) {
      let res = this.value[this.value.length - 1];
      const action = StackAction.create(this.model, {
        type: "pop",
      });
      commitAction(action);
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

function useStackActionAnimation(
  model: StackWidgetModel,
  dom: HTMLDivElement | null,
  height: number
) {
  useEffect(() => {
    if (dom !== null) {
      let sub = stackWidgetExecer.subscribe((params) => {
        const data = params.action.data as StackActionData;
        const count = Math.floor(height);
        const widgets = model.value.map((item: WidgetModel) => {
          return widgetModelManager.getWidget(item);
        });
        if (data.type === "push") {
          // 如果是 push
          const newWidget = widgetModelManager.getWidget(
            data.info.newWidgetModel
          );
          const dom = document.createElement("div");
          dom.setAttribute("class", "item");
          dom.innerHTML = `
							<div className="widgetContainer">
								<div className="content">${newWidget.toStringValue()}</div>
							</div>
					`;

          if (count > widgets.length) {
            // 如果当前空间有剩余，则在栈口处创建一个 dom 元素，然后添加一个向下的线性移动动画，移动到栈顶元素上方
          } else {
            // 如果当前空间没有剩余
            // 如果空间个数不大于 2
            // 则在栈口处创建一个 dom 元素，然后添加一个向下线性动画，移动到最上方位置
            // 去过空间个数大于 2
            // 则在入口处创建一个 dom 元素，然后给省略号上方所有 dom 元素添加一个向下的线性移动动画
          }
        } else {
          // 如果是 pop
        }
        params.setStop(() => {});
      });
      return sub.unsubscribe;
    }
  }, [dom, height]);
}

export function StackWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = props.model as StackWidgetModel;
  const { value, dom } = useValueWidget(widget, model);
  const height =
    useDomPropertyListener(dom.current, "offsetHeight") ?? model.height;
  const count = Math.floor(height / 30);
  const widgets = value.map((item: WidgetModel) => {
    return widgetModelManager.getWidget(item);
  });
  const isLittle = count <= 2 && value.length > count;
  useStackActionAnimation(model, dom.current, height);
  let list: (IWidget | null)[] = [];
  list = [...widgets];
  if (widgets.length > count) {
    list.splice(1, widgets.length - count + 1, {
      toStringValue: () => "...",
    } as IWidget);
  } else {
    while (list.length < count) {
      list.push(null);
    }
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
      <ValueEdit></ValueEdit>
      <StackControl></StackControl>
    </div>
  );
}
