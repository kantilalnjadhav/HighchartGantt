public with sharing class GetResourceDataController {
   
     @AuraEnabled(cacheable=true)
    public static List<Resource_DE__c> GetResourceData() {
        List<Resource_DE__c> resourceList = new List<Resource_DE__c>();
      
             resourceList = [SELECT Id, Name, Name__c,ResourceType__c, Current_Vehicle_Assigned__c,Active_Employee__c,Location_Latitude__c, Location_Longitude__c,CurrentlyAvailable__c,CurrentlyWorking__c  FROM Resource_DE__c WHERE CurrentlyWorking__c = 'Yes' AND Location_Latitude__c != Null AND Location_Longitude__c != NULL ORDER BY Name__c ASC  ];
             return resourceList;
    }   

     @AuraEnabled(cacheable=true)
    public static List<Resource_DE__c> GetAvailableResourceData() {
        List<Resource_DE__c> availableResourceList = new List<Resource_DE__c>();
      
             availableResourceList = [SELECT Id, Name, Name__c,ResourceType__c, Current_Vehicle_Assigned__c,Active_Employee__c,Location_Latitude__c, Location_Longitude__c,CurrentlyAvailable__c,CurrentlyWorking__c  FROM Resource_DE__c WHERE CurrentlyWorking__c = 'Yes' AND CurrentlyAvailable__c = 'Yes' ORDER BY Name__c ASC  ];
             return availableResourceList;
    }   
}