let arr = JSON.parse(API.ioApi.getParam("arr"));
let len = arr.length;
let widgets = [];
for (let i = 0; i < len; i++) {
  let height = arr[i] * 3;
  widgets[i] = API.animationApi.addWidget({
    type: "number",
    x: i * 50 + 10,
    y: 350 - height,
    width: 40,
    height: height,
    numberValue: arr[i],
  });
}
API.commonApi.nextStep(2, 3);

function swap(i, j) {
  let t = widgets[i];
  widgets[i] = widgets[j];
  widgets[j] = t;
  let ix = widgets[i].x;
  let jx = widgets[j].x;
  API.animationApi.moveWidget({ id: widgets[i].id, x: jx, y: widgets[i].y });
  API.animationApi.moveWidget({ id: widgets[j].id, x: ix, y: widgets[j].y });
  API.commonApi.nextStep(7, 8);
}

for (let i = 0; i < len; i++) {
  API.commonApi.nextStep(3, 4);
  for (let j = 0; j < len - 1; j++) {
    API.commonApi.nextStep(4, 5);
    API.commonApi.nextStep(5, 6);
    if (widgets[j].value > widgets[j + 1].value) {
      API.commonApi.nextStep(6, 7);
      swap(j, j + 1);
      API.commonApi.nextStep(8, 9);
    }
  }
  API.commonApi.nextStep(9, 10);
  let values = [];
  for (let j = 0; j < len; j++) {
    values[j] = widgets[j].value;
  }
  API.ioApi.println(JSON.stringify(values));
  API.commonApi.nextStep(10, 11);
}
API.commonApi.nextStep(11, 12);
