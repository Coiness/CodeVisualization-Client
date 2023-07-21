import { API } from "../..";
import { BaseWidget } from "../../animationApi/types/widget/Base";

export function del(obj: BaseWidget) {
  API.animationApi.deleteWidget({ id: obj.id });
}
