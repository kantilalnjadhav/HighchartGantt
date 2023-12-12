public with sharing class FullCalendarService {
    @AuraEnabled(cacheable=true)
    public static List<Shifts_DE__c> fetchAllShifts() {
        List<Shifts_DE__c> shiftList = new List<Shifts_DE__c>();
        shiftList = [SELECT Id, Name, Resource_Name__c, StartDate_Time__c, EndDate_Time__c FROM Shifts_DE__c ];
        return shiftList;

    }
    @AuraEnabled(cacheable=true)
    public static List<Resource_DE__c> fetchAllResource(){
        List<Resource_DE__c> resourceList = new List<Resource_DE__c>();
        resourceList = [SELECT Id, Name, Name__c, ResourceType__c FROM Resource_DE__c ];
        return resourceList;
    }
    
}