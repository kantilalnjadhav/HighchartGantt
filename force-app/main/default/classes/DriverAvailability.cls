public class DriverAvailability {
    @AuraEnabled
    @InvocableVariable
    public List<Driver> driversAvailable;
    
    @AuraEnabled
    @InvocableVariable
    public List<Driver> driversNotAvailable;
}