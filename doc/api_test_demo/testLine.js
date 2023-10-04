const a = $.Number({
  x: 100,
  y: 200,
  width: 50,
  height: 50,
  value: 30,
});

const b = $.Number({
  x: 300,
  y: 200,
  width: 50,
  height: 50,
  value: 40,
});

$.next();

const l = $.Line({
  size: 3,
  startNodeId: a.id,
  endNodeId: b.id,
  color: "rgb(35, 102, 213)",
});

$.next();

a.y = 300;
b.y = 100;

$.next();

a.x = 300;
b.x = 100;
$.next();
