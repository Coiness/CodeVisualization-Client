import { cloneDeep } from "lodash";
import { API } from "..";
import { modelSwitcher, Video } from "../../core";
import { playCaller } from "../../view/project/controlPanel/VideoControl";
import { defaultSnapshot } from "../common/snapshot";

// API 驱动
export const ApiDriver = {
  start(code: string) {
    modelSwitcher.pushModel(cloneDeep(defaultSnapshot));
    eval(`
			window.execApi = function(API) {
				${code}
			}
		`);
    (window as any).execApi(API);
  },
  end(v: Video) {
    modelSwitcher.popModel();
    playCaller.next(v);
  },
};
