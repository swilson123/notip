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
		rover.create_arduino_message(rover, 'deliver_package', 0);


	}
	else if (rover.claw.rc_claw != message.chan7_raw) {
		//RC Claw Off
		rover.claw.rc_claw = message.chan7_raw;
		console.log("RC Claw Off");

	}

	//Manual Claw Control Activated..........................................................
	if(rover.claw.rc_claw > 1900){

		//Hook Control............
		if (rover.claw.rc_hook != message.chan5_raw) {
			rover.claw.rc_hook = message.chan5_raw;
			//send arduino command to open hook
			console.log("Send arduino hook command");
			rover.create_arduino_message(rover, 'hook', rover.claw.rc_hook);
		}
		

		//Actuator Control............
		if (rover.claw.rc_actuator != message.chan8_raw) {
			rover.claw.rc_actuator = message.chan8_raw;
			//send arduino command to open hook
			console.log("Send arduino arm command");
			rover.create_arduino_message(rover, 'arm', rover.claw.rc_actuator);
		}
		


		//Belt Control............
		if (rover.claw.rc_belt != message.chan12_raw) {
			rover.claw.rc_belt = message.chan12_raw;
			//send arduino command to open hook
			console.log("Send arduino belt command");
			rover.create_arduino_message(rover, 'belt', rover.claw.rc_belt);
		}
		
	}

};


module.exports = radio_claw_commands;