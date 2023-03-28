// 测试 deleteWidget 小 Demo

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

API.commonApi.nextStep();

API.animationApi.moveWidget({ id: count.id, x: 10, y: 100 });

API.commonApi.nextStep();

API.animationApi.resizeWidget({ id: str.id, width: 200, height: 80 });

API.commonApi.nextStep();

API.animationApi.deleteWidget({ id: count.id });

API.commonApi.nextStep();

API.animationApi.deleteWidget({ id: str.id });

API.commonApi.nextStep();

API.commonApi.end();
