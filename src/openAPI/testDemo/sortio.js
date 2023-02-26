// 排序
let arr = JSON.parse(API.ioApi.getParam('arr'));
let len = arr.length;
let widgets = [];
for (let i = 0; i < len; i++) {
	let height = arr[i] * 3;
	widgets[i] = {
		w: API.animationApi.addWidget({
			type: "number",
			x: i * 50 + 10,
			y: 350 - height,
			width: 40,
			height: height,
			numberValue: arr[i],
		}),
		value: arr[i],
		x: i * 50 + 10,
		y: 350 - height,
	};
}
API.commonApi.nextStep();

function swap(i, j) {
	let t = widgets[i];
	widgets[i] = widgets[j];
	widgets[j] = t;
	API.animationApi.moveWidget({ id: widgets[i].w.id, x: widgets[j].x, y: widgets[i].y });
	API.animationApi.moveWidget({ id: widgets[j].w.id, x: widgets[i].x, y: widgets[j].y });
	t = widgets[i].x;
	widgets[i].x = widgets[j].x;
	widgets[j].x = t;
	API.commonApi.nextStep();
}

for (let i = 0; i < len; i++) {
	for (let j = 0; j < len - 1; j++) {
		if (widgets[j].value > widgets[j + 1].value) {
			swap(j, j + 1);
		}
	}
	let values = [];
	for (let j = 0; j < len; j++) {
		values[j] = widgets[j].value;
	}
	API.ioApi.println(JSON.stringify(values));
	API.commonApi.nextStep();
}

API.commonApi.end();