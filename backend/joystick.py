from RPi import GPIO  # For Pi 5 (install rpi-lgpio first)
import time  # MUST keep this import

joystick_pins = {
    "Up": 17,
    "Down": 4,
    "Left": 22,
    "Right": 27
}

GPIO.setmode(GPIO.BCM)
for pin in joystick_pins.values():
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

last_trigger_time = {dir: 0 for dir in joystick_pins}
debounce_delay = 0.5

try:
    print("Reading joystick...")
    while True:
        current_time = time.time()  # Now works correctly
        for direction, pin in joystick_pins.items():
            if GPIO.input(pin) == GPIO.LOW:
                if current_time - last_trigger_time[direction] > debounce_delay:
                    print(f"{direction} pressed")
                    last_trigger_time[direction] = current_time
        time.sleep(0.01)

except KeyboardInterrupt:
    GPIO.cleanup()

