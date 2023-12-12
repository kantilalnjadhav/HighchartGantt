@isTest
public class TestShiftCreationService {

    @isTest
    static void testCreateShifts() {
        // Create a test Resource record
        Resource__c testResource = new Resource__c(Name = 'Test Resource');
        insert testResource;

        // Define test input values
        DateTime startDate = DateTime.newInstance(2023, 8, 2, 8, 0, 0);
        DateTime endDate = DateTime.newInstance(2023, 8, 30, 17, 0, 0);
        Boolean isMondayChecked = true; // Example checkbox value
        
        // Create input parameters for the invocable method
        List<ShiftCreationService.ShiftInput> shiftInputs = new List<ShiftCreationService.ShiftInput>{
            new ShiftCreationService.ShiftInput(startDate, endDate, isMondayChecked, testResource.Id)
        };
        
        // Call the invocable method
        Test.startTest();
        ShiftCreationService.createShifts(shiftInputs);
        Test.stopTest();
        
        // Query for created Shift records
        List<Shift__c> createdShifts = [SELECT Id, Start_DateTime__c, End_DateTime__c, Resource__c, Mon_Checked__c FROM Shift__c];
        
        // Verify the created Shift records
        System.assertEquals(createdShifts.size(), BusinessLogic.calculateExpectedShiftCount(startDate, endDate, isMondayChecked), 'Number of created Shift records should match expected count');
        
        for (Shift__c shift : createdShifts) {
            System.assertEquals(testResource.Id, shift.Resource__c, 'Shift record should be associated with the correct resource');
            System.assert(shift.Mon_Checked__c, 'Monday checkbox should be checked');
            System.assert(shift.Start_DateTime__c >= startDate && shift.End_DateTime__c <= endDate, 'Shift should be within the specified datetime range');
        }
    }
}
