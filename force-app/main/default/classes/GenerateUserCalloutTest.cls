@isTest
private class GenerateUserCalloutTest {
    @isTest 
    static void testGenerateUserCallout() {
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('generateUser');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json;charset=UTF-8');
        
        Resource_DE__c testResource = new Resource_DE__c(ResourceType__c = 'Driver');
        insert testResource;
        
		GenerateUserCallout.flowUserInputs flowInputs = new GenerateUserCallout.flowUserInputs();
        flowInputs.username = 'dcushey';
        flowInputs.password = 'Testpass1!';
        flowInputs.resourceId = String.valueOf(testResource.Id);
        
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, mock);
        HttpResponse result = GenerateUserCallout.generateUserPostCallout(flowInputs);
        System.debug(result);
        
        Resource_DE__c rec = [SELECT Id, API_User_Id__c FROM Resource_DE__c WHERE Id =:flowInputs.resourceId];
        System.assertEquals('2b288cc2-f756-4120-d779-08db0b8dc14b', String.valueOf(rec.API_User_Id__c).replace('"','').replace('{','').replace('}',''), 'Not returning expected API');
        System.assertEquals('2b288cc2-f756-4120-d779-08db0b8dc14b', result.getBody().replace('"','').replace('{','').replace('}',''), 'Not returning expected API user Id');
        System.assertNotEquals(null,result, 'The callout returned a null response.');
        System.assertEquals(200,result.getStatusCode(), 'The status code is not 200.'); 
        System.assertEquals('application/json;charset=UTF-8', result.getHeader('Content-Type'), 'The content type value is not expected.');       
    	Test.stopTest();
    }   
}