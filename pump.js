led_status = -1;
rgb_red = -1;
rgb_green = -1;
rgb_blue = -1;
PUMP_URL="http://192.168.50.45/";
getLedStatus();
document.getElementById("setled").style.width = "20vw";
document.getElementById("setled").style.borderStyle = "none";


function getLedStatus() {
	getxhr = new XMLHttpRequest();
	getxhr.open("GET", PUMP_URL+"led");
	getxhr.responseType = "json";
	getxhr.send();
	getxhr.addEventListener("readystatechange", () => {
		if (getxhr.readyState === 4) {
			led_status = getxhr.response.value;
			console.log("GET ", led_status);

			if (led_status == 1) {
				document.getElementById("setled").innerHTML =
					"off";
				document.getElementById(
					"setled"
				).style.background = "red";
			}
			if (led_status == 0) {
				document.getElementById("setled").innerHTML =
					"on";
				document.getElementById(
					"setled"
				).style.background = "green";
			}
		}
	});
}

function getRgbLedStatus() {
	json = "";
	xhr = new XMLHttpRequest();
	xhr.open("GET", PUMP_URL+"rgbled");
	xhr.responseType = "json";
	xhr.send();
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = xhr.response;
			let text = "";
			for (const x in data) {
				if (data[x].type == "rgbred") {
					rgb_red = text = data[x].value;
document.getElementById("rgb_red").textContent = rgb_red;
				}
				if (data[x].type == "rgbgreen") {
					rgb_green = text = data[x].value;
document.getElementById("rgb_green").textContent = rgb_green;
				}
			}
			console.log("SET",rgb_red);
			}
		});
	};

function setLedStatus() {
	json = "";
	xhr = new XMLHttpRequest();
	if (led_status == 1) {
		json = JSON.stringify({
			led: "0",
		});
	}
	if (led_status == 0) {
		json = JSON.stringify({
			led: "1",
		});
	}
	xhr.open("POST", PUMP_URL+"setled");
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
			console.log("SET", led_status);
			getLedStatus();
		}
	});
}
function setRgbLedStatus() {
	json = "";
	xhr = new XMLHttpRequest();
		json = JSON.stringify({
		rgbred: document.getElementById("rgb_red").value,
		rgbblue: document.getElementById("rgb_blue").value,
		rgbgreen: document.getElementById("rgb_green").value,
		});
	xhr.open("POST", PUMP_URL+"setrgbled");
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
			document.getElementById("rgb_red").textContent =
				rgb_red;
			getRgbLedStatus();
		}

	});
}
function setValuesToBlue (){
	document.getElementById("rgb_red").value = 0;
	document.getElementById("rgb_blue").value = 1;
	document.getElementById("rgb_green").value = 0;
	setRgbLedStatus();
}

function setValuesToGreen (){
	document.getElementById("rgb_red").value = 0;
	document.getElementById("rgb_blue").value = 0;
	document.getElementById("rgb_green").value = 1;
	setRgbLedStatus();
}

function setValuesToRed (){
	document.getElementById("rgb_red").value = 1;
	document.getElementById("rgb_blue").value = 0;
	document.getElementById("rgb_green").value = 0;
	setRgbLedStatus();
}

