let arr = JSON.parse(API.ioApi.getParam("arr"));
let len = arr.length;
let ws = [];

function getX(i) {
  return i * 50 + 10;
}

for (let i = 0; i < len; i++) {
  let height = arr[i];
  ws[i] = {
    w: API.animationApi.addWidget({
      type: "number",
      x: getX(i),
      y: 150 - height,
      width: 40,
      height: height,
      numberValue: arr[i],
      color: "#a7b0ff",
    }),
    value: arr[i],
    h: height,
    x: getX(i),
    y: 150 - height,
  };
}
API.commonApi.nextStep();

function sort(ws, l, r) {
  for (let i = l; i < r; i++) {
    API.animationApi.changeWidgetColor({ id: ws[i].w.id, color: "#ad82f7" });
  }
  API.commonApi.nextStep();
  for (let i = l; i < r; i++) {
    API.animationApi.changeWidgetColor({ id: ws[i].w.id, color: "#a7b0ff" });
  }
  API.commonApi.nextStep();

  if (r - l <= 1) {
    return;
  }
  let mid = (l + r) >> 1;
  sort(ws, l, mid);
  sort(ws, mid, r);
  merge(ws, l, mid, r);
}

function merge(ws, l, mid, r) {
  for (let i = l; i < r; i++) {
    API.animationApi.changeWidgetColor({ id: ws[i].w.id, color: "#8ee085" });
  }
  API.commonApi.nextStep();
  for (let i = l; i < r; i++) {
    API.animationApi.changeWidgetColor({ id: ws[i].w.id, color: "#a7b0ff" });
  }
  API.commonApi.nextStep();
  let newArr = [];
  for (let i = l; i < r; i++) {
    newArr.push(ws[i]);
    if (i < mid) {
      API.animationApi.moveWidget({
        id: ws[i].w.id,
        x: getX(i) - 5,
        y: 350 - ws[i].h,
      });
    } else {
      API.animationApi.moveWidget({
        id: ws[i].w.id,
        x: getX(i) + 5,
        y: 350 - ws[i].h,
      });
    }
  }
  API.commonApi.nextStep();

  let ll = l;
  let rr = mid;
  let p = l;

  while (ll < mid || rr < r) {
    if (ll >= mid) {
      API.animationApi.moveWidget({
        id: newArr[rr - l].w.id,
        x: getX(p),
        y: 150 - newArr[rr - l].h,
      });
      API.commonApi.nextStep();
      ws[p++] = newArr[rr - l];
      rr++;
      continue;
    }
    if (rr >= r) {
      API.animationApi.moveWidget({
        id: newArr[ll - l].w.id,
        x: getX(p),
        y: 150 - newArr[ll - l].h,
      });
      API.commonApi.nextStep();
      ws[p++] = newArr[ll - l];
      ll++;
      continue;
    }
    if (newArr[ll - l].value < newArr[rr - l].value) {
      API.animationApi.moveWidget({
        id: newArr[ll - l].w.id,
        x: getX(p),
        y: 150 - newArr[ll - l].h,
      });
      API.commonApi.nextStep();
      ws[p++] = newArr[ll - l];
      ll++;
    } else {
      API.animationApi.moveWidget({
        id: newArr[rr - l].w.id,
        x: getX(p),
        y: 150 - newArr[rr - l].h,
      });
      API.commonApi.nextStep();
      ws[p++] = newArr[rr - l];
      rr++;
    }
  }
}

sort(ws, 0, len);
