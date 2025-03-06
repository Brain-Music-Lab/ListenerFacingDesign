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

  int up = analogRead(jstk_input_up_pin);
  int down = analogRead(jstk_input_down_pin);
  int left = analogRead(jstk_input_left_pin);
  int right = analogRead(jstk_input_right_pin);

  //check diagonals first
  if((up == 0) && (left == 0)) {
    Serial.println("UP-LEFT");
  }
  else if((up == 0) && (right == 0)) {
    Serial.println("UP-RIGHT");
  }
  else if((down == 0) && (right == 0)) {
    Serial.println("DOWN-RIGHT");
  }
  else if((down == 0) && (left == 0)) {
    Serial.println("DOWN-LEFT");
  }
  else if((down == 0)) {
    Serial.println("DOWN");
  }

  delay(10);
}