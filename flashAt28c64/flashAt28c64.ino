
#define SHIFT_DATA 2
#define SHIFT_CLK 3
#define SHIFT_LATCH 4
#define EEPROM_D0 5
#define EEPROM_D7 12
#define WRITE_EN 13

/*
 * Output the address bits and outputEnable signal using shift registers.
 */
void setAddress(int address, bool outputEnable) {
  shiftOut(SHIFT_DATA, SHIFT_CLK, MSBFIRST, (address >> 8) | (outputEnable ? 0x00 : 0x80));
  shiftOut(SHIFT_DATA, SHIFT_CLK, MSBFIRST, address);

  digitalWrite(SHIFT_LATCH, LOW);
  //delayMicroseconds(10);
  digitalWrite(SHIFT_LATCH, HIGH);
  //delayMicroseconds(10);
  digitalWrite(SHIFT_LATCH, LOW);
  //delayMicroseconds(10);
}


byte readEEPROM(uint16_t address) {
  for (int pin = EEPROM_D0; pin <= EEPROM_D7; pin += 1) {
    pinMode(pin, INPUT);
  }
  setAddress(address, /*outputEnable*/ true);

  byte data = 0;
  for (int pin = EEPROM_D7; pin >= EEPROM_D0; pin -= 1) {
    data = (data << 1) + digitalRead(pin);
  }
  return data;
}


void writeEEPROM(uint16_t address, byte data) {
  setAddress(address, /*outputEnable*/ false);
  for (int pin = EEPROM_D0; pin <= EEPROM_D7; pin += 1) {
    pinMode(pin, OUTPUT);
  }

  for (int pin = EEPROM_D0; pin <= EEPROM_D7; pin += 1) {
    digitalWrite(pin, data & 1);
    data = data >> 1;
  }
  //delayMicroseconds(10);
  digitalWrite(WRITE_EN, LOW);
  delayMicroseconds(1);
  digitalWrite(WRITE_EN, HIGH);
  delay(10);
}

void setup() {
  // put your setup code here, to run once:
  pinMode(SHIFT_DATA, OUTPUT);
  pinMode(SHIFT_CLK, OUTPUT);
  pinMode(SHIFT_LATCH, OUTPUT);
  digitalWrite(WRITE_EN, HIGH);
  pinMode(WRITE_EN, OUTPUT);
  Serial.begin(500000);
  Serial.println("BOOT");
}

char readAddr[5];
char readData[3];

void loop() {



  while (Serial.available() > 0)
  {
    String input = Serial.readStringUntil('\n');
    String command = input.substring(0, 2);

    input.substring(2, 6).toCharArray(readAddr, 5);

    uint16_t addr = (uint16_t)strtol(readAddr, NULL, 16);
    
    if (command.equals("RD"))
    {
      Serial.println(readEEPROM(addr), HEX);
    }
    else if (command.equals("WR")){
      input.substring(6, 8).toCharArray(readData, 3);
      byte data = (byte)strtol(readData, NULL, 16);
      writeEEPROM(addr, data);
      Serial.println("DONE");
    }
    else
    {
      Serial.println("Bad input: " + input);
    }
  }
}
