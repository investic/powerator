//Measuring AC mains energy use the non-invasive current transformer method
//Sketch calculates - Irms and Apparent power. Vrms needs to be set below.
//OpenEnergyMonitor.org project licenced under GNU General Public Licence
//Author: Trystan Lea 

   //For analog read
   double value;

   //Constants to convert ADC divisions into mains current values.
   double ADCvoltsperdiv = 0.0048;
   double VDoffset = 2.4476; //Initial value (corrected as program runs)

   //Equation of the line calibration values
   double factorA = 12.65; //factorA = CT reduction factor / rsens
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
   
void setup()
{
  Serial.begin(115200);
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

      //Calculation of the root of the mean of the voltage squared (rms)
      
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
 
   }
}
