public class GoogleAPICallout {

    @InvocableMethod(label='Get Estimated Time' description='Calls google apis to get the estimated time between two locations' category='Callout')
    public static List<flowUserOutputs> getEstimatedTime(List<flowUserInputs> inputs) {
        String pickupAddress = inputs[0].pickupStreet.replace(' ','+') + '+' + inputs[0].pickupCity.replace(' ','+') + '+' + 
            inputs[0].pickupPostal.replace(' ','+') + '+' + inputs[0].pickupState.replace(' ','+') + '+' + inputs[0].pickupCountry.replace(' ','+');
        String dropoffAddress = inputs[0].dropoffStreet.replace(' ','+') + '+' + inputs[0].dropoffCity.replace(' ','+') + '+' + 
            inputs[0].dropoffPostal.replace(' ','+') + '+' + inputs[0].dropoffState.replace(' ','+') + '+' + inputs[0].dropoffCountry.replace(' ','+');
        
        List<flowUserOutputs> outputs = new List<flowUserOutputs>();
        outputs.add(setEstimatedTime(pickupAddress, dropoffAddress,inputs[0].bufferDuration));
		return outputs;
	}

    public static flowUserOutputs setEstimatedTime(String pickupAddress, String dropOffAddress, String bufferDuration) {
        flowUserOutputs output = new flowUserOutputs();
        
        Google_API_Settings__mdt GoogleAPISettings = [Select API_Key__c, API_Url__c from Google_API_Settings__mdt WHERE DeveloperName = 'Google_API_record'];
        
        string apiKey = GoogleAPISettings.API_Key__c;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(GoogleAPISettings.API_Url__c + '?origin=' + EncodingUtil.urlEncode(pickupAddress,'UTF-8') +'&destination=' + EncodingUtil.urlEncode(dropoffAddress, 'UTF-8') + '&key=' + apiKey);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setHeader('Content-Length', '0');
        HttpResponse response = http.send(request);

        
        
        if(response.getStatusCode() != 200) {
            return output; 
        } else {
            Map<String, Object> listJson = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            if((String)listJson.get('status') == 'NOT_FOUND') {
                return output;
            }
            List<Object> routes = (List<Object>)listJson.get('routes');
            if(routes.size() > 0) {
                List<Object> legs = (List<Object>)((Map<String, Object>)routes[0]).get('legs');
                if(legs.size() > 0) {
                	Map<String, Object> duration = (Map<String, Object>)((Map<String, Object>)legs[0]).get('duration');
                    String durationValue = (String)duration.get('text');
           			output.pickupDuration = durationValue;
                    system.debug('pickup'+output.pickupDuration);
                }
            }
            
        }
        
        request.setEndpoint(GoogleAPISettings.API_Url__c + '?origin=' + EncodingUtil.urlEncode(dropoffAddress, 'UTF-8') +'&destination=' + EncodingUtil.urlEncode(pickupAddress, 'UTF-8')  + '&key=' + apiKey);
        response = http.send(request);

        if(response.getStatusCode() != 200) {
            return new flowUserOutputs(); 
        } else {
            Map<String, Object> listJson = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            List<Object> routes = (List<Object>)listJson.get('routes');
            if(routes.size() > 0) {
                List<Object> legs = (List<Object>)((Map<String, Object>)routes[0]).get('legs');
                if(legs.size() > 0) {
                    Map<String, Object> duration = (Map<String, Object>)((Map<String, Object>)legs[0]).get('duration');
                    String durationValue = (String)duration.get('text');
                    output.dropoffDuration = durationValue;
                }
            }
        }
        
        Integer totalNumMinutes = getNumMinutes(output.pickupDuration) + getNumMinutes(output.dropOffDuration)  + getNumMinutes(bufferDuration);
                
        
        Integer totalNumHours = totalNumMinutes/60;
        output.totalDuration = '';
        if(totalNumHours > 0) {
            output.totalDuration = totalNumHours + ' hours ';
            
        }
        if(totalNumMinutes > 0) {
            output.totalDuration = output.totalDuration + (totalNumMinutes - (totalNumHours * 60)) + ' mins';
        }
        
        
        
        output.totalDuration =  output.totalDuration.trim();
       
        return output;
    }    

    public static Integer getNumMinutes(String timeString) {
        Integer numMins = 0;
        Integer numHours = 0;
        if(timeString.contains('hour')) {
            numHours = Integer.valueOf(timeString.split(' ')[0]);
            timeString = timeString.replace(numHours + ' hours', '').replace(numHours + ' hour', '').trim();
        }
        if(timeString.contains('min')) {
            numMins = Integer.valueOf(timeString.split(' ')[0]);
        }
        
        return numMins + (numHours * 60);
        

    }    

    public class flowUserOutputs {
        @InvocableVariable
        public String pickupDuration;
        
        @InvocableVariable
        public String dropoffDuration;
        
        @InvocableVariable
        public String totalDuration;
    }
    
    public class flowUserInputs {
        @InvocableVariable
        public String pickupStreet;
        
        @InvocableVariable
        public String pickupCity;
        
        @InvocableVariable
        public String pickupPostal;
        
        @InvocableVariable
        public String pickupState;
        
        @InvocableVariable
        public String pickupCountry;
        
        @InvocableVariable
        public String dropoffStreet;
        
        @InvocableVariable
        public String dropoffCity;
        
        @InvocableVariable
        public String dropoffPostal;
        
        @InvocableVariable
        public String dropoffState;
        
        @InvocableVariable
        public String dropoffCountry;
        
        @InvocableVariable
        public String bufferDuration;
    }
}