public class GenerateUserCallout {
    @InvocableMethod(label='Generate User' description='Generate User from Resource' category='Callout')
    public static void generateUser(List<flowUserInputs> inputs) {
        system.debug('Inputs are ' + inputs);
        generateUserPostCallout(inputs[0]);
    }
    
    public static HttpResponse generateUserPostCallout(flowUserInputs inputs) {
        List<Integration_User_Input_Validation__c> customSetting = [SELECT Id, api_url__c FROM Integration_User_Input_Validation__c LIMIT 1];
        String api_url = '';
        if (!customSetting.isEmpty()) {
            api_url = customSetting[0].api_url__c + '/auth/generateUser';
        }
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(api_url);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setHeader('Origin', URL.getSalesforceBaseUrl().toExternalForm());
        
        String username = inputs.username;
        String password = inputs.password;
        String resourceId = inputs.resourceId;
        // TODO: fix this hardcoding
        String integrationUserId = '9f26b076-3d16-4218-73b0-08db0b8d3685';
        String bodyStr = '{"UserName":"' + username + '", "Password":"' + password + '", "IntegrationUserId":"' + integrationUserId + '", "ExternalResourceId":"' + resourceId + '"}';
        request.setBody(bodyStr);
        
        HttpResponse response = http.send(request);

        if(response.getStatusCode() != 200) {
            System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getStatus() + 'Body: ' + response.getBody());
        } else {
            String api_user_id = response.getBody().replace('"','').replace('{','').replace('}','');
            List<Resource_DE__c> rec = [SELECT Id, API_User_Id__c FROM Resource_DE__c WHERE Id =:resourceId];
            for (Resource_DE__c resource : rec) {
                resource.API_User_Id__c = api_user_id;
            }
            update rec;
        }
        return response;
    }        
    
    public class flowUserInputs {
        @InvocableVariable
        public String username;
        
        @InvocableVariable
        public String password;
        
        @InvocableVariable
        public String resourceId;
    }
}