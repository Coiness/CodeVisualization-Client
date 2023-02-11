import { cloneDeep } from "lodash";
import { API } from "..";
import { modelSwitcher, Video } from "../../core";
import { initVideoInfo } from "../../store";
import { playCaller } from "../../view/project/controlPanel/VideoControl";
import { defaultSnapshot } from "../common/snapshot";

// API 驱动
export const ApiDriver = {
  r: () => {},
  start(code: string): Promise<void> {
    modelSwitcher.pushModel(cloneDeep(defaultSnapshot));
    eval(`
			window.execApi = function(API) {
				${code}
			}
		`);
    (window as any).execApi(API);
    return new Promise((resolve) => {
      this.r = resolve;
    });
  },
  end(v: Video) {
    modelSwitcher.popModel();
    initVideoInfo.set({
      id: "",
      account: "",
      name: "",
      video: v,
    });
    this.r();
    // playCaller.next(v);
  },
};
