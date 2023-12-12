@isTest
private class DriverAvailabilityCalculatorTest {
    @testSetup
    static void setupFunction() {
        Resource_DE__c resource = new Resource_DE__c();
        resource.Name__c = 'Test Resource 1';
        resource.ResourceType__c = 'Driver';
        insert resource;
        
        Resource_DE__c resource2 = new Resource_DE__c();
        resource2.Name__c = 'Test Resource 2';
        resource2.ResourceType__c = 'Driver';
        insert resource2;
        
        Resource_DE__c resource3 = new Resource_DE__c();
        resource3.Name__c = 'Test Resource 3';
        resource3.ResourceType__c = 'Driver';
        insert resource3;
    }
    
	@isTest
    static void testGetAvailableDriversAllAvailableNoAppointments() {
        Test.startTest();
        DriverAvailabilityCalculator.flowUserInputs input = new DriverAvailabilityCalculator.flowUserInputs();
        input.estimatedDuration = '125 mins';
        input.selectedTime = DateTime.newInstanceGmt(2023, 1, 1, 10, 0, 0);
        List<DriverAvailabilityCalculator.flowUserInputs> flowInputs = new List<DriverAvailabilityCalculator.flowUserInputs>();
        flowInputs.add(input);
        List<DriverAvailabilityCalculator.flowUserOutputs> outputs = DriverAvailabilityCalculator.getDriversAvailable(flowInputs);
        Test.stopTest();
        system.assertEquals(outputs.size(), 1);
        system.assertEquals(outputs[0].driversAvailable.size(), 3);
    }
    
    @isTest
    static void testGetAvailableDriversOneNotAvailable() {
        List<Resource_DE__c> resources = [SELECT Id FROM Resource_DE__c];
        
        Appointment_DE__c appt = new Appointment_DE__c();
        appt.Transportation_Resource__c = resources[0].Id;
        appt.Scheduled_Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 9, 0, 0);
        appt.Scheduled_End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 13, 0, 0);
        insert appt;
        
        Test.startTest();

        
        DriverAvailabilityCalculator.flowUserInputs input = new DriverAvailabilityCalculator.flowUserInputs();
        input.estimatedDuration = '125 mins';
        input.selectedTime = DateTime.newInstanceGmt(2023, 1, 1, 10, 0, 0);
        List<DriverAvailabilityCalculator.flowUserInputs> flowInputs = new List<DriverAvailabilityCalculator.flowUserInputs>();
        flowInputs.add(input);
        List<DriverAvailabilityCalculator.flowUserOutputs> outputs = DriverAvailabilityCalculator.getDriversAvailable(flowInputs);
        Test.stopTest();
        system.assertEquals(outputs.size(), 1);
        system.assertEquals(outputs[0].driversAvailable.size(), 2);
    }
    
    @isTest
    static void testGetAvailableDriversTwoNotAvailable() {
        List<Resource_DE__c> resources = [SELECT Id FROM Resource_DE__c];
        
        Appointment_DE__c appt = new Appointment_DE__c();
        appt.Transportation_Resource__c = resources[0].Id;
        appt.Scheduled_Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 9, 0, 0);
        appt.Scheduled_End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 13, 0, 0);
        insert appt;
        
        Appointment_DE__c appt2 = new Appointment_DE__c();
        appt2.Transportation_Resource__c = resources[1].Id;
        appt2.Scheduled_Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 12, 0, 0);
        appt2.Scheduled_End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 13, 0, 0);
        insert appt2;
        
        Test.startTest();

        
        DriverAvailabilityCalculator.flowUserInputs input = new DriverAvailabilityCalculator.flowUserInputs();
        input.estimatedDuration = '125 mins';
        input.selectedTime = DateTime.newInstanceGmt(2023, 1, 1, 10, 0, 0);
        List<DriverAvailabilityCalculator.flowUserInputs> flowInputs = new List<DriverAvailabilityCalculator.flowUserInputs>();
        flowInputs.add(input);
        List<DriverAvailabilityCalculator.flowUserOutputs> outputs = DriverAvailabilityCalculator.getDriversAvailable(flowInputs);
        Test.stopTest();
        system.assertEquals(outputs.size(), 1);
        system.assertEquals(outputs[0].driversAvailable.size(), 1);
    }
    
    @isTest
    static void testGetAvailableDriversAllNotAvailable() {
        List<Resource_DE__c> resources = [SELECT Id FROM Resource_DE__c];
        
        Appointment_DE__c appt = new Appointment_DE__c();
        appt.Transportation_Resource__c = resources[0].Id;
        appt.Scheduled_Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 9, 0, 0);
        appt.Scheduled_End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 13, 0, 0);
        insert appt;
        
        Appointment_DE__c appt2 = new Appointment_DE__c();
        appt2.Transportation_Resource__c = resources[1].Id;
        appt2.Scheduled_Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 12, 0, 0);
        appt2.Scheduled_End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 13, 0, 0);
        insert appt2;
        
        Appointment_DE__c appt3 = new Appointment_DE__c();
        appt3.Transportation_Resource__c = resources[2].Id;
        appt3.Scheduled_Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 9, 0, 0);
        appt3.Scheduled_End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 10, 30, 0);
        insert appt3;
        
        Test.startTest();

        
        DriverAvailabilityCalculator.flowUserInputs input = new DriverAvailabilityCalculator.flowUserInputs();
        input.estimatedDuration = '125 mins';
        input.selectedTime = DateTime.newInstanceGmt(2023, 1, 1, 10, 0, 0);
        List<DriverAvailabilityCalculator.flowUserInputs> flowInputs = new List<DriverAvailabilityCalculator.flowUserInputs>();
        flowInputs.add(input);
        List<DriverAvailabilityCalculator.flowUserOutputs> outputs = DriverAvailabilityCalculator.getDriversAvailable(flowInputs);
        Test.stopTest();
        system.assertEquals(outputs.size(), 1);
        system.assertEquals(outputs[0].driversAvailable.size(), 0);
    }
    
    @isTest
    static void testGetAvailableDriversOneNotAvailableFromBreak() {
        List<Resource_DE__c> resources = [SELECT Id FROM Resource_DE__c];
        
        Shifts_DE__c shiftRecord = new Shifts_DE__c();
        shiftRecord.StartDate_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 8, 0, 0);
        shiftRecord.EndDate_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 17, 0, 0);
        shiftRecord.ResourceId__c = resources[0].Id;
        insert shiftRecord;
        
        Break_DE__c breakRecord = new Break_DE__c();
        breakRecord.Resource__c = resources[0].Id;
        breakRecord.Start_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 9, 0, 0);
        breakRecord.End_Date_Time__c = DateTime.newInstanceGmt(2023, 1, 1, 13, 0, 0);
        insert breakRecord;

        Test.startTest();

        
        DriverAvailabilityCalculator.flowUserInputs input = new DriverAvailabilityCalculator.flowUserInputs();
        input.estimatedDuration = '125 mins';
        input.selectedTime = DateTime.newInstanceGmt(2023, 1, 1, 10, 0, 0);
        List<DriverAvailabilityCalculator.flowUserInputs> flowInputs = new List<DriverAvailabilityCalculator.flowUserInputs>();
        flowInputs.add(input);
        List<DriverAvailabilityCalculator.flowUserOutputs> outputs = DriverAvailabilityCalculator.getDriversAvailable(flowInputs);
        Test.stopTest();
        system.assertEquals(outputs.size(), 1);
        system.assertEquals(outputs[0].driversAvailable.size(), 2);
    }
    
}