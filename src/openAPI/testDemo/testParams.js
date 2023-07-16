// 测试 属性获取 小 Demo

let count = API.animationApi.addWidget({
  type: "number",
  x: 10,
  y: 10,
  numberValue: 30,
});

let str = API.animationApi.addWidget({
  type: "string",
  x: 200,
  y: 200,
  width: 300,
  height: 100,
  stringValue: "Hello World!",
});

console.log("DEBUG: ", count.value);
API.animationApi.changeWidgetValue({ id: count.id, value: 50 });
console.log("DEBUG: ", count.value);

console.log("DEBUG: ", str.value);
API.animationApi.changeWidgetValue({ id: str.id, value: "nb" });
console.log("DEBUG: ", str.value);

API.commonApi.nextStep();
