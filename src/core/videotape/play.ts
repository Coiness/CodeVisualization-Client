import { message } from "antd";
import { cloneDeep } from "lodash";
import { Subject } from "../../common/utils";
import { ShowCodeLanguage } from "../../view/algorithmEdit/type";
import { Snapshot } from "../../view/project";
import { modelSwitcher } from "../modelSwitcher";
import { ConsoleContent, Step, Video } from "./type";

export class Player {
  private snapshot: Snapshot = {} as Snapshot;
  private steps: Step[] = [];
  private consoles: (ConsoleContent | null)[] | null = null;
  private heightlines: { [lang: string]: number[] } | null = null;
  private index: number = 0;

  //新增中间映射层
  private consoleStepMap: Map<number,ConsoleContent[]> = new Map();
  private buildConsoleStepMap() {
    this.consoleStepMap.clear();
    if (!this.consoles) return;
    
    //分析原始控制台数据，构建步骤到多个输出的映射
    let currentStep = 0;
    let currentStepConsoles: ConsoleContent[] = [];

    for(let i = 0; i < this.consoles.length; i++) {
      if(this.consoles[i]== null){
        //null表示步骤分隔符号，保存当前步骤的控制台输出
        if(currentStepConsoles.length > 0){
          this.consoleStepMap.set(currentStep, [...currentStepConsoles]);
          currentStepConsoles = [];
        }
        currentStep++;
      }else{
        //警控制台输出添加到当前步骤
        currentStepConsoles.push(this.consoles[i]!);
      }
    }

    //最后一步的控制台输出
    if(currentStepConsoles.length > 0){
      this.consoleStepMap.set(currentStep, [...currentStepConsoles]);
    }
  }

  progress = new Subject<number>();

  start(video: Video) {
    video = cloneDeep(video);
    this.snapshot = video.snapshot;
    this.steps = video.steps;
    this.consoles = video.consoles;
    this.heightlines = video.heightlines;
    this.index = 0;
    this.buildConsoleStepMap();
    this.progress.next(this.index);
    modelSwitcher.pushModel(this.snapshot);
  }

  next(execAnimation = true) {
    if (this.index === this.steps.length) {
      message.info("已经是最后一步了！");
      return;
    }
    // 执行新动画时，停止之前的动画
    if (this.index !== 0) {
      for (let action of this.steps[this.index - 1].actions) {
        action.stop();
      }
    }
    // 执行新动画
    for (let action of this.steps[this.index].actions) {
      if (execAnimation) {
        action.play().then(() => {
          action.commit();
        });
      } else {
        action.commit();
      }
    }
    this.index++;
    this.progress.next(this.index);
  }

  last() {
    if (this.index === 0) {
      message.info("已经是第一步了！");
      return;
    }
    const len = this.steps[this.index - 1].actions.length;
    for (let i = 0; i < len; i++) {
      this.steps[this.index - 1].actions[i].reload();
    }
    this.index--;
    this.progress.next(this.index);
  }

  getStepCount() {
    return this.steps.length;
  }

  go(index: number) {
    while (this.index !== index) {
      if (this.index < index) {
        this.next(false);
      } else if (this.index > index) {
        this.last();
      }
    }
  }

  getSnapshot() {
    return this.snapshot;
  }

  getConsoles(): string[] {
   if(!this.consoles) return [];
   const result: string[] = [];

   //处理每一步骤的控制台输出
   for(let  stepIndex = 0; stepIndex < this.index; stepIndex++){
      const stepConsoles = this.consoleStepMap.get(stepIndex);

      if(!stepConsoles) continue;

      //处理这一步的控制台输出
      let currentLine = "";
      let isNewLine = true;

      for(const consoleItem of stepConsoles){
        if(isNewLine){
          currentLine = consoleItem.content;
        }else{
          currentLine += consoleItem.content;
        }

        if(consoleItem.type === "println"){
          result.push(currentLine);
          currentLine = "";
          isNewLine = true;
        }else{
          isNewLine = false;
        }
      }
      //如果有未完成的行，则添加到结果中
      if(currentLine){
        result.push(currentLine);
        currentLine = "";
      }
   }

   return result;

  }

  getHeightLine(lang: ShowCodeLanguage): number {
    return this.heightlines?.[lang][this.index] ?? 0;
  }


  end() {}
}
