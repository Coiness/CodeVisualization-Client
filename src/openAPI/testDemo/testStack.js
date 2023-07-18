let stack = API.animationApi.addWidget({
  type: "stack",
  x: 30,
  y: 70,
  width: 100,
  height: 300,
});
API.commonApi.nextStep();

let count = API.animationApi.addWidget({
  type: "number",
  x: 10,
  y: 10,
  numberValue: 30,
});
API.commonApi.nextStep();

API.animationApi.moveWidget({ id: count.id, x: 10, y: 100 });
API.commonApi.nextStep();

stack.push(count);
API.commonApi.nextStep();

let c2 = stack.pop();
API.commonApi.nextStep();

console.log(c2);
console.log(c2.value);
