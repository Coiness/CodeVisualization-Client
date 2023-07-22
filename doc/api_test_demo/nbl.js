let str = API.ioApi.getParam("str");
let arr = str.split(" ").map((item) => {
  if (isNaN(item)) {
    return item;
  } else {
    return Number(item);
  }
});

const itemSize = 30;
const stackEntryX = 32;
const stackEntryY = 65 - itemSize;

function getItemX(i) {
  return i * (itemSize + 5) + 120;
}

let stack = API.animationApi.addWidget({
  type: "stack",
  x: 30,
  y: 70,
  width: itemSize + 4,
  height: 300,
});

for (let i = 0; i < arr.length; i++) {
  arr[i] = {
    value: arr[i],
    w: API.animationApi.addWidget({
      type: isNaN(arr[i]) ? "string" : "number",
      x: getItemX(i),
      y: 30,
      width: itemSize,
      height: itemSize,
      [isNaN(arr[i]) ? "stringValue" : "numberValue"]: arr[i],
      color: "#f0f4ff",
    }),
  };
}

API.commonApi.nextStep();

let hz = [];

function push(widget) {
  API.animationApi.moveWidget({
    id: widget.id,
    x: stackEntryX,
    y: stackEntryY,
  });
  API.commonApi.nextStep();
  stack.push(widget);
  API.animationApi.deleteWidget({ id: widget.id });
  API.commonApi.nextStep();
}

function pop(type) {
  let widget = stack.pop();
  API.commonApi.nextStep();
  widget = API.animationApi.addWidget({
    type,
    x: stackEntryX,
    y: stackEntryY,
    width: itemSize,
    height: itemSize,
    [type + "Value"]: widget.value,
    color: "#f0f4ff",
  });
  API.commonApi.nextStep();
  return widget;
}

function hzAdd(widget) {
  let index = hz.length;
  API.animationApi.changeWidgetColor({ id: widget.id, color: "#f0f4ff" });
  API.animationApi.moveWidget({ id: widget.id, x: getItemX(index), y: 100 });
  API.commonApi.nextStep();
  hz[index] = {
    value: widget.value,
    w: widget,
  };
}

function calc(c) {
  let n = c.value;
  API.animationApi.moveWidget({ id: c.id, x: 400, y: 100 });
  API.commonApi.nextStep();
  let num1 = pop("number");
  API.animationApi.moveWidget({ id: num1.id, x: 435, y: 100 });
  API.commonApi.nextStep();
  let num2 = pop("number");
  API.animationApi.moveWidget({ id: num2.id, x: 365, y: 100 });
  API.commonApi.nextStep();

  let res;
  if (n === "+") {
    res = num2.value + num1.value;
  } else if (n === "-") {
    res = num2.value - num1.value;
  } else if (n === "*") {
    res = num2.value * num1.value;
  } else if (n === "/") {
    res = num2.value / num1.value;
  } else {
    console.log("error");
  }

  let w = API.animationApi.addWidget({
    type: "number",
    x: 400,
    y: 150,
    width: itemSize,
    height: itemSize,
    numberValue: res,
    color: "#ad82f7",
  });
  API.commonApi.nextStep();
  API.animationApi.deleteWidget({ id: num1.id });
  API.animationApi.deleteWidget({ id: num2.id });
  API.animationApi.deleteWidget({ id: c.id });
  API.commonApi.nextStep();
  push(w);
}

for (let i = 0; i < arr.length; i++) {
  let n = arr[i].value;
  API.animationApi.changeWidgetColor({ id: arr[i].w.id, color: "#8ee085" });
  API.commonApi.nextStep();
  if (isNaN(n)) {
    if (n === "+" || n === "-") {
      while (stack.size() > 0 && stack.peek().value !== "(") {
        hzAdd(pop("string"));
      }
      push(arr[i].w);
    } else if (n === "*" || n === "/") {
      while (
        (stack.size() > 0 && stack.peek().value === "*") ||
        stack.peek().value === "/"
      ) {
        hzAdd(pop("string"));
      }
      push(arr[i].w);
    } else if (n === "(") {
      push(arr[i].w);
    } else if (n === ")") {
      let x = pop("string");
      while (x.value !== "(") {
        hzAdd(x);
        x = pop("string");
      }
      API.animationApi.moveWidget({ id: x.id, x: getItemX(i - 1), y: 30 });
      API.commonApi.nextStep();
      API.animationApi.changeWidgetColor({ id: arr[i].w.id, color: "#f98e8b" });
      API.animationApi.changeWidgetColor({ id: x.id, color: "#f98e8b" });
      API.commonApi.nextStep();
      API.animationApi.deleteWidget({ id: arr[i].w.id });
      API.animationApi.deleteWidget({ id: x.id });
      API.commonApi.nextStep();
    } else {
      console.log("error");
    }
  } else {
    hzAdd(arr[i].w);
  }
}

while (stack.size() > 0) {
  hzAdd(pop("string"));
}

for (let i = 0; i < hz.length; i++) {
  API.animationApi.moveWidget({ id: hz[i].w.id, x: getItemX(i), y: 30 });
}
API.commonApi.nextStep();

for (let i = 0; i < hz.length; i++) {
  let n = hz[i].value;
  API.animationApi.changeWidgetColor({ id: hz[i].w.id, color: "#8ee085" });
  API.commonApi.nextStep();
  if (isNaN(n)) {
    calc(hz[i].w);
  } else {
    push(hz[i].w);
  }
}

let res = pop("number");
API.animationApi.moveWidget({ id: res.id, x: 400, y: 150 });
API.commonApi.nextStep();
API.animationApi.changeWidgetColor({ id: res.id, color: "#8ee085" });
API.commonApi.nextStep();
