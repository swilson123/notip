var calc_motor_rpm_value = function (rpm) {
    if (rpm < 0) {
        return 65536 + rpm;
    }
    else {
        return rpm;
    }

}

module.exports = calc_motor_rpm_value;