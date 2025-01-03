let arr = API.ioApi.getParam("str").split("");
let len = arr.length;
let charWidgets = [];
let widgets = [];

let size = 25;

for (let i = 0; i < len; i++) {
  widgets[i] = {
    w: API.animationApi.addWidget({
      type: "string",
      x: i * size + 300,
      y: 100,
      width: size,
      height: size,
      stringValue: arr[i],
      color: "skyblue",
    }),
    value: arr[i],
    x: i * size + 100,
    y: 100,
  };
}

let stack = API.animationApi.addWidget({
  type: "stack",
  x: 100,
  y: 200,
  width: 50,
  height: 200,
});

API.commonApi.nextStep(8, 8);

let flag = true;

for (let i = 0; i < widgets.length; i++) {
  let v = widgets[i].w.value;
  let wid = widgets[i].w.id;
  API.animationApi.changeWidgetColor({ id: wid, color: "yellow" });
  API.commonApi.nextStep(9, 9);
  if (v === "]" || v === "}" || v === ")") {
    API.commonApi.nextStep(10, 10);
    if (stack.size() == 0) {
      API.commonApi.nextStep(11, 11);
      flag = false;
      API.animationApi.changeWidgetColor({ id: stack.id, color: "#f00" });
      API.commonApi.nextStep(12, 12);
      API.commonApi.nextStep(27, 23);
      break;
    }
    API.commonApi.nextStep(14, 14);
    let w = stack.pop();
    API.commonApi.nextStep(14, 14);
    w = API.animationApi.addWidget({
      type: "string",
      x: 120,
      y: 150,
      width: size,
      height: size,
      stringValue: w.value,
      color: "skyblue",
    });
    API.commonApi.nextStep(15, 15);
    API.animationApi.moveWidget({
      id: w.id,
      x: 300,
      y: 300,
    });
    API.animationApi.moveWidget({
      id: wid,
      x: 340,
      y: 300,
    });
    API.commonApi.nextStep(15, 15);
    let wv = w.value;
    if (
      (v == "]" && wv != "[") ||
      (v == "}" && wv != "{") ||
      (v == ")" && wv != "(")
    ) {
      API.commonApi.nextStep(20, 16);
      flag = false;
      API.animationApi.changeWidgetColor({ id: w.id, color: "#f00" });
      API.animationApi.changeWidgetColor({ id: wid, color: "#f00" });
      API.commonApi.nextStep(21, 17);
      API.commonApi.nextStep(27, 23);
      break;
    } else {
      API.animationApi.changeWidgetColor({ id: wid, color: "green" });
      API.animationApi.changeWidgetColor({ id: w.id, color: "green" });
      API.commonApi.nextStep(22, 18);
      API.animationApi.deleteWidget({ id: wid });
      API.animationApi.deleteWidget({ id: w.id });
      API.commonApi.nextStep(26, 22);
    }
  } else {
    API.commonApi.nextStep(24, 20);
    API.animationApi.moveWidget({ id: wid, x: 120, y: 150 });
    API.commonApi.nextStep(24, 20);
    stack.push(widgets[i].w);
    API.animationApi.deleteWidget({ id: wid });
    API.commonApi.nextStep(26, 22);
  }
  API.commonApi.nextStep(8, 8);
}
API.commonApi.nextStep(27, 23);
if (stack.size() !== 0) {
  API.commonApi.nextStep(28, 24);
  API.animationApi.changeWidgetColor({ id: stack.id, color: "#f00" });
  API.commonApi.nextStep(29, 25);
}
API.commonApi.nextStep(30, 26);
API.ioApi.println((flag && stack.size() === 0) + "");
API.commonApi.nextStep(31, 27);

API.commonApi.end();
