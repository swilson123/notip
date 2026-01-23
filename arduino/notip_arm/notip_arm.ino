#include <Servo.h>
#include <ArduinoJson.h>



//Servos.................................................................................
Servo arm;
Servo hook;
Servo belt;

int arm_pin = 1;
int hook_pin = 2;
int belt_pin = 3;

//States...................................................................................
bool auto_delivery = false;
String arm_state = "stopped";
String hook_state = "stopped";
String belt_state = "stopped";


//Servo Timeouts..................................................................................
int arm_extend_timeout = 5000;
int arm_retract_timeout = 5000;

int hook_extend_timeout = 5000;
int hook_retract_timeout = 5000;

int belt_extend_timeout = 5000;
int belt_retract_timeout = 5000;

//Extend and Retract values.................................................................
int arm_extend_value = 30;
int arm_retract_value = 0;

int hook_extend_value = 30;
int hook_retract_value = 0;

int belt_extend_value = 30;
int belt_retract_value = 0;


//Timestamps...............................................................................
long arm_time_stamp = 0;
long hook_time_stamp = 0;
long belt_time_stamp = 0;
long current_time_stamp = 0;
long old_time_stamp = 0;

//Serial string................................................................................
String inputString = "";            // a string to hold incoming data from companion computer


//Setup......................................................................................
void setup() {
  Serial.begin(115200);      //Set Baud Rate
  arm.attach(arm_pin);
  hook.attach(hook_pin);
  belt.attach(belt_pin);
}



//Loop......................................................................................
void loop() {
  //Heartbeat......................
  heartbeat();

}


//Serial..................................................................................
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();

    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it.
    // otherwise, add it to the inputString:
    if (inChar == '\n') {
      message_received(inputString);
      inputString = "";

    } else {
      inputString += inChar;
    }
  }
}

//Message received from Companion Computer........................................................
void message_received(String json) {



  // Parse JSON
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, json);

  
    
    String message = doc["message"];

    int value = doc["value"];

    if (message == "deliver_package") {
      deliver_package(value);
    }
    else if (message == "belt") {
      belt.write(value);
    }
    else if (message == "arm") {
      arm.write(value);
    }
    else if (message == "hook") {
      hook.write(value);
    }

  


}



//Start Package Delivery...........................................................................
void deliver_package(int value) {

  if (!auto_delivery) {
    //Set auto delivery to true.......
    auto_delivery = true;

    //Start auto delivery by extending belt..........
    extend_belt();
  }

}

//Send Current delivery states to companion computer................................................
void send_current_state() {
  Serial.print("{'belt_state':'");
  Serial.print(belt_state);
  Serial.print("','arm_state':'");
  Serial.print(arm_state);
  Serial.print("','hook_state':'");
  Serial.print(hook_state);
  Serial.print("','auto_delivery':'");
  Serial.print(auto_delivery);
  Serial.println("'}");
}


//Heartbeat ........................................................................................
void heartbeat() {
  current_time_stamp = millis();

  //Serial....................
  if (current_time_stamp  > old_time_stamp + 1000) {
    send_current_state();
    old_time_stamp = current_time_stamp;
  }

  //Arm Up.......................
  if (arm_state == "extend" && arm_time_stamp != 0 && current_time_stamp > arm_time_stamp + arm_extend_timeout)
  {
    open_arm();
  }

  //Arm Down.......................
  if (arm_state == "retract" && arm_time_stamp != 0 && current_time_stamp > arm_time_stamp + arm_retract_timeout)
  {
    close_arm();
  }


  //Hook Closed.......................
  if (hook_state == "extend" && hook_time_stamp != 0 && current_time_stamp > hook_time_stamp + hook_extend_timeout)
  {
    close_hook();

  }


  //Hook Opened.......................
  if (hook_state == "retract" && hook_time_stamp != 0 && current_time_stamp > hook_time_stamp + hook_retract_timeout)
  {
    open_hook();
  }

  //Belt Extended.......................
  if (belt_state == "extend" && belt_time_stamp != 0 && current_time_stamp > belt_time_stamp + belt_extend_timeout)
  {
    open_belt();
  }


  //Belt Retracted.......................
  if (belt_state == "retract" && belt_time_stamp != 0 && current_time_stamp > belt_time_stamp + belt_retract_timeout)
  {
    close_belt();
  }

}



//Arm Actuator...............................................................................

void extend_arm() {
  arm.write(arm_extend_value);
  arm_state = "extend";
  arm_time_stamp = millis();
}


void retract_arm() {
  arm.write(arm_retract_value);
  arm_state = "retract";
  arm_time_stamp = millis();
}

void open_arm() {
  arm_state = "open";

}

void close_arm() {
  arm_state = "close";

  if (auto_delivery) {
    //Arm Lowered next open the hook........
    retract_hook();
  }

}


//Hook Actuator................................................................................

void extend_hook() {
  hook.write(hook_extend_value);
  hook_state = "extend";
  hook_time_stamp = millis();
}


void retract_hook() {
  hook.write(hook_retract_value);
  hook_state = "retract";
  hook_time_stamp = millis();
}

void open_hook() {
  hook_state = "open";

  if (auto_delivery) {
    //Hook opened next close the hook........
    extend_hook();
  }
}

void close_hook() {
  hook_state = "close";

  if (auto_delivery) {
    //Hook closed, currently going to skip raising arm, and retract belt.........
    retract_belt();
  }
}


//Belt Actuator..................................................................................
void extend_belt() {
  belt.write(belt_extend_value);
  belt_state = "extend";
  belt_time_stamp = millis();
}


void retract_belt() {
  belt.write(belt_retract_value);
  belt_state = "retract";
  belt_time_stamp = millis();
}

void open_belt() {
  belt_state = "open";

  if (auto_delivery) {
    //Belt extended next lower the arm........
    retract_arm();
  }
}

void close_belt() {
  belt_state = "close";

  if (auto_delivery) {
    //Auto delivery finished.........
    auto_delivery = false;
  }
}
