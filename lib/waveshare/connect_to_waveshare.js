


var connect_to_waveshare = function (rover) {

	if (rover.motor.motor_type === "ZLAC8015D") {


		//Motor Driver 1.....................................................
		rover.motor.motor1_client = new rover.ModbusRTU();

		async function connect_to_motor_driver1() {
			try {
				// 1. Connect to Serial Port
				await rover.motor.motor1_client.connectRTUBuffered(rover.zling.comName1, { baudRate: rover.zling.baudrate });
				rover.motor.motor1_client.setID(rover.zling.slave1_Id);

				console.log("Connected to ZLAC8015D");

				// 2. Initialization Sequence
				await rover.motor.motor1_client.writeRegister(rover.zling.REG_OP_MODE, 3);      // Set Velocity Mode
				await rover.motor.motor1_client.writeRegister(rover.zling.REG_CONTROL_WORD, 0x08); // Enable Driver
				console.log("Driver Enabled in Velocity Mode");

				if (rover.motor.motor1_client._port._id) {
					rover.zling.comName1_connected = true;
				}





			} catch (e) {
				console.error("Communication Error:", e.message);
			}
		}

		connect_to_motor_driver1();

		//Motor Driver 2.....................................................
		rover.motor.motor2_client = new rover.ModbusRTU();

		async function connect_to_motor_driver2() {
			try {
				// 1. Connect to Serial Port
				await rover.motor.motor2_client.connectRTUBuffered(rover.zling.comName2, { baudRate: rover.zling.baudrate });
				rover.motor.motor2_client.setID(rover.zling.slave2_Id);
				console.log("Initializing Motor 2 Client", rover.motor.motor2_client);
				console.log("Connected to ZLAC8015D");

				// 2. Initialization Sequence
				await rover.motor.motor2_client.writeRegister(rover.zling.REG_OP_MODE, 3);      // Set Velocity Mode
				await rover.motor.motor2_client.writeRegister(rover.zling.REG_CONTROL_WORD, 0x08); // Enable Driver
				console.log("Driver Enabled in Velocity Mode");

				if (rover.motor.motor2_client._port._id) {
					rover.zling.comName2_connected = true;
				}

			} catch (e) {
				console.error("Communication Error:", e.message);
			}
		}

		connect_to_motor_driver2();


		var rpm = 100;
		// Helper function to convert RPM to two's complement for reverse
		const getReverseRPM = (rpm) => {
			const absRpm = Math.abs(rpm);
			return 65536 - absRpm;
		};


		// // 3. Set Target Speed (100 RPM)
		// // Note: Some Zltech firmware uses signed integers (dec 100 = 0x0064)

		// if (rpm < 0) {
		// 	await rover.motor.motor1_client.writeRegister(rover.zling.REG_L_TARGET_RPM, getReverseRPM(rpm));
		// 	await rover.motor.motor1_client.writeRegister(rover.zling.REG_R_TARGET_RPM, rpm * -1);
		// } else {
		// 	await rover.motor.motor1_client.writeRegister(rover.zling.REG_L_TARGET_RPM, rpm);
		// 	await rover.motor.motor1_client.writeRegister(rover.zling.REG_R_TARGET_RPM, getReverseRPM(rpm));
		// }

		// console.log("Target speed set to " + rpm + " RPM");

		// // 4. Feedback Loop (Read every 500ms)
		// const feedbackInterval = setInterval(async () => {
		// 	try {
		// 		// Read 2 registers starting from Left Feedback
		// 		const res = await rover.motor.motor1_client.readHoldingRegisters(rover.zling.REG_L_FEEDBACK, 2);
		// 		const leftSpeed = res.data[0];
		// 		const rightSpeed = res.data[1];

		// 		console.log(`Current Speed -> Left: ${leftSpeed} RPM | Right: ${rightSpeed} RPM`);
		// 	} catch (err) {
		// 		console.error("Error reading feedback:", err.message);
		// 	}
		// }, 500);

		// // Stop motors after 10 seconds
		// setTimeout(async () => {
		// 	clearInterval(feedbackInterval);
		// 	await rover.motor.motor1_client.writeRegister(rover.zling.REG_L_TARGET_RPM, 0);
		// 	await rover.motor.motor1_client.writeRegister(rover.zling.REG_R_TARGET_RPM, 0);
		// 	console.log("Test Complete: Motors Stopped.");
		// 	rover.motor.motor1_client.close();
		// }, 10000);
	}
	else if (rover.motor.motor_type === "DDSM115") {
		// if (rover.waveshare.port_path) {
		// 	rover.waveshare.serial = new rover.SerialPort({
		// 		path: rover.waveshare.port_path,
		// 		baudRate: rover.waveshare.baudrate,
		// 		dataBits: 8,
		// 		stopBits: 1,
		// 		parity: 'none',
		// 		// autoOpen: false,
		// 	});

		// 	//When port is open
		// 	rover.waveshare.serial.on('open', function () {

		// 		console.log("Waveshare Port is open");
		// 		rover.waveshare.connected = true;


		// 		//rover.waveshare.serial.write('EN1\r\n');



		// 		// Raw data listener to parse 10-byte DDSM frames and emit 'feedback'
		// 		rover.waveshare.serial.on('data', function (data) {
		// 			console.log(data);
		// 		});


		// 		rover.waveshare.parser = rover.waveshare.serial.pipe(new rover.Readline(
		// 			{
		// 				delimiter: '\r\n'
		// 			}));


		// 		rover.waveshare.parser.on('data', function (input) {

		// 			console.log('Waveshare Data:', input);


		// 		});

		// 		rover.waveshare.parser.on('error', function (e) {
		// 			console.log('rover.waveshare.parser: ', e);

		// 		});


		// 	});


		// 	rover.waveshare.serial.on('close', function (e) {
		// 		rover.waveshare.connected = false;
		// 		console.log("Waveshare Port closed: ", e);



		// 	});

		// 	rover.waveshare.serial.on('error', function (e) {

		// 		if (e) {
		// 			console.log("Waveshare Port error: ", e);

		// 		}
		// 	});

		// }
		// else {
		// 	console.log('Missing waveshare port');

		// }
	}
	else {
		console.log("Unsupported motor type: ", rover.motor.motor_type);
	}




};


module.exports = connect_to_waveshare;