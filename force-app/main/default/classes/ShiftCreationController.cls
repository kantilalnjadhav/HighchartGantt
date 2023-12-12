public with sharing class ShiftCreationController {
    @AuraEnabled
    public static void createShifts(DateTime startDate, DateTime endDate, List<String> selectedDays, Id resourceId) {
        List<Shifts_DE__c> shiftsToCreate = new List<Shifts_DE__c>();
        DateTime currentDate = startDate;

        while (currentDate <= endDate) {
            // Check if the current day is selected by the user.
            if (selectedDays.contains(String.valueOf(currentDate.format('E')))) {
                DateTime shiftEndDateTime = currentDate.addHours(8); // Assuming a shift duration of 8 hours.
                shiftsToCreate.add(new Shifts_DE__c(
                    StartDate_Time__c = currentDate,
                    EndDate_Time__c = shiftEndDateTime,
                    ResourceId__c = resourceId
                ));
            }

            // Move to the next day (adding 1 day).
            currentDate = currentDate.addDays(1);
        }

        // Insert the created shifts.
        if (!shiftsToCreate.isEmpty()) {
            insert shiftsToCreate;
        }
    }
}
