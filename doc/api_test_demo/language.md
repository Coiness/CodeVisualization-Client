```js
// 逻辑代码
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
API.commonApi.nextStep(2, 3);

function swap(i, j) {
	let t = widgets[i];
	widgets[i] = widgets[j];
	widgets[j] = t;
	API.animationApi.moveWidget({ id: widgets[i].w.id, x: widgets[j].x, y: widgets[i].y });
	API.animationApi.moveWidget({ id: widgets[j].w.id, x: widgets[i].x, y: widgets[j].y });
	t = widgets[i].x;
	widgets[i].x = widgets[j].x;
	widgets[j].x = t;
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

API.commonApi.end();
```

```js
// js 演示代码
function sort(arr) {
	let len = arr.length;
	for (let i = 0; i < len; i++) {
		for (let j = 0; j < len - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				swap(arr, i, j);
			}
		}
		console.log(arr);
	}
}

function swap(arr, i, j) {
	let t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;
}
```

```java
// java 演示代码
public class Main {
    public static void sort(int[] arr) {
		int len = arr.length;
        for (int i = 0; i < len; i++) {
            for (int j = 0; j < len - 1; j++) {
                if(arr[j] > arr[j + 1]) {
					swap(arr, i, j);
                }
            }
			System.out.println(arr);
        }
    }

	public static void swap(int[] arr, int i, int j) {
		int tmp = arr[j];
		arr[j] = arr[j + 1];
		arr[j + 1] = tmp;
	}
}
```