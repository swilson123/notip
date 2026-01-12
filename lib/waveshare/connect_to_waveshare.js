

const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

var connect_to_waveshare = function (rover) {
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



const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

// Configuration
const PORT = "/dev/ttySC0"; // Change to 'COM3' etc. on Windows
const BAUDRATE = 115200;
const SLAVE_ID = 1;

// ZLAC8015D Register Map (Hex)
const REG_CONTROL_WORD = 0x200E; // Control: 0x08=Enable, 0x10=Start
const REG_OP_MODE      = 0x200D; // Mode: 3 = Velocity Mode
const REG_L_TARGET_RPM = 0x2088; // Left Motor Target RPM
const REG_R_TARGET_RPM = 0x2089; // Right Motor Target RPM
const REG_L_FEEDBACK   = 0x20AB; // Left Motor Actual RPM (Read)
const REG_R_FEEDBACK   = 0x20AC; // Right Motor Actual RPM (Read)

async function runMotorTest() {
    try {
        // 1. Connect to Serial Port
        await client.connectRTUBuffered(PORT, { baudRate: BAUDRATE });
        client.setID(SLAVE_ID);
        console.log("Connected to ZLAC8015D");

        // 2. Initialization Sequence
        await client.writeRegister(REG_OP_MODE, 3);      // Set Velocity Mode
        await client.writeRegister(REG_CONTROL_WORD, 0x08); // Enable Driver
        console.log("Driver Enabled in Velocity Mode");

        // 3. Set Target Speed (100 RPM)
        // Note: Some Zltech firmware uses signed integers (dec 100 = 0x0064)
        await client.writeRegister(REG_L_TARGET_RPM, 100);
        await client.writeRegister(REG_R_TARGET_RPM, 100);
        console.log("Target speed set to 100 RPM");

        // 4. Feedback Loop (Read every 500ms)
        const feedbackInterval = setInterval(async () => {
            try {
                // Read 2 registers starting from Left Feedback
                const res = await client.readHoldingRegisters(REG_L_FEEDBACK, 2);
                const leftSpeed = res.data[0];
                const rightSpeed = res.data[1];
                
                console.log(`Current Speed -> Left: ${leftSpeed} RPM | Right: ${rightSpeed} RPM`);
            } catch (err) {
                console.error("Error reading feedback:", err.message);
            }
        }, 500);

        // Stop motors after 10 seconds
        setTimeout(async () => {
            clearInterval(feedbackInterval);
            await client.writeRegister(REG_L_TARGET_RPM, 0);
            await client.writeRegister(REG_R_TARGET_RPM, 0);
            console.log("Test Complete: Motors Stopped.");
            client.close();
        }, 10000);

    } catch (e) {
        console.error("Communication Error:", e.message);
    }
}

runMotorTest();

	};


	module.exports = connect_to_waveshare;