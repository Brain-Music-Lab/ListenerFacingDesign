from RPi import GPIO  # For Pi 5 (install rpi-lgpio first)
import time  # MUST keep this import


def turn_light_on(buttons_: dict, color: str):
    if not buttons_[color]["on"]:
        GPIO.output(buttons_[color]["light"], GPIO.HIGH)
        buttons_[color]["on"] = True

    return buttons_


def turn_light_off(buttons_: dict, color: str):
    if buttons_[color]["on"]:
        GPIO.output(buttons_[color]["light"], GPIO.LOW)
        buttons_[color]["on"] = False

    return buttons_


def initialize_hardware():
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

    return joystick, buttons

if __name__ == "__main__":

    joystick, buttons = initialize_hardware()

    try:
        print("Reading controls...")
        last_trigger_time = {dir: 0 for dir in joystick}
        debounce_delay = 0.5
        while True:
            current_time = time.time()  # Now works correctly

            # For joystick
            for direction, pin in joystick.items():
                if GPIO.input(pin) == GPIO.LOW:
                    if current_time - last_trigger_time[direction] > debounce_delay:
                        print(f"{direction} pressed")
                        last_trigger_time[direction] = current_time

            # For buttons
            for color, options in buttons.items():

                # Turn the light on at button press
                if GPIO.input(options["press"]) == GPIO.LOW and not options["on"]:
                    buttons = turn_light_on(buttons, color)

                # Turn the light off at button release
                elif GPIO.input(options["press"]) == GPIO.HIGH and options["on"]:
                    buttons = turn_light_off(buttons, color)

            time.sleep(0.01)

    except KeyboardInterrupt:
        GPIO.cleanup()

