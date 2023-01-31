import { steps } from "./steps";
import { actions } from "./actions";
import { defaultSnapshot } from "./snapshot";
import { cloneDeep } from "lodash";
import { ApiDriver } from "../driver";

export const commonApi = {
  nextStep() {
    steps.push({ actions: cloneDeep(actions) });
    actions.length = 0;
  },

  end() {
    ApiDriver.end({
      snapshot: defaultSnapshot,
      steps: steps,
    });
  },
};
