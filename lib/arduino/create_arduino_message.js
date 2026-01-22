var create_arduino_message = function (rover, message) {

//Available commands to send to arduino
//Commands: deliver_package, extend_belt, retract_belt, extend_arm, retract_arm, extend_hook, retract_hook

	if (rover.arduino.serial) {
		try {
			console.log('Sending to arduino: ', message);
			rover.logs.arduino_message_handler.log(rover, 'Sending to arduino: ' + message);
			rover.arduino.serial.write(message+'\n');
		} catch (e) {
			console.log(e);
			rover.logs.arduino_message_handler.error('Error writing to arduino port: ', e);
		}

	} else {
		console.log('arduino Port not connected!');
	}
};

module.exports = create_arduino_message;
