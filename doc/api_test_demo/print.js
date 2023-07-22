for (let i = 0; i < 10; i++) {
	API.ioApi.println(`${i + 1}`);
	API.commonApi.nextStep();
}

API.commonApi.end();