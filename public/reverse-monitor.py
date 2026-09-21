#!/usr/bin/env python3

from gpiozero import Button

GPIO = 27

reverse = Button(
    GPIO,
    pull_up=False,
    bounce_time=0.2,
)


def output_state():
    print(
        "1" if reverse.is_pressed else "0",
        flush=True,
    )


def reverse_on():
    print("1", flush=True)


def reverse_off():
    print("0", flush=True)


# Send current state immediately.
# This is important if the application starts
# while the car is already in reverse.
output_state()

reverse.when_pressed = reverse_on
reverse.when_released = reverse_off


# Keep process alive.
try:
    while True:
        reverse.wait_for_press()
        reverse.wait_for_release()

except KeyboardInterrupt:
    pass