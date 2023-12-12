global with sharing class GetResourcesanditsShifts {
    @AuraEnabled
    global static string getResource()
    {
        list<Resource_DE__c> ResourceList = new list<Resource_DE__c>();
        ResourceList = [Select Id, Name,(Select id, Name from Transport_Shifts_DE__r) from Resource_DE__c];
        return JSON.serialize(ResourceList); 
    }
}