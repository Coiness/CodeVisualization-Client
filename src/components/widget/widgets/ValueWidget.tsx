import { useEffect, useRef, useState } from "react";
import { linearAnimation, Subject } from "../../../common/utils";
import { valueWidgetExecer, ValueActionData } from "../../../core";
import { animateSpeed } from "../../../store";
import { BaseModel } from "./type";

export interface ValueWidgetModel extends BaseModel {
  value: unknown;
}

export type Value = any;

export interface ValueWidget {
  value$: Subject<Value>;
  getValue(): Value;
}

const SmallFontSize = 16;
const LargeFontSize = 32;

export function useValueWidget(widget: ValueWidget, model: ValueWidgetModel) {
  const v = widget.getValue() as Value;
  const [value, setValue] = useState<Value>(v);

  // 监听 widgetModel 变化
  useEffect(() => {
    // console.log("DEBUG: ", "effect", widget.getValue());
    // setValue(widget.getValue() as Value);
    setValue(widget.getValue() as Value);
    const subscription = widget.value$.subscribe((value) => {
      // model.value = value;
      setValue(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [model, widget]);

  // 回放动画逻辑
  const dom = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const sub = valueWidgetExecer.subscribe((params) => {
      const { action, setStop, end } = params;
      if (action.type !== "Value") {
        return;
      }
      const data = action.data as ValueActionData;
      const { id, type, change } = data;
      if (model.id !== id) {
        return;
      }
      const el = dom.current;
      if (!el) {
        return;
      }

      if (type === "assignment") {
        setValue(change.value);
        let stop: () => void;
        stop = linearAnimation(
          el,
          {
            fontSize: [SmallFontSize, LargeFontSize, (n) => `${n}px`],
          },
          100 / animateSpeed.get(),
          () => {
            stop = linearAnimation(
              el,
              {
                fontSize: [LargeFontSize, SmallFontSize, (n) => `${n}px`],
              },
              100 / animateSpeed.get(),
              end
            );
          }
        );
        setStop(() => {
          stop();
          el.style.fontSize = `${SmallFontSize}px`;
        });
      } else {
        throw new Error("value exec action: action data type error");
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [model.id]);

  return { value, dom };
}
