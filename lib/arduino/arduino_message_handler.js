
var arduino_message_handler = function (rover, data) {

	console.log('Arduino Message Handler received data: ', data);

	rover.logs.arduino_message_handler.log(rover, 'Received data: ' + data);

	rover.create_arduino_message(rover, 'deliver_package\n');

};

module.exports = arduino_message_handler;
