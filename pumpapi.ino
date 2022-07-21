#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
 
#define LED_PIN 2
const char *SSID = "POHANET";
const char *PWD = "Emese123";
WebServer server(80);
 
// JSON data buffer
StaticJsonDocument<250> jsonDocument;
char buffer[250];
 
// env variable
float pump_right;
float pump_left;
float led;
 
void connectToWiFi() {
  Serial.print("Connecting to ");
  Serial.println(SSID);
  
  WiFi.begin(SSID, PWD);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
    // we can even make the ESP32 to sleep
  }
 
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
}
void setup_routing() {	 	 
  server.on("/pump_right", getPumpRight);	 	 
  server.on("/pump_left", getPumpLeft);	 	 
  server.on("/led", getLed);	 	 
  server.on("/env", getEnv);	 	 
  server.on("/setled", HTTP_POST, handlePost);	 	 
  	 	 
  // start server	 	 
  server.begin();	 	 
}
 
void create_json(char *tag, float value, char *unit) {  
  jsonDocument.clear();  
  jsonDocument["type"] = tag;
  jsonDocument["value"] = value;
  jsonDocument["unit"] = unit;
  serializeJson(jsonDocument, buffer);
}
 
void add_json_object(char *tag, float value, char *unit) {
  JsonObject obj = jsonDocument.createNestedObject();
  obj["type"] = tag;
  obj["value"] = value;
  obj["unit"] = unit; 
}
void read_sensor_data(void * parameter) {
   for (;;) {
  //   pump_right = 1;
  //   pump_left = 2;
  //   led = 3;
     Serial.println("Read sensor data");
 
     // delay the task
     vTaskDelay(60000 / portTICK_PERIOD_MS);
   }
}
 
void getPumpLeft() {
  Serial.println("Get Pump Left");
  create_json("pump_left", pump_left, "");
  server.send(200, "application/json", buffer);
}
 
void getPumpRight() {
  Serial.println("Get Pump Right");
  create_json("pump_right", pump_right, "");
  server.send(200, "application/json", buffer);
}
 
void getLed() {
  Serial.println("Get Led");
  create_json("led", led, "");
server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", buffer);
}
 
void getEnv() {
  Serial.println("Get env");
  jsonDocument.clear();
  add_json_object("pump_right", pump_right, "");
  add_json_object("pump_left", pump_left, "");
  add_json_object("led", led, "");
  serializeJson(jsonDocument, buffer);
  server.send(200, "application/json", buffer);
}
void handlePost() {
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  if (server.hasArg("plain") == false) {
    //handle error here
  }
  String body = server.arg("plain");
  deserializeJson(jsonDocument, body);
  
  if (jsonDocument.containsKey("pump_right")) {
    pump_right = jsonDocument["pump_right"];
    Serial.println(pump_right);
}
  if (jsonDocument.containsKey("pump_left")) {
  pump_left = jsonDocument["pump_left"];
    Serial.println(pump_left);
}
  if (jsonDocument.containsKey("led")) {
  led = jsonDocument["led"];
    Serial.println(led);
    if(led==1){
	digitalWrite(LED_PIN,HIGH);
        Serial.println("led = on");
    }
    if(led==0){
	digitalWrite(LED_PIN,LOW);
        Serial.println("led = off");
    }
}

  // Respond to the client
  jsonDocument.clear();
  add_json_object("pump_right", pump_right, "");
  add_json_object("pump_left", pump_left, "");
  add_json_object("led", led, "");
  serializeJson(jsonDocument, buffer);
  server.send(200, "application/json", buffer);
}
void setup_task(){ 
  xTaskCreate(
  read_sensor_data,
  "Read sensor data",
  1000,
  NULL,
  1,
  NULL
  );
}
void setup() {
  pinMode(LED_PIN,OUTPUT);
  pump_right = 0;
  pump_left = 0;
  led = 0;
  connectToWiFi();	 	 
  setup_task();	 	 
  setup_routing(); 	 	 
  Serial.begin(115200);	 	 
  Serial.println("started");
}	 	 
  	 	 
void loop() {
  server.handleClient();	 	 
}
