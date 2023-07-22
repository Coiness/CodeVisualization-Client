// 栈
// let arr = JSON.parse(API.ioApi.getParam('arr'));
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let len = arr.length;
let widgets = [];
for (let i = 0; i < len; i++) {
	widgets[i] = {
		w: API.animationApi.addWidget({
			type: "number",
			x: i * 50 + 10,
			y: 100,
			width: 40,
			height: 20,
			numberValue: arr[i],
		}),
	};
}
API.commonApi.nextStep();

const stack = API.animationApi.addWidget({
	type: "stack",
	x: 10,
	y: 200,
	width: 100,
	height: 200,
});
API.commonApi.nextStep();

for (let i = 0; i < len; i++) {
	stack.push(widgets[i].w);
	API.commonApi.nextStep();
}

for (let i = 0; i < len; i++) {
	stack.pop();
	API.commonApi.nextStep();
}

API.commonApi.end();

// 展示代码
// function sort(arr) {
// 	let len = arr.length;
// 	for (let i = 0; i < len; i++) {
// 		for (let j = 0; j < len - 1; j++) {
// 			if (arr[j] > arr[j + 1]) {
// 				swap(arr, i, j);
// 			}
// 		}
// 		console.log(arr);
// 	}
// }

// function swap(arr, i, j) {
// 	let t = arr[i];
// 	arr[i] = arr[j];
// 	arr[j] = t;
// }