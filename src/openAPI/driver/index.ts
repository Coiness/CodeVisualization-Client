import { cloneDeep } from "lodash";
import { API } from "..";
import { Subscription } from "../../common/utils";
import { InputContent } from "../../components/inputList";
import { actionCommitter, modelSwitcher, Video } from "../../core";
import { initVideoInfo } from "../../store";
import { ShowCodeInfo } from "../../view/algorithmEdit/ShowCode";
import { actions } from "../common/actions";
import { defaultSnapshot } from "../common/snapshot";

// API 驱动

export class APIDriver {
  r: (value: unknown) => void = () => {};
  initData: { [key: string]: string } | undefined = undefined;
  showCode: ShowCodeInfo | null = null;
  sub: Subscription | null = null;
  descrition: string = "";

  start(
    code: string,
    showCode: ShowCodeInfo | null,
    descrition: string,
    initData?: InputContent[]
  ): Promise<unknown> {
    modelSwitcher.pushModel(cloneDeep(defaultSnapshot));
    this.sub = actionCommitter.subscribe((action) => {
      actions.push(action);
    });
    this.initData = {};
    initData?.forEach((item) => {
      if (this.initData) {
        this.initData[item.key] = item.value;
      }
    });

    this.showCode = showCode ?? null;
    this.descrition = descrition;

    // eslint-disable-next-line
    eval(`
			window.execApi = function(API) {
				${code}
			}
		`);
    let res = new Promise((resolve) => {
      this.r = resolve;
    });
    (window as any).execApi(API);
    return res;
  }
  end(v: Video) {
    this.sub?.unsubscribe();
    modelSwitcher.popModel();
    v.showCode = this.showCode;

    initVideoInfo.set({
      id: "",
      account: "",
      name: "",
      video: v,
      permission: 0,
      descrition: "",
    });
    this.r(null);
  }
}

export const ApiDriver = new APIDriver();
