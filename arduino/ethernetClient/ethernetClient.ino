/*
  Web client
 
 This sketch connects to a website (http://www.google.com)
 using an Arduino Wiznet Ethernet shield. 
 
 Circuit:
 * Ethernet shield attached to pins 10, 11, 12, 13
 
 created 18 Dec 2009
 by David A. Mellis
 
 */

#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = {  0x90, 0xA2, 0xDA, 0x00, 0x55, 0x64 };
IPAddress server(192,168,1,37); // Google
String ID = "0001";
int periodTime = 1; //minutos
String sendValue;

EthernetClient client;

void setup() {
  // start the serial library:
  Serial.begin(115200);
  // start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    for(;;)
      ;
  }
  // give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:
  if (client.connect(server, 3000)) {
    Serial.println("connected");
    // Make a HTTP request:
    // sprintf(sendValue,"GET /arduino/%a/%b HTTP/1.0",ID,amperios);
    //client.println(sendValue);
  } 
  else {
    // kf you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}

void loop()
{    
  String amperios = "0.08";
  
    sprintf(sendValue,"GET /arduino/%c/%c HTTP/1.0",ID,amperios);
    client.println(sendValue);
    Serial.print(sendValue);

}

