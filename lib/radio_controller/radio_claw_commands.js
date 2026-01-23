var radio_claw_commands = function (rover, message) {

	//console.log("rc: ", message);


	if (message.chan7_raw > 1900 && rover.claw.rc_claw != message.chan7_raw) {
		//Manual Claw Control...............................................................
		rover.claw.rc_claw = message.chan7_raw;
		console.log("RC Claw Manual Control Activated");
	}
	else if (message.chan7_raw < 1100 && rover.claw.rc_claw != message.chan7_raw) {
		//Auto Claw Control
		rover.claw.rc_claw = message.chan7_raw;

		//send arduino command to auto delivery....
		console.log("Send arduino command to auto delivery");
		rover.create_arduino_message(rover, 'deliver_package');


	}
	else if (rover.claw.rc_claw != message.chan7_raw) {
		//RC Claw Off
		rover.claw.rc_claw = message.chan7_raw;
		console.log("RC Claw Off");

	}

	//Manual Claw Control Activated..........................................................
	if(rover.claw.rc_claw > 1900){
		//Hook Control............
		if (message.chan5_raw > 1900 && rover.claw.rc_hook != message.chan5_raw) {
			rover.claw.rc_hook = message.chan5_raw;
			//send arduino command to open hook
			console.log("Send arduino command to open hook");
			rover.create_arduino_message(rover, 'retract_hook');
		}
		else if (message.chan5_raw < 1100 && rover.claw.rc_hook != message.chan5_raw) {
			rover.claw.rc_hook = message.chan5_raw;
			//send arduino command to close hook
			console.log("Send arduino command to close hook");
			rover.create_arduino_message(rover, 'extend_hook');
		}


		//Actuator Control............
		if (message.chan8_raw > 1900 && rover.claw.rc_actuator != message.chan8_raw) {
			rover.claw.rc_actuator = message.chan8_raw;
			//send arduino command to open hook
			console.log("Send arduino command to retract arm");
			rover.create_arduino_message(rover, 'retract_arm');
		}
		else if (message.chan8_raw < 1100 && rover.claw.rc_actuator != message.chan8_raw) {
			rover.claw.rc_actuator = message.chan8_raw;
			//send arduino command to close hook
			console.log("Send arduino command to extend arm");
			rover.create_arduino_message(rover, 'extend_arm');
		}


		//Belt Control............
		if (message.chan12_raw > 1900 && rover.claw.rc_belt != message.chan12_raw) {
			rover.claw.rc_belt = message.chan12_raw;
			//send arduino command to open hook
			console.log("Send arduino command to extend belt");
			rover.create_arduino_message(rover, 'extend_belt');
		}
		else if (message.chan12_raw < 1100 && rover.claw.rc_belt != message.chan12_raw) {
			rover.claw.rc_belt = message.chan12_raw;
			//send arduino command to close hook
			console.log("Send arduino command to retract belt");
			rover.create_arduino_message(rover, 'retract_belt');
		}
	}

};


module.exports = radio_claw_commands;