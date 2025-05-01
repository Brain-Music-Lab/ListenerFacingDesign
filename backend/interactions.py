from RPi import GPIO  # For Pi 5 (install rpi-lgpio first)
import time  # MUST keep this import


def test_foo():
    return "hello"


def process_joystick_input(joystick: dict) -> tuple[dict, dict | None]:
    for direction in joystick.keys():
        pin = joystick[direction]["pin"]
        pressed = joystick[direction]["state"]

        # Check if pressed. We return true if it was pressed this frame
        if GPIO.input(pin) == GPIO.LOW and not pressed:
            joystick[direction]["state"] = True
            return joystick, {direction: True}
        
        # Check if returned for state management. We do not notify of release
        elif GPIO.input(pin) == GPIO.HIGH and pressed:
            joystick[direction]["state"] = False
    
    return joystick, None


def process_button_input(buttons: dict) -> tuple[dict, dict | None]:
    for color in buttons.keys():
        # Get pin and pressed state
        pin = buttons[color]["press"]["pin"]
        pressed = buttons[color]["press"]["state"]
        
        # If pressed this frame
        if GPIO.input(pin) == GPIO.LOW and not pressed:
            buttons[color]["press"]["state"] = True
            return buttons, {color: True}
        
        # If released this frame
        if GPIO.input(pin) == GPIO.HIGH and pressed:
            buttons[color]["press"]["state"] = False
            return buttons, {color: False}
        
    # Return none if no activity
    return buttons, None


def turn_light_on(buttons_: dict, color: str):
    if not buttons_[color]["light"]["state"]:
        GPIO.output(buttons_[color]["light"]["pin"], GPIO.HIGH)
        buttons_[color]["light"]["state"] = True

    return buttons_


def turn_light_off(buttons_: dict, color: str):
    if buttons_[color]["light"]["state"]:
        GPIO.output(buttons_[color]["light"]["pin"], GPIO.LOW)
        buttons_[color]["light"]["state"] = False

    return buttons_


def initialize_hardware():
    # joystick = {
    #     "up": {
    #         "state": False,
    #         "pin": 17
    #     },
    #     "down": {
    #         "state": False,
    #         "pin": 4
    #     },
    #     "left": {
    #         "state": False,
    #         "pin": 22
    #     },
    #     "right": {
    #         "state": False,
    #         "pin": 27
    #     }
    # }

    joystick = {
        "up": {
            "state": False,
            "pin": 27
        },
        "down": {
            "state": False,
            "pin": 22
        },
        "left": {
            "state": False,
            "pin": 17
        },
        "right": {
            "state": False,
            "pin": 4
        }
    }

    buttons = {
        "blue": {
            "press": {
                "state": False,
                "pin": 23,
            },
            "light": {
                "state": False,
                "pin": 24
            },
        },
        "yellow": {
            "press": {
                "state": False,
                "pin": 25,
            },
            "light": {
                "state": False,
                "pin": 9
            },
        },
        "red": {
            "press": {
                "state": False,
                "pin": 8,
            },
            "light": {
                "state": False,
                "pin": 11
            },
        },
        "green": {
            "press": {
                "state": False,
                "pin": 6,
            },
            "light": {
                "state": False,
                "pin": 12
            },
        },
    }

    GPIO.setmode(GPIO.BCM)
    for direction in joystick.values():
        GPIO.setup(direction["pin"], GPIO.IN, pull_up_down=GPIO.PUD_UP)

    for color in buttons.values():
        # Get pins
        press_pin = color["press"]["pin"]
        light_pin = color["light"]["pin"]

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

