import { WS } from "../../net";
// import { Action, applyAction } from "../action";

// export interface IO {
//   setWS(ws: WS): void;
// }

export class IO_Old {
  // private ws: WS | null = null;
  // private handlerActioin: ((action: Action) => void) | null = null;

  setWS(ws: WS) {
    // this.ws = ws;
    // ws.onMessage = (str: string) => {
    //   let data = JSON.parse(str);
    //   if (data.type === "newAction") {
    //     if (this.handlerActioin !== null) {
    //       this.handlerActioin(data.action as Action);
    //     }
    //   }
    // };
  }

  // setHandlerAction(handlerAction: (action: Action) => void) {
  // this.handlerActioin = handlerAction;
  // }

  // submitAction(action: Action) {
  // if (this.ws === null) {
  //   return;
  // }
  // this.ws.send(
  //   JSON.stringify({
  //     type: "newAction",
  //     action: action,
  //   })
  // );
  // }
}

// const io = new IO();
// io.setHandlerAction(applyAction);

// export const actionIO = io;
