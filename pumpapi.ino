#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
 
#define LED_PIN 2
#define LED_RED_PIN 26
#define LED_GREEN_PIN 27
#define LED_BLUE_PIN 25
#define PUMP_PIN 18
#define MOISTURE_PIN 35
const char *SSID = "POHANET_ESP32";
const char *PWD = "Emese123";
WebServer server(80);
 
// JSON data buffer
StaticJsonDocument<250> jsonDocument;
char buffer[250];
 
// env variable
float rgb_red;
float rgb_blue;
float rgb_green;
float pump_right;
float pump_left;
float led;
int moisture;
int moisture_sum;

 
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
  server.on("/moisture", getMoisture);	 	 
  server.on("/rgbled", getRgbLed);	 	 
  server.on("/env", getEnv);	 	 
  server.on("/setled", HTTP_POST, setLed);	 	 
  server.on("/setrgbled", HTTP_POST, setRgbLed);	 	 
  	 	 
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
server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", buffer);
}
 
void getLed() {
  Serial.println("Get Led");
  create_json("led", led, "");
server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", buffer);
}
 
void getMoisture() {
moisture_sum=0; 
for (int i = 0; i <= 10; i++) {
moisture = analogRead(MOISTURE_PIN);
moisture_sum=moisture_sum+moisture;
  Serial.println(moisture);
    delay(10);
}
  create_json("moisture", moisture_sum/10, "");
server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", buffer);
}
void getRgbLed() {
  Serial.println("Get RGB Led");
server.sendHeader("Access-Control-Allow-Origin", "*");
  jsonDocument.clear();
  add_json_object("rgbred", rgb_red, "");
  add_json_object("rgbblue",rgb_blue, "");
  add_json_object("rgbgreen", rgb_green, "");
  serializeJson(jsonDocument, buffer);
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
void setLed() {
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  if (server.hasArg("plain") == false) {
    //handle error here
  }
  String body = server.arg("plain");
  deserializeJson(jsonDocument, body);
  
  if (jsonDocument.containsKey("pump_right")) {
    pump_right = jsonDocument["pump_right"];
    if(pump_right==1){
	digitalWrite(PUMP_PIN,HIGH);
        Serial.println("pump = on");
    }
    if(pump_right==0){
	digitalWrite(PUMP_PIN,LOW);
        Serial.println("pump = off");
    }
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
void setRgbLed() {
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  if (server.hasArg("plain") == false) {
    //handle error here
  }
  String body = server.arg("plain");
  deserializeJson(jsonDocument, body);
  
  if (jsonDocument.containsKey("rgbred")) {
    rgb_red = jsonDocument["rgbred"];
}
  if (jsonDocument.containsKey("rgbblue")) {
  rgb_blue= jsonDocument["rgbblue"];
}
  if (jsonDocument.containsKey("rgbgreen")) {
  rgb_green = jsonDocument["rgbgreen"];
}
	analogWrite(LED_GREEN_PIN,rgb_green);
	analogWrite(LED_BLUE_PIN,rgb_blue);
	analogWrite(LED_RED_PIN,rgb_red);
  // Respond to the client
  jsonDocument.clear();
  add_json_object("rgbred", rgb_red, "");
  add_json_object("rgbblue", rgb_blue, "");
  add_json_object("rgbgreen", rgb_green, "");
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
  pinMode(PUMP_PIN,OUTPUT);
  pinMode(LED_RED_PIN,OUTPUT);
  pinMode(LED_GREEN_PIN,OUTPUT);
  pinMode(LED_BLUE_PIN,OUTPUT);
  analogReadResolution(12);
  pump_right = 0;
  pump_left = 0;
  led = 0;
  connectToWiFi();	 	 
  setup_task();	 	 
  setup_routing(); 	 	 
  Serial.begin(9600);	 	 
  Serial.println("started");
}	 	 
  	 	 
void loop() {
  server.handleClient();	 	 
}
