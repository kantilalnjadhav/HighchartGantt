public with sharing class BreakCreatorApex {
    @InvocableMethod(label='Create Breaks for Resources')
    public static void createBreaks(List<BreakInputWrapper> BreakInputs) {
        List<Break_DE__c> listOfBreaks = new List<Break_DE__c>();
        for(BreakInputWrapper input : BreakInputs ){
            Id recordIds = input.recordId;
            DateTime Start_Date_Time = input.Start_Date_Time;
            DateTime End_Date_Time = input.End_Date_Time;
            String Reason = input.Break_Reason;
            Boolean sun =input.Sunday;
            Boolean mon =input.Monday;
            Boolean tue =input.Tuesday;
            Boolean wed =input.Wednesday;
            Boolean thu =input.Thursday;
            Boolean fri =input.Friday;
            Boolean sat =input.Saturday;

            for(DateTime currentDate = Start_Date_Time; currentDate <= End_Date_Time; currentDate = currentDate.addDays(1)){

                if((currentDate.formatGMT('EEE') == 'Sun' && sun) || (currentDate.formatGMT('EEE') == 'Mon' && mon) || (currentDate.formatGMT('EEE') == 'Tue' && tue) || (currentDate.formatGMT('EEE') == 'Wed' && wed) || (currentDate.formatGMT('EEE') == 'Thu' && thu) || (currentDate.formatGMT('EEE') == 'Fri' && fri) || (currentDate.formatGMT('EEE') == 'Sat' && sat))

                {
                    Break_DE__c newBreak = new Break_DE__c();
                    newBreak.Resource__c = recordIds;
                    newBreak.Start_Date_Time__c = currentDate;
                    newBreak.End_Date_Time__c = DateTime.newInstance(currentDate.Date(), End_Date_Time.time());
                    newBreak.Break_Reason__c = Reason;
                    
                    listOfBreaks.add(newBreak);

                }

            }
            if(!listOfBreaks.isEmpty()){
                insert listOfBreaks;
            }

        }

    }
    public class BreakInputWrapper{
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

        @InvocableVariable(label='reason')
        public String Break_Reason;


    }
}