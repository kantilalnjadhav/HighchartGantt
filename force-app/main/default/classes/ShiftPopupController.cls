public with sharing class ShiftPopupController {
    @AuraEnabled
    public static List<Resource_DE__c> getAvailableResources() {

         List<Resource_DE__c> resources = [SELECT Id, Name__c, Name FROM Resource_DE__c];
        System.debug(+resources);
        return resources;
        
    }
    
    @AuraEnabled
    public static String createShiftRecord(Datetime startDate, Datetime endDate, String resourceId) {
        try {
            // Create a new Shift record
            Shifts_DE__c newShift = new Shifts_DE__c(
                StartDate_Time__c = startDate,
                EndDate_Time__c	= endDate,
                ResourceId__c = resourceId
                // Add other fields as needed
            );

            // Insert the new Shift record
            insert newShift;

            return 'Shift record created successfully with Id: ' + newShift.Id;
        } catch (Exception e) {
            return 'Error creating Shift record: ' + e.getMessage();
        }
    }
}
