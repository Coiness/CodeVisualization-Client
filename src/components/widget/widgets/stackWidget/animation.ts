import { useEffect } from "react";
import { StackWidgetModel } from ".";
import { widgetModelManager } from "../..";
import { linearAnimation } from "../../../../common/utils";
import {
  StackActionData,
  stackWidgetExecer,
} from "../../../../core/action/StackAction";
import { WidgetModel } from "../type";

export function useStackActionAnimation(
  model: StackWidgetModel,
  dom: HTMLDivElement | null,
  height: number
) {
  useEffect(() => {
    if (dom !== null) {
      let sub = stackWidgetExecer.subscribe((params) => {
        const data = params.action.data as StackActionData;
        if (data.id !== model.id) {
          return;
        }
        const count = Math.floor(height / 30);
        const widgets = model.value.map((item: WidgetModel) => {
          return widgetModelManager.getWidget(item);
        });
        if (data.type === "push") {
          // 如果是 push
          const newWidget = widgetModelManager.getWidget(
            data.info.newWidgetModel
          );
          const div = document.createElement("div");
          div.setAttribute("class", "item");
          div.style.position = "absolute";
          div.style.left = "1px";
          div.innerHTML = `
							<div class="widgetContainer">
								<div class="content">${newWidget.toStringValue()}</div>
							</div>
					`;

          if (count > widgets.length) {
            // 如果当前空间有剩余，则在栈口处创建一个 dom 元素，然后添加一个向下的线性移动动画，移动到栈顶元素上方
            div.style.top = "-30px";
            dom.appendChild(div);
            linearAnimation(
              div,
              {
                top: [
                  -30,
                  height - 30 * (widgets.length + 1) - 2, // 2px 是栈下面的边框
                  (now: number) => {
                    return `${now}px`;
                  },
                ],
              },
              400,
              () => {
                div.remove();
                params.end();
              }
            );
          } else {
            // 如果当前空间没有剩余
            if (count <= 2) {
              // 如果空间个数不大于 2
              // 则在栈口处创建一个 dom 元素，然后添加一个向下线性动画，移动到最上方位置
              div.style.top = "-30px";
              dom.appendChild(div);
              linearAnimation(
                div,
                {
                  top: [
                    -30,
                    0,
                    (now: number) => {
                      return `${now}px`;
                    },
                  ],
                },
                400,
                () => {
                  div.remove();
                  params.end();
                }
              );
            } else {
              // 去过空间个数大于 2
              // 则在入口处创建一个 dom 元素，然后给省略号上方所有 dom 元素添加一个向下的线性移动动画
              div.style.top = "-30px";
              dom.appendChild(div);
              linearAnimation(
                div,
                {
                  top: [
                    -30,
                    0,
                    (now: number) => {
                      return `${now}px`;
                    },
                  ],
                },
                400,
                () => {
                  div.remove();
                  params.end();
                }
              );
              for (let i = 2; i < dom.children.length; i++) {
                linearAnimation(
                  dom.children[i] as HTMLElement,
                  {
                    transform: [
                      0,
                      30,
                      (now: number) => {
                        return `translate(0px, ${now}px)`;
                      },
                    ],
                  },
                  400,
                  () => {
                    (dom.children[i] as HTMLElement).style.transform =
                      "translate(0px , 0px)";
                  }
                );
              }
            }
          }
        } else {
          // 如果是 pop
        }
        params.setStop(() => {});
      });
      return sub.unsubscribe;
    }
  }, [dom, height, model.value.length, model.id, model.value]);
}
