public class DriverAvailabilityCalculator {

    @InvocableMethod(label='Get Available Drivers' description='Returns all the drivers that are available and not available during a specific time and duration' category='Drivers')
    public static List<DriverAvailability> getDriversAvailable(List<flowUserInputs> inputs) {
       
        List<DriverAvailability> outputs = new List<DriverAvailability>();
        outputs.add(getAvailableDriversList(inputs[0].selectedTime, inputs[0].estimatedDuration));
		return outputs;
	}

    public static DriverAvailability getAvailableDriversList(DateTime selectedTime, String estimatedDuration ) {
        DriverAvailability output = new DriverAvailability();
        List<Driver> driversAvailable = new List<Driver>();
        List<Driver> driversNotAvailable = new List<Driver>();
        DateTime selectedEstimatedEndTime = selectedTime.addMinutes(GoogleAPICallout.getNumMinutes(estimatedDuration));
        system.debug(selectedTime);
        system.debug(selectedEstimatedEndTime);
        List<String> IdsWithConflictingAppointments = new List<String>();
        
        //check appointments that interfer
        for(Appointment_DE__c driverId: [SELECT Transportation_Resource__c FROM Appointment_DE__c
             WHERE (Scheduled_Start_Date_Time__c >= :selectedTime AND Scheduled_Start_Date_Time__c <= :selectedEstimatedEndTime) //end time is inside appointment
             	OR (Scheduled_End_Date_Time__c >= :selectedTime AND Scheduled_End_Date_Time__c <= :selectedEstimatedEndTime) //start time is inside appointment
                OR (Scheduled_Start_Date_Time__c <= :selectedTime AND Scheduled_End_Date_Time__c >= :selectedEstimatedEndTime)]) //both start and end are within an appointment 
        {
            IdsWithConflictingAppointments.add(driverId.Transportation_Resource__c);
        }
        
        //check breaks that interfer
        for(Break_DE__c driverId: [SELECT Resource__c FROM Break_DE__c
             WHERE (Start_Date_Time__c >= :selectedTime AND Start_Date_Time__c <= :selectedEstimatedEndTime) //end time is inside appointment
             	OR (	End_Date_Time__c >= :selectedTime AND 	End_Date_Time__c <= :selectedEstimatedEndTime) //start time is inside appointment
                OR (Start_Date_Time__c <= :selectedTime AND 	End_Date_Time__c >= :selectedEstimatedEndTime)]) //both start and end are within an appointment 
        {
            IdsWithConflictingAppointments.add(driverId.Resource__c);
        }
        
        for(Resource_DE__c driver: [SELECT Id, Name__c FROM Resource_DE__c ORDER BY Name__c]) {
            Driver driverObject = new Driver();
            driverObject.driversName = driver.Name__c;
            driverObject.driverId = driver.Id;
            if(IdsWithConflictingAppointments.contains(driver.Id)){
                driversNotAvailable.add(driverObject);
            }
            else {
                driversAvailable.add(driverObject);
			}
        }
        output.driversAvailable = driversAvailable;
        output.driversNotAvailable = driversNotAvailable;
        system.debug(output);
        return output;
    }    
    
    public class flowUserInputs {
        @InvocableVariable
        public String estimatedDuration;
        
        @InvocableVariable
        public DateTime selectedTime;
        
    }
}