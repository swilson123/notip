var wpi = require('wiring-pi');

// Set up the pin numbering scheme (e.g., use the wpi/wiringPi pin numbering scheme)
wpi.setup({ mode: 'wpi' }); // or 'gpio', 'phys', 'sys'

// Example: Set up physical pin 11 (GPIO 17 in BCM, GPIO 0 in WiringPi) as an OUTPUT
var pin = 0; // WiringPi pin number
wpi.pinMode(pin, wpi.OUTPUT);

// Blink an LED
var value = 0;
setInterval(function() {
    wpi.digitalWrite(pin, value);
    value = 1 - value; // Toggle the value
}, 500);