var create_waveshare_message = function (rover, message) {
	if (rover.waveshare.connected) {
		if (message) {
			console.log('Sending waveshare Message: ', message);

			if (rover.motor.motor_type === "ZLAC8015D") {

				if (message.id == 1) {
					rover.motor.motor1_client.writeRegister(rover.zling.REG_L_TARGET_RPM, message.cmd);
				}
				else if (message.id == 2) {
					rover.motor.motor2_client.writeRegister(rover.zling.REG_R_TARGET_RPM, message.cmd);
				}
				else if (message.id == 3) {
					rover.motor.motor1_client.writeRegister(rover.zling.REG_R_TARGET_RPM, message.cmd);
				}
				else if (message.id == 4) {
					rover.motor.motor2_client.writeRegister(rover.zling.REG_L_TARGET_RPM, message.cmd);
				}
				else {
					console.log('Unsupported motor id: ', message.id);
				}
			} else if (rover.motor.motor_type === "DDSM115") {
				var jsonLine = JSON.stringify(message) + '\n';
				rover.waveshare.serial.write(jsonLine);
			} else {
				console.log("Unsupported motor type: ", rover.motor.motor_type);
			}




		} else {
			console.log('Missing waveshare message');
		}
	} else {
		console.log('Waveshare not connected!');
	}
};

module.exports = create_waveshare_message;
