var yaw_rover_for_package_delivery = function (rover) {
    if (!rover.mission.auto_delivery) {

        //yaw rover 180 degrees to face back towards dock for return trip after delivery
        let rover_heading = rover.robot_data.VFR_HUD.heading || 0;

        if (!rover.mission.package_delivery_yaw) {
            rover.mission.package_delivery_yaw = (rover_heading + 180) % 360;
        }

        motor_speed_cmd = Math.abs(rover.robot_data.yaw_to_waypoint);

        const diff = Math.abs(rover_heading - rover.mission.package_delivery_yaw);

        // Shortest circular difference
        const angleDifference = Math.min(diff, 360 - diff);

        if (angleDifference <= 5) {
            //Heading aligned within 5 degrees, send command to arduino to deliver package
            console.log("Heading aligned within 5 degrees");
            console.log("Send arduino command to auto delivery");
            rover.mission.auto_delivery = true;
            rover.mission.package_delivery_yaw = false;
            rover.create_arduino_message(rover, 'deliver_package', 0);
        }
        else {
            //Yaw rover prior to deliver package. This will help ensure rover is facing the correct direction for return trip to dock after delivery
            rover.yaw_rover(rover, rover.robot_data.yaw_to_waypoint, motor_speed_cmd);
        }


    }




}

module.exports = yaw_rover_for_package_delivery;