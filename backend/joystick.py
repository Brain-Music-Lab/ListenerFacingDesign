from RPi import GPIO  # For Pi 5 (install rpi-lgpio first)
import time  # MUST keep this import


joystick = {
    "up": 17,
    "down": 4,
    "left": 22,
    "right": 27
}

buttons = {
    "blue": {
        "press": 23,
        "light": 24,
        "on": False
    },
    "yell0w": {
        "press": 25,
        "light": 9,
        "on": False
    },
    "red": {
        "press": 8,
        "light": 11,
        "on": False
    },
    "green": {
        "press": 6,
        "light": 12,
        "on": False
    },
}

GPIO.setmode(GPIO.BCM)
for pin in joystick.values():
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

for attribute in buttons.values():
    # Get pins
    press_pin = attribute["press"]
    light_pin = attribute["light"]

    # Set pins
    GPIO.setup(press_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(light_pin, GPIO.OUT)

# last_trigger_time = {dir: 0 for dir in joystick_pins}
# debounce_delay = 0.5

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
        for button in buttons.values():

            if GPIO.input(button["press"]) == GPIO.LOW and not button["on"]:
                GPIO.output(button["light"], GPIO.HIGH)
                button["on"] = False
            elif GPIO.input(button["press"]) == GPIO.HIGH and button["on"]:
                GPIO.output(button["light"], GPIO.LOW)
                button["off"] = True
                # print(f"{direction} pressed")
                # last_trigger_time[direction] = current_time
        time.sleep(0.01)

except KeyboardInterrupt:
    GPIO.cleanup()

