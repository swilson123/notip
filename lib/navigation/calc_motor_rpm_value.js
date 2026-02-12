var calc_motor_rpm_value = function (rpm, motor_id) {
    if (rpm == 0) {
        return rpm;
    }
    else if (rpm < 0) {
        if (motor_id == 4 || motor_id == 2) {
            return rpm * -1
        } else {
            return 65535 + rpm;
        }
    }
    else {
        if (motor_id == 4 || motor_id == 2) {
            return 65535 - rpm;
        } else {
            return rpm;
        }

    }

}

module.exports = calc_motor_rpm_value;