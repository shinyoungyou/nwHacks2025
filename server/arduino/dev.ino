#include "CurieIMU.h"

const int SERIAL_DELAY_MS = 9600;
const int DELAY_MS = 100;

int BuzzerPin = A3;
int buttonOverridePin = 4;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(SERIAL_DELAY_MS);

  while (!Serial);

  Serial.println("init IMU peripheral :D");
  CurieIMU.begin();
  pinMode(BuzzerPin, OUTPUT);
  pinMode(buttonOverridePin, INPUT);

  CurieIMU.setAccelerometerRange(2);
}

struct Threshold {
  double x{ 0.0 };
  double y{ 0.0 };
  double z{ 0.0 };
};

Threshold origin;

struct ThresholdInfo {
  bool initialized{ false };
  Threshold val;
} metadata;

int pressed = 0;
bool turnBuzzerOn = true;

// if x decreases AND z increases by 0.3 each, we have a SLOUCHER

// also implement a manual button override for enabling/disabling buzzer output

void checkInboundData() {
  String data = Serial.readStringUntil('\n');
  if (data[0] == 'B') {
    turnBuzzerOn = data[2] == '1';
    return;
  }

  // split inbound data based on delimiter "|"
  int index1 = data.indexOf("|");
  String firstToken = data.substring(0, index1);    
  if (firstToken[0] == '-') {
    origin.x = firstToken.substring(1).toDouble() * -1.0;
  } else {
    origin.x = firstToken.toDouble();
  }

  int index2 = data.indexOf("|", index1 + 1);
  String secondToken = data.substring(index1 + 1, index2);
  if (secondToken[0] == '-') {
    origin.y = secondToken.substring(1).toDouble() * -1.0;
  } else {
    origin.y = secondToken.toDouble();
  }

  // int index3 = data.indexOf("|", index2 + 1);
  String thirdToken = data.substring(index2 + 1);
  if (thirdToken[0] == '-') {
    origin.z = thirdToken.substring(1).toDouble() * -1.0;
  } else {
    origin.z = thirdToken.toDouble();
  }
  // for every token, convert to double and assign to struct variable
  // if negative (ie. first char of token is "-"), discard first string and convert; multiply by -1 aftrewards

  char writeBuf[204];
  snprintf(writeBuf, 204, "> calibration pt: (%f, %f, %f)", origin.x, origin.y, origin.z);
  Serial.println(writeBuf);
}

bool thresholdCrossed(double x, double y, double z) {
  bool xCrossed = origin.x - 0.3 > x;
  bool zCrossed = origin.z + 0.3 < z;

  // x decreases; crossed if decreased by more than 0.3
  // z increases; crossed if increased by more than 0.3
  return xCrossed && zCrossed;
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available() > 0) {
    checkInboundData();
    metadata.initialized = true;
  }

  float x, y, z;

  CurieIMU.readAccelerometerScaled(x, y, z);
  const int bufferLength = 50;
  char buffer[bufferLength];

  snprintf(buffer, bufferLength, "%.04f|%.04f|%.04f", x, y, z);
  Serial.println(buffer);
  
  pressed = digitalRead(buttonOverridePin);
  char b[20];
  snprintf(b, 20, "> pressed? %d", pressed);
  Serial.println(b);

  if (metadata.initialized) {

    if (pressed == LOW && turnBuzzerOn && thresholdCrossed(double(x), double(y), double(z))) {
      Serial.println("> THRESHOLD CROSSED!!!!!!");
      analogWrite(BuzzerPin, 255);
    } else {
      analogWrite(BuzzerPin, 0);
    }
  }

  delay(DELAY_MS);
}

