#define LINE_LENGTH 256
char line_received[LINE_LENGTH+1];
unsigned int current_char = 0;

void setup() {
    // initialize digital pin LED_BUILTIN as an output.
    pinMode(LED_BUILTIN, OUTPUT);
    // initialize serial communication:
    Serial.begin(9600);
    Serial.print("Experiment ready\nCMD>");
}


void process_line() {
    // If line is LED on
    if(strcmp(line_received, "LED ON") == 0) {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.print("LED is now ON\nCMD>");
    }
    else if(strcmp(line_received, "LED OFF") == 0) {
        digitalWrite(LED_BUILTIN, LOW);
        Serial.print("LED is now OFF\nCMD>");
    }
    else {
        Serial.print("Command not understood\nCMD>");
    }
    // Start collecting chars again
    current_char = 0;
}

void handle_line_too_long() {
    Serial.print("Line buffer too long.\nCMD>");
    // Start collecting chars again
    current_char = 0;
}

void process_serial() {
    while(Serial.available() > 0) {
        // Simple echo for now
        char new_char = Serial.read();
        Serial.print(new_char);
        if (new_char == '\n') {
            Serial.print("\n");
            line_received[current_char] = 0;
            process_line();
        }
        else if (new_char == 10) {
            //skip it
        }
        else if(current_char >= LINE_LENGTH) {
            handle_line_too_long();
        } else {
            line_received[current_char] = new_char;
            current_char += 1;
        }
    }
}


// the loop function runs over and over again forever
void loop() {
    process_serial();
}
