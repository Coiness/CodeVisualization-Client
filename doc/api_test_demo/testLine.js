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

const c = $.Number({
  x: 500,
  y: 200,
  width: 50,
  height: 50,
  value: 50,
});

$.next();

const l1 = $.Line({
  size: 2,
  startNodeId: a.id,
  endNodeId: b.id,
  color: "rgb(35, 102, 213)",
  directional: true,
});

const l2 = $.Line({
  size: 2,
  startNodeId: b.id,
  endNodeId: c.id,
  color: "rgb(35, 102, 213)",
  directional: false,
});

$.next();

a.y = 300;
b.y = 100;

$.next();

a.x = 300;
b.x = 100;
$.next();
