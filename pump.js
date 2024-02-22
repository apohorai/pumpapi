led_status = [];
pump_right = [];
rgb_red = -1;
rgb_green = -1;
rgb_blue = -1;
moisture = -1;
url = "";
var wsUri = "ws://127.0.0.1:5000";
websocket = new WebSocket(wsUri);

websocket.onopen = function (evt) {
	console.log("connected to websocket server");
	const msg = {
        type: "GUI connected",
      };
	console.log(JSON.stringify(msg)+"this is what I sent");
	websocket.send(JSON.stringify(msg));
};
//websocket.onmessage = function (msg) {
	// var string_arr = JSON.parse(msg["data"]).data;
//	var string = "";

	// string_arr.forEach((element) => {
	// 	string += String.fromCharCode(element);
	// });

	//console.log(string_arr);
	// var aaa = msg(["data"]).data;
	// console.log("aaa"+aaa);
	// console.log(msg);
	// var string_arr = JSON.parse(msg);
	// var string = "";
	// console.log(string_arr);
	// string_arr.forEach((element) => {
	// 	string += String.fromCharCode(element);
	// });

	// message = JSON.parse(string);
	// //sleep(100).then(() => { getLedStatus(2) });
	// if (message.item == "led") {
	// 	getLedStatus(2);
	// }
	// THIS IS WORKING, BUT TURNED OFF FOR TESTING
	// if (message.item == "moisture") {
	// 		document.getElementById(
	// 			"moisture_value" + 2 
	// 		).textContent = (message.value - 1100) / 2000;
	// 	console.log(message.value)
	// }
//};
websocket.addEventListener("message", (event) => {
	console.log("Message from server ", event["data"]);
	console.log(JSON.parse(event["data"]).type);
	console.log(JSON.parse(event["data"]).device_id);
	
  });
function renderHTML(){
	for (let i = 1; i < 4; i++) {
		getLedStatus(i);
		getPumpStatus(i);
	var board="board";
	var board_id=i;
	// var currentBoardLed=board+board_id;
	// var currentBoardPump=board+board_id;
	// console.log(currentBoardLed);
	// console.log(currentBoardPump);
	var div = document.createElement("div");
	div.style.width = "26%";
	div.style.float = "left";
	div.style.padding = "20px";
	div.style.margin = "3px";
	div.style.color = "white";
	div.style.border = "2px solid grey";

	currentBoardLed = document.createElement('button');
	currentBoardLed.innerText = "initial getLed";
	currentBoardLed.setAttribute("onclick", "setLedStatus("+board_id+")");
	currentBoardLed.setAttribute("id", "setled"+board_id);

	currentBoardPump = document.createElement('button');
	currentBoardPump.innerText = "initial getPump";
	currentBoardPump.setAttribute("onclick", "setPumpStatus("+board_id+")");
	currentBoardPump.setAttribute("id", "setpump"+board_id);

	div.append(currentBoardLed);
	div.append(currentBoardPump);
	document.getElementById("main").appendChild(div);
	}






}

function whichBoard(id) {
	if (id == 1) {
		url = "http://192.168.1.102/";
	}
	if (id == 2) {
		url = "http://192.168.1.103/";
	}
	if (id == 3) {
		url = "http://192.168.1.104/";
	}
	if (id == 4) {
		url = "http://192.168.50.77/";
	}
	if (id == 5) {
		url = "http://192.168.50.63/";
	}
}

function getLedStatus(id) {
	let idlocal = id;
	whichBoard(id);
	let ledxhr = new XMLHttpRequest();
	ledxhr.open("GET", url + "led");
	ledxhr.responseType = "json";
	ledxhr.send();
	ledxhr.addEventListener("readystatechange", () => {
		if (ledxhr.readyState === 4) {
			led_status[idlocal] = ledxhr.response.value;
			console.log(
				"GET LED",
				led_status[idlocal] + " id=" + idlocal
			);

			if (led_status[idlocal] == 1) {
				document.getElementById(
					"setled" + idlocal
				).innerHTML = "led on";
				document.getElementById(
					"setled" + idlocal
				).style.background = "red";
			}
			if (led_status[idlocal] == 0) {
				document.getElementById(
					"setled" + idlocal
				).innerHTML = "led off";
				document.getElementById(
					"setled" + idlocal
				).style.background = "green";
			}
		}
	});
}
function getPumpStatus(id) {
	let idlocal = id;
	whichBoard(idlocal);
	let getxhr = new XMLHttpRequest();
	getxhr.open("GET", url + "pump_right");
	getxhr.responseType = "json";
	getxhr.send();
	getxhr.addEventListener("readystatechange", () => {
		if (getxhr.readyState === 4) {
			pump_right[idlocal] = getxhr.response.value;
			console.log(
				"GET PUMP",
				pump_right[idlocal] + " id:" + id
			);

			if (pump_right[idlocal] == 1) {
				document.getElementById(
					"setpump" + id
				).innerHTML = "PIN on";
				document.getElementById(
					"setpump" + id
				).style.background = "red";
			}
			if (pump_right[idlocal] == 0) {
				document.getElementById(
					"setpump" + id
				).innerHTML = "PIN off";
				document.getElementById(
					"setpump" + id
				).style.background = "green";
			}
		}
	});
}

function getMoisture(id) {
	whichBoard(id);
	let mgetxhr = new XMLHttpRequest();
	mgetxhr.open("GET", url + "moisture");
	mgetxhr.responseType = "json";
	mgetxhr.send();
	mgetxhr.addEventListener("readystatechange", () => {
		if (mgetxhr.readyState === 4) {
			moisture = mgetxhr.response.value;
			document.getElementById(
				"moisture_value" + id
			).textContent = (moisture - 1100) / 2000;
			console.log(moisture);
		}
	});
}
function getRgbLedStatus(id) {
	whichBoard(id);
	json = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url + "rgbled");
	xhr.responseType = "json";
	xhr.send();
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = xhr.response;
			let text = "";
			for (const x in data) {
				if (data[x].type == "rgbred") {
					rgb_red = text = data[x].value;
					document.getElementById(
						"rgb_red" + id
					).textContent = rgb_red;
				}
				if (data[x].type == "rgbgreen") {
					rgb_green = text = data[x].value;
					document.getElementById(
						"rgb_green" + id
					).textContent = rgb_green;
				}
			}
		}
	});
}

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
	xhr.open("POST", url + "setled");
	xhr.send(json);
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = JSON.parse(xhr.response);
			let text = "";
			for (const x in data) {
				if (data[x].type == "led") {
					led_status[localid] = text =
						data[x].value;
				}
			}
			console.log("SET", led_status[localid]);
			getLedStatus(localid);
		}
	});
}
function setPumpStatus(id) {
	let idlocal = id;
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
	xhr.open("POST", url + "setled");
	xhr.send(json);
	xhr.addEventListener("readystatechange", () => {
		if (xhr.readyState === 4) {
			const data = JSON.parse(xhr.response);
			let text = "";
			for (const x in data) {
				if (data[x].type == "pump_right") {
					pump_right[idlocal] = text =
						data[x].value;
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
		rgbred: document.getElementById("rgb_red" + id).value,
		rgbblue: document.getElementById("rgb_blue" + id).value,
		rgbgreen: document.getElementById("rgb_green" + id).value,
	});
	xhr.open("POST", url + "setrgbled");
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
			document.getElementById("rgb_red" + id).textContent =
				rgb_red;
			getRgbLedStatus(id);
		}
	});
}
function setValuesToBlue(id) {
	whichBoard(id);
	document.getElementById("rgb_red" + id).value = 0;
	document.getElementById("rgb_blue" + id).value = 1;
	document.getElementById("rgb_green" + id).value = 0;
	setRgbLedStatus(id);
}

function setValuesToGreen(id) {
	whichBoard(id);
	document.getElementById("rgb_red" + id).value = 0;
	document.getElementById("rgb_blue" + id).value = 0;
	document.getElementById("rgb_green" + id).value = 1;
	setRgbLedStatus(id);
}

function setValuesToRed(id) {
	whichBoard(id);
	document.getElementById("rgb_red" + id).value = 1;
	document.getElementById("rgb_blue" + id).value = 0;
	document.getElementById("rgb_green" + id).value = 0;
	setRgbLedStatus(id);
}
function loop(id) {
	whichBoard(id);
	for (let i = 0; i < 200; i++) {
		document.getElementById("rgb_red" + id).value = i;
		document.getElementById("rgb_green" + id).value = 0;
		document.getElementById("rgb_blue" + id).value = 0;
		setRgbLedStatus(id);
		console.log(i);
	}
	for (let i = 200; i > 0; i--) {
		document.getElementById("rgb_red" + id).value = i;
		document.getElementById("rgb_green" + id).value = 0;
		document.getElementById("rgb_blue" + id).value = 0;
		setRgbLedStatus(id);
		console.log(i);
	}
	for (let i = 0; i < 200; i++) {
		document.getElementById("rgb_red" + id).value = 0;
		document.getElementById("rgb_green" + id).value = i;
		document.getElementById("rgb_blue" + id).value = 0;
		setRgbLedStatus(id);
		console.log(i);
	}
	for (let i = 200; i > 0; i--) {
		document.getElementById("rgb_red" + id).value = 0;
		document.getElementById("rgb_green" + id).value = i;
		document.getElementById("rgb_blue" + id).value = 0;
		setRgbLedStatus(id);
		console.log(i);
	}
	for (let i = 0; i < 200; i++) {
		document.getElementById("rgb_red" + id).value = 0;
		document.getElementById("rgb_green" + id).value = 0;
		document.getElementById("rgb_blue" + id).value = i;
		setRgbLedStatus(id);
		console.log(i);
	}
	for (let i = 200; i > 0; i--) {
		document.getElementById("rgb_red" + id).value = 0;
		document.getElementById("rgb_green" + id).value = 0;
		document.getElementById("rgb_blue" + id).value = i;
		setRgbLedStatus(id);
		console.log(i);
	}
	document.getElementById("rgb_red" + id).value = 0;
	document.getElementById("rgb_green" + id).value = 0;
	document.getElementById("rgb_blue" + id).value = 0;
	setRgbLedStatus(id);
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
