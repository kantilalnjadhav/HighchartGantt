@isTest
private class GetResourceDataControllerTest {
    @isTest static void testGetResourceData() {
        // Create test data
        Resource_DE__c resource = new Resource_DE__c(
               
                Name__c = 'Test Name Custom Field',
                ResourceType__c = 'Driver',
                CurrentlyWorking__c = 'Yes',
                Location_Latitude__c = '1.234567',
                Location_Longitude__c = '2.345678',
                CurrentlyAvailable__c = 'No',
                Active_Employee__c = true
        );
        insert resource;
        
        // Call the Apex method
        Test.startTest();
        List<Resource_DE__c> result = GetResourceDataController.GetResourceData();
        Test.stopTest();
       
        // Verify the result
        System.assertEquals(1, result.size());
        System.assertEquals('Test Name Custom Field', result[0].Name__c);
        System.assertEquals('Driver', result[0].ResourceType__c);
        System.assertEquals('Yes', result[0].CurrentlyWorking__c);
        System.assertEquals('1.234567', result[0].Location_Latitude__c);
        System.assertEquals('2.345678', result[0].Location_Longitude__c);
        System.assertEquals('No', result[0].CurrentlyAvailable__c);
        System.assertEquals(true, result[0].Active_Employee__c);
    }
}