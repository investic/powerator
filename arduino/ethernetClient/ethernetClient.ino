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
IPAddress server(192,168,1,37); 
char* ID = "0001";
int periodTime = 1; //minutos
String sendValue;

EthernetClient client;

String amperios;


//CT
 //For analog read
   double value;

   //Constants to convert ADC divisions into mains current values.
   double ADCvoltsperdiv = 0.0048;
   double VDoffset = 2.4476; //Initial value (corrected as program runs)

   //Equation of the line calibration values
   double factorA = 9.4; //factorA = CT reduction factor / rsens
   double Ioffset = 0;
     
   //Constants set voltage waveform amplitude.
   double SetV = 230.0;

   //Counter
   int i=0;

   int samplenumber = 4000;
 
   //Used for calculating real, apparent power, Irms and Vrms.
   double sumI=0.0;
 
   int sum1i=0;
   double sumVadc=0.0;

   double Vadc,Vsens,Isens,Imains,sqI,Irms;
   double apparentPower;
   
   
   

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
 
}
 

void loop()
{ 
  
   value = analogRead(0);
   //Summing counter
   i++;
   //Voltage at ADC
   Vadc = value * ADCvoltsperdiv;
  
   //Remove voltage divider offset
   Vsens = Vadc-VDoffset;
  
   //Current transformer scale to find Imains
   Imains = Vsens;
                
   //Calculates Voltage divider offset.
   sum1i++; sumVadc = sumVadc + Vadc;
   if (sum1i>=1000) {VDoffset = sumVadc/sum1i; sum1i = 0; sumVadc=0.0;}
  
   //Root-mean-square method current
   //1) square current values
   sqI = Imains*Imains;
   //2) sum 
   sumI=sumI+sqI;
  
   if (i>=samplenumber) 
    {  
    i=0;
    //Calculation of the root of the mean of the current squared (rms)
    Irms = factorA*sqrt(sumI/samplenumber)+Ioffset;
    
    apparentPower = Irms * SetV;
    Serial.print(" Watios: ");      
    Serial.print(apparentPower);
    Serial.print(" Voltaje: ");
    Serial.print(SetV);
    Serial.print(" Amperios: ");
    Serial.print(Irms);
    Serial.println();
   
    //Reset values ready for next sample.
    sumI=0.0;
    
    
  //ETHERNET 
  //Conexion ok
  if (client.connect(server, 3000)) 
  {
    
    String a = "GET /arduino/";
    String b = "/";
    String c = " HTTP/1.0";
    //String d = String(Irms);


    amperios = floatToString(Irms, 5);    
    sendValue = a + ID + b + amperios + c;
    client.println(sendValue);
    Serial.println(sendValue);
    client.println();
   
   }
  
  else {
    Serial.println("Error en la conexion.");
  }
  client.stop();  
  }
}



String floatToString(double number, uint8_t digits) 
{ 
  String resultString = "";
  // Handle negative numbers
  if (number < 0.0)
  {
     resultString += "-";
     number = -number;
  }

  // Round correctly so that print(1.999, 2) prints as "2.00"
  double rounding = 0.5;
  for (uint8_t i=0; i<digits; ++i)
    rounding /= 10.0;
  
  number += rounding;

  // Extract the integer part of the number and print it
  unsigned long int_part = (unsigned long)number;
  double remainder = number - (double)int_part;
  resultString += int_part;

  // Print the decimal point, but only if there are digits beyond
  if (digits > 0)
    resultString += "."; 

  // Extract digits from the remainder one at a time
  while (digits-- > 0)
  {
    remainder *= 10.0;
    int toPrint = int(remainder);
    resultString += toPrint;
    remainder -= toPrint; 
  } 
  return resultString;
}
