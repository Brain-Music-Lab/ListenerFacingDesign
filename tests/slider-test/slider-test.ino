int slider_input_pin = A0;
int touch_input_pin = A1;
int motor_pin_1 = 5; //use pwm pin
int motor_pin_2 = 6; //use pwm pin

int min_slider_pos = 0;
int max_slider_pos = 176;
int mid_slider_pos = max_slider_pos/2;

int new_slider_pos = 0;

void setup() {
  pinMode(motor_pin_1, OUTPUT);
  pinMode(motor_pin_2, OUTPUT);
  analogWrite(motor_pin_1, 0);
  analogWrite(motor_pin_2, 0);

  Serial.begin(115200);
}

void loop() {
  // pick a test function and uncomment it:

  //read_slider_position();
  //move_slider();
  //reset_to_zero();
  //reset_to_middle();
}

void read_slider_position() {
  //reads and prints slider position
  Serial.println(analogRead(slider_input_pin));
  delay(50);
}

void detect_touch() {
  Serial.println(analogRead(touch_input_pin));
  delay(50);
}

void move_slider() {
  //slides the slider up and down
  int fader_pos = int(analogRead(slider_input_pin)/4); //initial position
  
  //move slider in direction of new position until reached
  float speed = 0;
  while (abs(fader_pos - new_slider_pos) > 4) {
   if (fader_pos > new_slider_pos) {
    speed = 2.25 * abs(fader_pos - new_slider_pos) / 256 + 0.2;
    speed = constrain(speed, -1.0, 1.0);
      if (speed > 0.0) {
        analogWrite(motor_pin_1, 0);
        analogWrite(motor_pin_2, 255);
      }
   }
   if (fader_pos < new_slider_pos) {
      speed = 2.25 * abs(fader_pos - new_slider_pos) / 256 - 0.2;
      speed = constrain(speed, -1.0, 1.0);
        if (speed > 0.0) {
          analogWrite(motor_pin_1, 255);
          analogWrite(motor_pin_2, 0);
        }
    }

    fader_pos = int(analogRead(slider_input_pin) / 4); //update position
  }

  //when position is reached turn off motor
  analogWrite(motor_pin_1, 0);
  analogWrite(motor_pin_2, 0);
  delay(1000);

  //set new desired slider position
  if(new_slider_pos == min_slider_pos) {
    new_slider_pos = max_slider_pos;
  }
  else if(new_slider_pos == max_slider_pos) {
    new_slider_pos = min_slider_pos;
  }
}

void reset_to_zero() {
  //slider will return to zero position 5s after user input
  int fader_pos = int(analogRead(slider_input_pin)/4); //initial position

  //wait for slider to move
  while(abs(fader_pos - min_slider_pos) < 4) {
    Serial.println("Waiting for user to move...");
    delay(500); //check every 500 ms
    fader_pos = int(analogRead(slider_input_pin) / 4); //update position
  }

  Serial.println("Input detected, returning to zero in 5s...");
  delay(5000); //after movement wait 5s

  //move slider back to zero
  float speed = 0;
  while (abs(fader_pos - min_slider_pos) > 4) {
    speed = 2.25 * abs(fader_pos - min_slider_pos) / 256 + 0.2;
    speed = constrain(speed, -1.0, 1.0);
      if (speed > 0.0) {
        analogWrite(motor_pin_1, 0);
        analogWrite(motor_pin_2, 255);
      }

    fader_pos = int(analogRead(slider_input_pin) / 4); //update position
  }

  //when position is reached turn off motor
  analogWrite(motor_pin_1, 0);
  analogWrite(motor_pin_2, 0);
  Serial.print("Fader pos: ");
  Serial.println(fader_pos);
}

void reset_to_middle() {
  //slider will return to middle position 5s after user input
  int fader_pos = int(analogRead(slider_input_pin)/4); //initial position

  //wait for slider to move
  while(abs(fader_pos - mid_slider_pos) < 10) {
    Serial.println("Waiting for user to move...");
    delay(500); //check every 500 ms
    fader_pos = int(analogRead(slider_input_pin) / 4); //update position
  }

  Serial.println("Input detected, returning to middle in 5s...");
  delay(5000); //after movement wait 5s

  //move slider back to middle
  float speed = 0;
  while (abs(fader_pos - mid_slider_pos) > 4) {
   if (fader_pos > mid_slider_pos) {
    speed = 2.25 * abs(fader_pos - mid_slider_pos) / 256 + 0.2;
    speed = constrain(speed, -1.0, 1.0);
      if (speed > 0.0) {
        analogWrite(motor_pin_1, 0);
        analogWrite(motor_pin_2, 255);
      }
   }
   if (fader_pos < mid_slider_pos) {
      speed = 2.25 * abs(fader_pos - mid_slider_pos) / 256 - 0.2;
      speed = constrain(speed, -1.0, 1.0);
        if (speed > 0.0) {
          analogWrite(motor_pin_1, 255);
          analogWrite(motor_pin_2, 0);
        }
    }

    fader_pos = int(analogRead(slider_input_pin) / 4); //update position
    Serial.println(fader_pos);
  }

  //when position is reached turn off motor
  analogWrite(motor_pin_1, 0);
  analogWrite(motor_pin_2, 0);
  Serial.print("Fader pos: ");
  Serial.println(fader_pos);
}