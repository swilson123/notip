var move_rover = function (rover, motor_id, motor_speed_cmd) {
	if (rover.motor.motor_type === "ZLAC8015D") {
		if (rover.zling.comName1_connected && rover.zling.comName2_connected) {

		}
		else{
			console.log('Motor drivers not connected');
		}

	}
	else {
		if (rover.waveshare.connected) {
			var message = { "T": 10010, "id": motor_id, "cmd": motor_speed_cmd, "act": 3 };

			rover.create_waveshare_message(rover, message);
		} else {
			console.log('Waveshare not connected');
		}
	}
};


module.exports = move_rover;