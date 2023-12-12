public with sharing class ShiftCreatorApex {
    @InvocableMethod(label='Create Shifts for Resource')
    public static void createShifts(List<ShiftInputWrapper> shiftInputs) {
        List<Shifts_DE__c> listOfShift = new List<Shifts_DE__c>();
      for (ShiftInputWrapper input : shiftInputs) {
             Id recordIds = input.recordId;
            DateTime Start_Date_Time = input.Start_Date_Time;
            DateTime End_Date_Time = input.End_Date_Time;
            Boolean sun =input.Sunday;
            Boolean mon =input.Monday;
            Boolean tue =input.Tuesday;
            Boolean wed =input.Wednesday;
            Boolean thu =input.Thursday;
            Boolean fri =input.Friday;
            Boolean sat =input.Saturday;
 // Loop through the dates between Start Date and End Date 
        for (Datetime currentDate = Start_Date_Time; currentDate <= End_Date_Time; currentDate = currentDate.addDays(1))
             {
             if((currentDate.formatGMT('EEE') == 'Sun' && sun) || (currentDate.formatGMT('EEE') == 'Mon' && mon) || (currentDate.formatGMT('EEE') == 'Tue' && tue) || (currentDate.formatGMT('EEE') == 'Wed' && wed) || (currentDate.formatGMT('EEE') == 'Thu' && thu) || (currentDate.formatGMT('EEE') == 'Fri' && fri) || (currentDate.formatGMT('EEE') == 'Sat' && sat))
             {
                 Shifts_DE__c newShift = new Shifts_DE__c();
                newShift.ResourceId__c = recordIds;
                 newShift.StartDate_Time__c = currentDate;
                 newShift.EndDate_Time__c =Datetime.newInstance(currentDate.Date(), End_Date_Time.time());
                 newShift.Status__c = 'Confirmed';
                listOfShift.add(newShift);
                
                }
            }  
            if(!listOfShift.isEmpty()){
                insert listOfShift;
            }    
            
        }
    }
    public class ShiftInputWrapper {
        @InvocableVariable(required=true)
        public Id recordId;

        @InvocableVariable(required=true)
        public DateTime Start_Date_Time;

        @InvocableVariable(required=true)
        public DateTime End_Date_Time;
       

        @InvocableVariable(required=true)
        public Boolean Sunday;

        @InvocableVariable(required=true)
        public Boolean Monday;

        @InvocableVariable(required=true)
        public Boolean Tuesday;

        @InvocableVariable(required=true)
        public Boolean Wednesday;

        @InvocableVariable(required=true)
        public Boolean Thursday;

        @InvocableVariable(required=true)
        public Boolean Friday;

        @InvocableVariable(required=true)
        public Boolean Saturday;
        
        
    }
}



