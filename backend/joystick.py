from RPi import GPIO  # For Pi 5 (install rpi-lgpio first)
import time  # MUST keep this import


joystick_pins = {
    "up": 17,
    "down": 4,
    "left": 22,
    "right": 27
}

button_press_pins = {
    "green": 23
}

button_light_pins = {
    "green": 24
}

green_on = False

GPIO.setmode(GPIO.BCM)
for pin in joystick_pins.values():
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

for pin in button_press_pins.values():
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

for pin in button_light_pins.values():
    GPIO.setup(pin, GPIO.OUT)

last_trigger_time = {dir: 0 for dir in joystick_pins}
debounce_delay = 0.5

try:
    print("Reading controls...")
    while True:
        # current_time = time.time()  # Now works correctly

        # # For joystick
        # for direction, pin in joystick_pins.items():
        #     if GPIO.input(pin) == GPIO.LOW:
        #         if current_time - last_trigger_time[direction] > debounce_delay:
        #             print(f"{direction} pressed")
        #             last_trigger_time[direction] = current_time

        # For buttons
        for buttons, lights in zip(button_press_pins.items(),
                                   button_light_pins.items()):
            if GPIO.input(buttons[1]) == GPIO.LOW and not green_on:
                GPIO.output(lights[1], GPIO.LOW)
                green_on = True
            elif GPIO.input(buttons[1]) == GPIO.HIGH and green_on:
                GPIO.output(lights[1], GPIO.HIGH)
                green_on = False
                # print(f"{direction} pressed")
                # last_trigger_time[direction] = current_time
        time.sleep(0.01)

except KeyboardInterrupt:
    GPIO.cleanup()

