// 测试 moveWidget 小 Demo

let count = API.animationApi.addWidget({
  type: "number",
  x: 10,
  y: 10,
  numberValue: 30,
});

API.commonApi.nextStep();
API.animationApi.moveWidget({ id: count.id, x: 10, y: 100 });
API.commonApi.nextStep();
