// 测试 deleteWidget 小 Demo

let count = $.Number({
  x: 10,
  y: 10,
  value: 30,
});
let str = $.String({
  x: 200,
  y: 200,
  width: 300,
  height: 100,
  value: "Hello World!",
});

$.next();

count.y = 100;

$.next();

count.color = "#f00";

$.next();

str.width = 200;
str.height = 80;

$.next();
str.color = "pink";

$.next();

$.del(count);

$.next();

$.del(str);

$.next();
