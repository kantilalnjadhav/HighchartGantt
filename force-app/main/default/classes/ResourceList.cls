public with sharing class ResourceList {
    
    @AuraEnabled(cacheable=true)
    public static List<Resource_DE__c> fetchAllResource() {
        List<Resource_DE__c> ResourceList = new List<Resource_DE__c>();
        ResourceList = [SELECT Id, Name, Name__c, ResourceType__c FROM Resource_DE__c ];
        return ResourceList;
        
    }

    }
