let arr = JSON.parse(API.ioApi.getParam("arr"));
let len = arr.length;
let ws = [];
for (let i = 0; i < len; i++) {
  let height = arr[i] * 3;
  ws[i] = {
    w: API.animationApi.addWidget({
      type: "number",
      x: i * 50 + 10,
      y: 350 - height,
      width: 40,
      height: height,
      numberValue: arr[i],
      color: "#a7b0ff",
    }),
    value: arr[i],
    x: i * 50 + 10,
    y: 350 - height,
  };
}
API.commonApi.nextStep(2);

function swap(i, j) {
  if (i === j) {
    return;
  }
  [ws[i], ws[j]] = [ws[j], ws[i]];
  [ws[i].x, ws[j].x] = [ws[j].x, ws[i].x];
  API.animationApi.moveWidget({ id: ws[i].w.id, x: ws[i].x, y: ws[i].y });
  API.animationApi.moveWidget({ id: ws[j].w.id, x: ws[j].x, y: ws[j].y });
  API.commonApi.nextStep(12);
}

for (let i = 0; i < len; i++) {
  API.commonApi.nextStep(3);
  let min = ws[i].value;
  let minIndex = i;
  let minW = API.animationApi.addWidget({
    type: "string",
    x: ws[i].x,
    y: 360,
    width: 40,
    height: 40,
    stringValue: "min",
    color: "skyblue",
  });
  API.commonApi.nextStep(4);
  API.commonApi.nextStep(5);
  for (let j = i + 1; j < len; j++) {
    API.animationApi.changeWidgetColor({
      id: ws[j - 1].w.id,
      color: "#a7b0ff",
    });
    API.animationApi.changeWidgetColor({ id: ws[j].w.id, color: "#cdb2fa" });
    API.commonApi.nextStep(6);
    if (ws[j].value < min) {
      API.commonApi.nextStep(7);
      API.animationApi.changeWidgetColor({ id: ws[j].w.id, color: "#fffca3" });
      API.animationApi.changeWidgetColor({
        id: ws[minIndex].w.id,
        color: "#fffca3",
      });
      API.commonApi.nextStep(8);
      API.animationApi.moveWidget({ id: minW.id, x: ws[j].x, y: 360 });
      API.animationApi.changeWidgetColor({ id: ws[j].w.id, color: "#a7b0ff" });
      API.animationApi.changeWidgetColor({
        id: ws[minIndex].w.id,
        color: "#a7b0ff",
      });
      API.commonApi.nextStep(9);
      min = ws[j].value;
      minIndex = j;
    }
    API.commonApi.nextStep(10);
    API.commonApi.nextStep(5);
  }
  API.commonApi.nextStep(11);
  if (minIndex !== len - 1) {
    API.animationApi.changeWidgetColor({
      id: ws[len - 1].w.id,
      color: "#a7b0ff",
    });
    API.commonApi.nextStep(11);
  }

  swap(i, minIndex);
  API.animationApi.changeWidgetColor({ id: ws[i].w.id, color: "#b7edb1" });
  API.animationApi.deleteWidget({ id: minW.id });
  API.commonApi.nextStep(2);
}

API.commonApi.nextStep(13);
API.ioApi.println(JSON.stringify(ws.map((w) => w.value)));
API.commonApi.nextStep(14);
