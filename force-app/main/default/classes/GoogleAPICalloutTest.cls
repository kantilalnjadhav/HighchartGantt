@isTest
private class GoogleAPICalloutTest {
@isTest 
    static void testGetEstimatedTimeCallout() {
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('getEstimatedTime');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json;charset=UTF-8');
        
		GoogleAPICallout.flowUserInputs flowInputs = new GoogleAPICallout.flowUserInputs();
        flowInputs.pickupStreet = '790 Magnolia Ave';
        flowInputs.pickupCity = 'Newmarket';
        flowInputs.pickupPostal = 'L3Y 3C7';
        flowInputs.pickupState = 'ON';
        flowInputs.pickupCountry = 'Canada';
        
        flowInputs.dropoffStreet = '308 Patterson St';
        flowInputs.dropoffCity = 'Newmarket';
        flowInputs.dropoffPostal = 'L3Y 3M2';
        flowInputs.dropoffState = 'ON';
        flowInputs.dropoffCountry = 'Canada';
		flowInputs.bufferDuration = '20 mins';
        
        List<GoogleAPICallout.flowUserInputs> flowInputsList = new List<GoogleAPICallout.flowUserInputs>();
        flowInputsList.add(flowInputs);
        
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, mock);
        List<GoogleAPICallout.flowUserOutputs> result = GoogleAPICallout.getEstimatedTime(flowInputsList);
        System.debug(result);
        
        System.assertEquals('1 min', result[0].pickupDuration);
        System.assertEquals('1 min', result[0].dropoffDuration);
        System.assertEquals('22 mins', result[0].totalDuration);      
    	Test.stopTest();
        
    }   
}