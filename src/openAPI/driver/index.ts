import { cloneDeep } from "lodash";
import { API } from "..";
import { modelSwitcher, Video } from "../../core";
import { initVideoInfo } from "../../store";
import { defaultSnapshot } from "../common/snapshot";

// API 驱动
export const ApiDriver = {
  r: (value: unknown) => {
    return;
  },
  start(code: string): Promise<unknown> {
    modelSwitcher.pushModel(cloneDeep(defaultSnapshot));
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
  },
  end(v: Video) {
    modelSwitcher.popModel();
    initVideoInfo.set({
      id: "",
      account: "",
      name: "",
      video: v,
    });
    this.r(null);
  },
};
