let nums = JSON.parse(API.ioApi.getParam("nums"));
let target = Number(API.ioApi.getParam("target"));

let itemSize = 30;

function getX(i) {
  return i * (30 + 10) + 20;
}

let targetX = (getX(0) + getX(nums.length - 1)) / 2;

let items = [];

target = {
  w: API.animationApi.addWidget({
    type: "number",
    x: targetX,
    y: 235,
    width: itemSize,
    height: itemSize,
    color: "#ffba6b",
    numberValue: target,
  }),
  v: target,
};

for (let i = 0; i < nums.length; i++) {
  let v = nums[i];
  items[i] = {
    w: API.animationApi.addWidget({
      type: "number",
      x: getX(i),
      y: 100,
      width: itemSize,
      height: itemSize,
      color: "#a7b0ff",
      numberValue: v,
    }),
    i,
    v,
  };
}

API.commonApi.nextStep();

for (let i = 0; i < items.length; i++) {
  let item = items[i];
  item.iw = API.animationApi.addWidget({
    type: "number",
    x: getX(item.i),
    y: 65,
    width: itemSize,
    height: itemSize,
    color: "#f0f4ff",
    numberValue: item.i,
  });
}

API.commonApi.nextStep();

items.sort((a, b) => {
  return a.v - b.v;
});

for (let i = 0; i < items.length; i++) {
  API.animationApi.moveWidget({ id: items[i].w.id, x: getX(i), y: 100 });
  API.animationApi.moveWidget({ id: items[i].iw.id, x: getX(i), y: 65 });
}
API.commonApi.nextStep();

let l = {
  w: API.animationApi.addWidget({
    type: "string",
    x: getX(0),
    y: 135,
    width: itemSize,
    height: itemSize,
    color: "#fbbfbc",
    stringValue: "L",
  }),
  v: 0,
};

let r = {
  w: API.animationApi.addWidget({
    type: "string",
    x: getX(items.length - 1),
    y: 135,
    width: itemSize,
    height: itemSize,
    color: "#fbbfbc",
    stringValue: "R",
  }),
  v: items.length - 1,
};

API.commonApi.nextStep();

while (l.v < r.v) {
  API.animationApi.changeWidgetColor({ id: items[l.v].w.id, color: "#cdb2fa" });
  API.animationApi.changeWidgetColor({ id: items[r.v].w.id, color: "#cdb2fa" });
  API.commonApi.nextStep();

  let v = items[l.v].v + items[r.v].v;
  let res = {
    w: API.animationApi.addWidget({
      type: "number",
      x: targetX,
      y: 200,
      width: itemSize,
      height: itemSize,
      color: "#fff67a",
      numberValue: v,
    }),
    v,
  };
  API.commonApi.nextStep();

  if (res.v === target.v) {
    API.animationApi.changeWidgetColor({
      id: items[l.v].iw.id,
      color: "#8ee085",
    });
    API.animationApi.changeWidgetColor({
      id: items[r.v].iw.id,
      color: "#8ee085",
    });
    API.animationApi.changeWidgetColor({
      id: res.w.id,
      color: "#ffba6b",
    });
    API.commonApi.nextStep();
    break;
  } else {
    API.animationApi.deleteWidget({ id: res.w.id });
    API.animationApi.changeWidgetColor({
      id: items[l.v].w.id,
      color: "#a7b0ff",
    });
    API.animationApi.changeWidgetColor({
      id: items[r.v].w.id,
      color: "#a7b0ff",
    });
    API.commonApi.nextStep();

    if (res.v > target.v) {
      r.v--;
      API.animationApi.moveWidget({ id: r.w.id, x: getX(r.v), y: 135 });
      API.commonApi.nextStep();
    } else {
      l.v++;
      API.animationApi.moveWidget({ id: l.w.id, x: getX(l.v), y: 135 });
      API.commonApi.nextStep();
    }
  }
}
