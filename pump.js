led_status = [];
pump_right = [];
rgb_red = -1;
rgb_green = -1;
rgb_blue = -1;
moisture = -1;
url = "";

function whichBoard(id){
	if (id==1) {
		url="http://192.168.50.56/";
	}
	if (id==2) {
		url="http://192.168.50.45/";
	}
	if (id==3) {
		url="http://192.168.50.75/";
	}

}

function getLedStatus(id) {
	let idlocal = id;
	whichBoard(id);
	let ledxhr = new XMLHttpRequest();
	ledxhr.open("GET", url+"led");
	ledxhr.responseType = "json";
	ledxhr.send();
	ledxhr.addEventListener("readystatechange", () => {
		if (ledxhr.readyState === 4) {
			led_status[idlocal] = ledxhr.response.value;
			console.log("GET LED", led_status[idlocal] +" id="+idlocal);

			if (led_status[idlocal] == 1) {
				document.getElementById("setled"+idlocal).innerHTML =
					"led off";
				document.getElementById(
					"setled"+idlocal
				).style.background = "red";
			}
			if (led_status[idlocal] == 0) {
				document.getElementById("setled"+idlocal).innerHTML =
					"led on";
				document.getElementById(
					"setled"+idlocal
				).style.background = "green";
			}
		}
	});
}
function getPumpStatus(id) {
	let idlocal=id;
	whichBoard(idlocal);
	let getxhr = new XMLHttpRequest();
	getxhr.open("GET", url+"pump_right");
	getxhr.responseType = "json";
	getxhr.send();
	getxhr.addEventListener("readystatechange", () => {
		if (getxhr.readyState === 4) {
			pump_right[idlocal] = getxhr.response.value;
			console.log("GET PUMP", pump_right[idlocal]+" id:"+id);

			if (pump_right[idlocal]== 1) {
				document.getElementById("setpump"+id).innerHTML =
					"pump off";
				document.getElementById(
					"setpump"+id
				).style.background = "red";
			}
			if (pump_right[idlocal]== 0) {
				document.getElementById("setpump"+id).innerHTML =
					"pump on";
				document.getElementById(
					"setpump"+id
				).style.background = "green";
			}
		}
	});
}

function getMoisture(id) {
	whichBoard(id);
	let mgetxhr = new XMLHttpRequest();
	mgetxhr.open("GET", url+"moisture");
	mgetxhr.responseType = "json";
	mgetxhr.send();
	mgetxhr.addEventListener("readystatechange", () => {
		if (mgetxhr.readyState === 4) {
			moisture = mgetxhr.response.value;
	document.getElementById("moisture_value"+id).textContent = (moisture-1100)/2000;
			console.log(moisture);
			}
		});
	};
function getRgbLedStatus(id) {
	whichBoard(id);
	json = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url+"rgbled");
	xhr.responseType = "json";
	xhr.send();
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = xhr.response;
			let text = "";
			for (const x in data) {
				if (data[x].type == "rgbred") {
					rgb_red = text = data[x].value;
document.getElementById("rgb_red"+id).textContent = rgb_red;
				}
				if (data[x].type == "rgbgreen") {
					rgb_green = text = data[x].value;
document.getElementById("rgb_green"+id).textContent = rgb_green;
				}
			}
			}
		});
	};

function setLedStatus(id) {
	let localid = id;
	whichBoard(localid);
	getLedStatus(localid);
	
	json = "";
	let xhr = new XMLHttpRequest();
	if (led_status[localid] == 1) {
		json = JSON.stringify({
			led: "0",
		});
	}
	if (led_status[localid] == 0) {
		json = JSON.stringify({
			led: "1",
		});
	}
	xhr.open("POST", url+"setled");
	xhr.send(json);
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = JSON.parse(xhr.response);
			let text = "";
			for (const x in data) {
				if (data[x].type == "led") {
					led_status[localid] = text = data[x].value;
				}
			}
			console.log("SET", led_status[localid]);
			getLedStatus(localid);
		}
	});
}
function setPumpStatus(id) {
	let idlocal=id;
	whichBoard(idlocal);
	json = "";
	let xhr = new XMLHttpRequest();
	if (pump_right[idlocal] == 1) {
		json = JSON.stringify({
			pump_right: "0",
		});
	}
	if (pump_right[idlocal] == 0) {
		json = JSON.stringify({
			pump_right: "1",
		});
	}
	xhr.open("POST", url+"setled");
	xhr.send(json);
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = JSON.parse(xhr.response);
			let text = "";
			for (const x in data) {
				if (data[x].type == "pump_right") {
					pump_right[idlocal]= text = data[x].value;
				}
			}
			console.log("SET", pump_right[idlocal]);
			getPumpStatus(idlocal);
		}
	});
}
function setRgbLedStatus(id) {
	whichBoard(id);
	json = "";
	let xhr = new XMLHttpRequest();
		json = JSON.stringify({
		rgbred: document.getElementById("rgb_red"+id).value,
		rgbblue: document.getElementById("rgb_blue"+id).value,
		rgbgreen: document.getElementById("rgb_green"+id).value,
		});
	xhr.open("POST",url+"setrgbled");
	xhr.send(json);
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = JSON.parse(xhr.response);
			let text = "";
			for (const x in data) {
				if (data[x].type == "led") {
					led_status = text = data[x].value;
				}
			}
			document.getElementById("rgb_red"+id).textContent =
				rgb_red;
			getRgbLedStatus(id);
		}

	});
}
function setValuesToBlue (id){
	whichBoard(id);
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = 1;
	document.getElementById("rgb_green"+id).value = 0;
	setRgbLedStatus(id);
}

function setValuesToGreen (id){
	whichBoard(id);
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = 0;
	document.getElementById("rgb_green"+id).value = 1;
	setRgbLedStatus(id);
}

function setValuesToRed (id){
	whichBoard(id);
	document.getElementById("rgb_red"+id).value = 1;
	document.getElementById("rgb_blue"+id).value = 0;
	document.getElementById("rgb_green"+id).value = 0;
	setRgbLedStatus(id);
}
function loop(id){
	whichBoard(id);
for (let i = 0; i < 200; i++) {
	document.getElementById("rgb_red"+id).value = i;
	document.getElementById("rgb_green"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = 0;
	setRgbLedStatus(id)
	console.log(i);
}
for (let i = 200; i > 0; i--) {
	document.getElementById("rgb_red"+id).value = i;
	document.getElementById("rgb_green"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = 0;
	setRgbLedStatus(id)
	console.log(i);
}
for (let i = 0; i < 200; i++) {
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_green"+id).value = i;
	document.getElementById("rgb_blue"+id).value = 0;
	setRgbLedStatus(id)
	console.log(i);
}
for (let i = 200; i > 0; i--) {
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_green"+id).value = i;
	document.getElementById("rgb_blue"+id).value = 0;
	setRgbLedStatus(id)
	console.log(i);
}
for (let i = 0; i < 200; i++) {
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_green"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = i;
	setRgbLedStatus(id)
	console.log(i);
}
for (let i = 200; i > 0; i--) {
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_green"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = i;
	setRgbLedStatus(id)
	console.log(i);
}
	document.getElementById("rgb_red"+id).value = 0;
	document.getElementById("rgb_green"+id).value = 0;
	document.getElementById("rgb_blue"+id).value = 0;
	setRgbLedStatus(id)
}

