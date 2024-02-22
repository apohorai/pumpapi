
const WebSocket = require('ws');
//Axios is a promise-based HTTP Client 
const axios = require('axios');
const a =1;
const serverAddress = "ws://127.0.0.1:5000";
led = 0;
const ws = new WebSocket(serverAddress, {
    headers: {
        "user-agent": "Mozilla"
    }
});
// Open a connection to my wsserver
ws.on('open', function() {
    ws.send("Scheduler client connected");
    myLoop();
    
});

ws.on('message', function(msg) {
    console.log("Received msg from the server: " + msg);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function myLoop(){
    
      axios
      .get('http://192.168.1.103/led')
      .then(res => {
        led=res.data.value;
        switch(led) {
            case 1:
              led=0;
              break;
            case 0:
              led=1;
              break;
          }
          axios
          .post('http://192.168.1.103/setled', {
            led: led,
          })
          .then(res => {
            //console.log(`statusCode: ${res.status}`);
            console.log("Led set to:"+led);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });


    const msg = {
        type: "scheduler",
        device_id: 1,
        item: "led",
        value: led
      };
    ws.send(JSON.stringify(msg));
    console.log("");
    sleep(1000).then(() => { myLoop() });
}
