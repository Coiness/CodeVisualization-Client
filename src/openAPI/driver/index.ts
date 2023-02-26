import { cloneDeep } from "lodash";
import { API } from "..";
import { InputContent } from "../../components/inputList";
import { modelSwitcher, Video } from "../../core";
import { initVideoInfo } from "../../store";
import { defaultSnapshot } from "../common/snapshot";

// API 驱动

export class APIDriver {
  r: (value: unknown) => void = () => {};
  initData: { [key: string]: string } | undefined = undefined;

  start(code: string, initData?: InputContent[]): Promise<unknown> {
    modelSwitcher.pushModel(cloneDeep(defaultSnapshot));
    this.initData = {};
    initData?.forEach((item) => {
      if (this.initData) {
        this.initData[item.key] = item.value;
      }
    });

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
    modelSwitcher.popModel();
    initVideoInfo.set({
      id: "",
      account: "",
      name: "",
      video: v,
      permission: 0,
    });
    this.r(null);
  }
}

export const ApiDriver = new APIDriver();
