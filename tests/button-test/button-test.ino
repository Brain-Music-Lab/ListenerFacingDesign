int button_input_pin = A0; //for use with 3V3 or 5V, the read pin MUST be an analog pin. The voltage is too low for the digital threshold.
int button_led_pin = 37; //will control whether the button is powered/activated (and lit) or not (off)
int button_state = 1; //keep track of if the button is activated

void setup() {

  pinMode(button_input_pin, INPUT);
  pinMode(button_led_pin, OUTPUT);
  digitalWrite(button_led_pin, HIGH);

  Serial.begin(115200);
}

void loop() {
  // pick a test function and uncomment it:
  
  detect_press();
  //button_blink();
  //press_when_lit();

}

void detect_press() {
  //print when the button is pressed
  int input_value = analogRead(button_input_pin);
  if(input_value == 0) {
    Serial.println("PRESS");

    delay(1000); //debounce: wait for a bit before reading again
  }

  delay(50);
}

void button_blink() {
  //blink the LED on the button
  digitalWrite(button_led_pin, LOW);
  delay(500);
  digitalWrite(button_led_pin, HIGH);
  delay(500);
}

void press_when_lit() {
  //indicates to the user when to press the button based on when the light is on.
  //press the button when the light is on to turn the light off.
  //button will not be active while the light is off.
  //wait until the light comes back on to interact.
  if((button_state == 1) && (analogRead(button_input_pin) == 0)) {
    digitalWrite(button_led_pin, LOW);
    button_state = 0;
    Serial.println("Response received");

    delay(2000);
    digitalWrite(button_led_pin, HIGH);
    button_state = 1;
    Serial.println("Waiting for response...");
  }

  delay(10);
}