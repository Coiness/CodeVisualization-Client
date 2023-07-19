import { BaseModel } from "../../../../components/widget/widgets";

export const modelKey = Symbol("modelKey");

export interface ModelKeyObj {
  [modelKey]?: BaseModel;
}
