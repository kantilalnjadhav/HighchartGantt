public class ReverseGeocodingCallout  {
    @InvocableMethod(label='Update Current Location' description='Calls google apis to get reverse geocoded address from current location coordinates' category='Callout')
    public static List<flowUserOutputs> setAddress(List<flowUserInputs> inputs) {
        List<flowUserOutputs> outputs = new List<flowUserOutputs>();
        system.debug(inputs);
        system.debug(inputs[0]);
        String lat = string.valueof(inputs[0].latitude);
        String lon = string.valueof(inputs[0].longitude);
        String address = lat + ',' + lon;
        
        Google_API_Settings__mdt GoogleAPISettings = [Select API_Key__c, API_Url__c from Google_API_Settings__mdt WHERE DeveloperName = 'Google_API_record'];
        string apiKey = GoogleAPISettings.API_Key__c;
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+apiKey;
        request.setEndPoint(endpoint);
        request.setMethod('GET');
        system.debug(request);
        
        HttpResponse response = http.send(request);
        System.debug(response.getBody());

        GeocodingData geodata = (GeocodingData)JSON.deserialize(response.getBody(), GeocodingData.class);
        if (geodata.status == 'ZERO_RESULTS') {
            system.debug('Could not find address matching coordinates ' + address);
            return outputs;
        }
        
        String streetNumber = '';
        String streetName = '';
        String cityToSave = '';
        String stateToSave = '';
        String countryToSave = '';
        String postalCodeToSave = '';
        if (geodata != null && geodata.results !=null && geodata.results.size() > 0) {
            ResultSet firstResult = geodata.results[0];
            for (AddressComponent addrComp : firstResult.address_components) {
                system.debug(addrcomp);
                if (addrComp.types.contains('street_number')) {
                    streetNumber = addrComp.long_name;
                } else if (addrComp.types.contains('route')) {
                    streetName = addrComp.short_name;
                } else if (addrComp.types.contains('locality')) {
                    cityToSave = addrComp.long_name;
                } else if (addrComp.types.contains('administrative_area_level_1')) {
                    stateToSave = addrComp.short_name;
                } else if (addrComp.types.contains('country')) {
                    countryToSave = addrComp.short_name;
                } else if (addrComp.types.contains('postal_code')) {
                    postalCodeToSave = addrComp.long_name;
                }
            }
        }
        String streetToSave = streetNumber + ' ' + streetName;
        system.debug(streetToSave);
        system.debug(cityToSave);
        system.debug(stateToSave);
        system.debug(countryToSave);
        system.debug(postalCodeToSave);
        
        Schema.DescribeFieldResult coFieldResult = User.Countrycode.getDescribe();
		List<Schema.PicklistEntry> copl = coFieldResult.getPicklistValues();
        List<String> countryCodes = new List<string>();
		for( Schema.PicklistEntry co : copl){
            countryCodes.add(co.getValue());
		}
        Schema.DescribeFieldResult stFieldResult = User.statecode.getDescribe();
		List<Schema.PicklistEntry> stpl = stFieldResult.getPicklistValues();
        List<String> stateCodes = new List<string>();
		for( Schema.PicklistEntry st : stpl){
            stateCodes.add(st.getValue());
		}
        
        
        flowUserOutputs output = new flowUserOutputs();
        output.street = streetToSave;
        output.city = cityToSave;
        if (stateCodes.contains(stateToSave)) {
        	output.state = stateToSave;
        }
        if (countryCodes.contains(countryToSave)) {
        	output.country = countryToSave;
        }
        output.postalCode = postalCodeToSave;
        
        outputs.add(output);
        return outputs;
    }
    
    public class CoordSet {
            Decimal lat;
            Decimal lng;
    }
    public class AddressComponent {
    	String long_name;
        String short_name;
        List<String> types;
    }
    
	public class Bounds {
        CoordSet northeast;
    	CoordSet southwest;
    }
    public class Geometry {
        Bounds bounds;
        CoordSet location;
        String location_type;
        Bounds viewport;
    }
    public class ResultSet {
        List<AddressComponent> address_components;
        String formatted_address;
        Geometry geometry;
        String place_id;
        List<String> types;
    }
    
    public class GeocodingData {
        List<ResultSet> results;
        String status;
    }
    
    public class flowUserOutputs {
        @InvocableVariable
        public String street;
        
        @InvocableVariable
        public String city;
        
        @InvocableVariable
        public String state;
        
        @InvocableVariable
        public String country;
        
        @InvocableVariable
        public String postalCode;
    }
    
    public class flowUserInputs {
        @InvocableVariable
        public String latitude;
        
        @InvocableVariable
        public String longitude;
    }
    
}