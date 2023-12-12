public with sharing class shiftsController {
    @AuraEnabled(cacheable=true)
    public static List<Shifts_DE__c> getShiftsForDriver(Id recordId) {
        return [SELECT Id, Resource_Name__c, StartDate_Time__c, EndDate_Time__c FROM Shifts_DE__c WHERE ResourceId__c = :recordId];
    }
}
