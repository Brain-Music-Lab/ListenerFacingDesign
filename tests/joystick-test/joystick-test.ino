//NOTE: IT IS BEST TO INCLUDE A LOW PASS FILTER ON EACH INPUT PIN
// 1M RESISTOR AND 47nF CAPACITOR WORKS WELL.

int jstk_input_up_pin = A0;
int jstk_input_down_pin = A1;
int jstk_input_right_pin = A2;
int jstk_input_left_pin = A3;

void setup() {
  pinMode(jstk_input_left_pin, INPUT);
  pinMode(jstk_input_right_pin, INPUT);
  pinMode(jstk_input_up_pin, INPUT);
  pinMode(jstk_input_down_pin, INPUT);

  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
  
  read_input_direction();
}

void read_input_direction() {
  //prints the direction user moves joystick
  //open in serial PLOTTER

  int up = analogRead(jstk_input_up_pin);
  int down = analogRead(jstk_input_down_pin);
  int left = analogRead(jstk_input_left_pin);
  int right = analogRead(jstk_input_right_pin);

  Serial.print("UP:");
  Serial.print(up);
  Serial.print(",");
  Serial.print("DOWN:");
  Serial.print(down);
  Serial.print(",");
  Serial.print("LEFT:");
  Serial.print(left);
  Serial.print(",");
  Serial.print("RIGHT:");
  Serial.println(right);

  delay(50);
}