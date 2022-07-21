led_status = -1;
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
			document.getElementById("led_status").textContent =
				led_status;

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
			document.getElementById("led_status").textContent =
				led_status;
			getLedStatus();
		}
	});
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
