public with sharing class fetchshiftAppointment {
        @AuraEnabled
public static List<ResourceWrapper> fetchResourceAndShiftsAndAppointments() {
    List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c, Active_Employee__c, Assigned_Location__c FROM Resource_DE__c WHERE Active_Employee__c = true ORDER BY Name__c ASC];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    Map<Id, List<Appointment_DE__c>> resourceToAppointmentMap = new Map<Id, List<Appointment_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
        resourceToAppointmentMap.put(resource.Id, new List<Appointment_DE__c>());
    }

    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE ResourceId__c IN :resourceToShiftMap.keySet()];
List<Appointment_DE__c> appointments = [SELECT Id, Name, Scheduled_Start_Date_Time__c,Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Transportation_Resource__c IN :resourceToAppointmentMap.keySet()];
    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    for (Appointment_DE__c appointment : appointments) {
        resourceToAppointmentMap.get(appointment.Transportation_Resource__c).add(appointment);
    }

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
        List<Appointment_DE__c> appointmentsForCurrentResource = resourceToAppointmentMap.get(resource.Id);

        if (shiftsForCurrentResource.size() > 0 || appointmentsForCurrentResource.size() > 0) {
            resourceWrapperList.add(new ResourceWrapper(resource, shiftsForCurrentResource, appointmentsForCurrentResource));
        }
    }

    return resourceWrapperList;
}

public class ResourceWrapper {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;
    @AuraEnabled public List<Appointment_DE__c> appointments;

    public ResourceWrapper(Resource_DE__c res, List<Shifts_DE__c> shfts, List<Appointment_DE__c> appts) {
        resource = res;
        shifts = shfts;
        appointments = appts;
    }
}

@AuraEnabled
public static List<ResourceWrapperztoa> fetchResourceAndShiftsAndAppointmentsztoa() {
    List<ResourceWrapperztoa> resourceWrapperList = new List<ResourceWrapperztoa>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c, Active_Employee__c, Assigned_Location__c FROM Resource_DE__c WHERE Active_Employee__c = true ORDER BY Name__c DESC];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    Map<Id, List<Appointment_DE__c>> resourceToAppointmentMap = new Map<Id, List<Appointment_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
        resourceToAppointmentMap.put(resource.Id, new List<Appointment_DE__c>());
    }

    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE ResourceId__c IN :resourceToShiftMap.keySet()];
List<Appointment_DE__c> appointments = [SELECT Id, Name, Scheduled_Start_Date_Time__c,Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Transportation_Resource__c IN :resourceToAppointmentMap.keySet()];
    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    for (Appointment_DE__c appointment : appointments) {
        resourceToAppointmentMap.get(appointment.Transportation_Resource__c).add(appointment);
    }

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
        List<Appointment_DE__c> appointmentsForCurrentResource = resourceToAppointmentMap.get(resource.Id);

        if (shiftsForCurrentResource.size() > 0 || appointmentsForCurrentResource.size() > 0) {
            resourceWrapperList.add(new ResourceWrapperztoa(resource, shiftsForCurrentResource, appointmentsForCurrentResource));
        }
    }

    return resourceWrapperList;
}

public class ResourceWrapperztoa {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;
    @AuraEnabled public List<Appointment_DE__c> appointments;

    public ResourceWrapperztoa(Resource_DE__c res, List<Shifts_DE__c> shfts, List<Appointment_DE__c> appts) {
        resource = res;
        shifts = shfts;
        appointments = appts;
    }
}

@AuraEnabled
public static List<ResourceWrapperDayShift> fetchCurrentDayShiftsAndAppointments() {
    List<ResourceWrapperDayShift> resourceWrapperList = new List<ResourceWrapperDayShift>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c, Active_Employee__c FROM Resource_DE__c WHERE Active_Employee__c = true ORDER BY Name__c ASC];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    Map<Id, List<Appointment_DE__c>> resourceToAppointmentMap = new Map<Id, List<Appointment_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
        resourceToAppointmentMap.put(resource.Id, new List<Appointment_DE__c>());
    }

    Date currentDate = Date.today();
    DateTime currentDateStart = DateTime.newInstance(currentDate, Time.newInstance(0, 0, 0, 0));
    DateTime currentDateEnd = DateTime.newInstance(currentDate, Time.newInstance(23, 59, 59, 999));

    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :currentDateStart AND EndDate_Time__c <= :currentDateEnd AND ResourceId__c IN :resourceToShiftMap.keySet()];

    List<Appointment_DE__c> appointments = [SELECT Id, Name, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Scheduled_Start_Date_Time__c >= :currentDateStart AND Scheduled_End_Date_Time__c <= :currentDateEnd AND Transportation_Resource__c IN :resourceToAppointmentMap.keySet()];

    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    for (Appointment_DE__c appointment : appointments) {
        resourceToAppointmentMap.get(appointment.Transportation_Resource__c).add(appointment);
    }

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
        List<Appointment_DE__c> appointmentsForCurrentResource = resourceToAppointmentMap.get(resource.Id);

        if (!shiftsForCurrentResource.isEmpty() || !appointmentsForCurrentResource.isEmpty()) {
            resourceWrapperList.add(new ResourceWrapperDayShift(resource, shiftsForCurrentResource, appointmentsForCurrentResource));
        }
    }

    for (ResourceWrapperDayShift resourceWrapper : resourceWrapperList) {
        System.debug('Resource: ' + resourceWrapper.resource.Name__c);

        for (Shifts_DE__c shift : resourceWrapper.shifts) {
            System.debug('Shift Name: ' + shift.Name);
            System.debug('Start Date/Time: ' + shift.StartDate_Time__c);
            System.debug('End Date/Time: ' + shift.EndDate_Time__c);
        }

        for (Appointment_DE__c appointment : resourceWrapper.appointments) {
            System.debug('Appointment Name: ' + appointment.Name);
            System.debug('Start Date/Time: ' + appointment.Scheduled_Start_Date_Time__c);
            System.debug('End Date/Time: ' + appointment.Scheduled_End_Date_Time__c);
        }
    }

    return resourceWrapperList;
}

public class ResourceWrapperDayShift {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;
    @AuraEnabled public List<Appointment_DE__c> appointments;

    public ResourceWrapperDayShift(Resource_DE__c resource, List<Shifts_DE__c> shifts, List<Appointment_DE__c> appointments) {
        this.resource = resource;
        this.shifts = shifts;
        this.appointments = appointments;
    }
}

  @AuraEnabled
public static List<ResourceWrapperWeekShift> fetchCurrentWeekShiftsAndAppointments() {
    List<ResourceWrapperWeekShift> resourceWrapperList = new List<ResourceWrapperWeekShift>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c, Active_Employee__c FROM Resource_DE__c WHERE Active_Employee__c = true ORDER BY Name__c ASC];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    Map<Id, List<Appointment_DE__c>> resourceToAppointmentMap = new Map<Id, List<Appointment_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
        resourceToAppointmentMap.put(resource.Id, new List<Appointment_DE__c>());
    }

    Date currentDate = Date.today();
    Integer dayOfWeek = Math.mod(Date.newInstance(1900, 1, 7).daysBetween(currentDate),7); // Get the current day of the week 
    system.debug(dayOfWeek);
    Date weekStartDate = currentDate.addDays(1 - dayOfWeek); // Calculate the start of the current week
    Date weekEndDate = weekStartDate.addDays(7); // Calculate the end of the current week

    List<Shifts_DE__c> shifts = [
        SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c
        FROM Shifts_DE__c
        WHERE StartDate_Time__c >= :weekStartDate AND EndDate_Time__c <= :weekEndDate AND ResourceId__c IN :resourceToShiftMap.keySet()
    ];
    system.debug(weekStartDate);
    system.debug(weekEndDate);
    system.debug(shifts);
    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    List<Appointment_DE__c> appointments = [
        SELECT Id, Name, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c 
        FROM Appointment_DE__c
        WHERE Scheduled_Start_Date_Time__c >= :weekStartDate AND Scheduled_End_Date_Time__c <= :weekEndDate AND Transportation_Resource__c  IN :resourceToAppointmentMap.keySet()
    ];

    for (Appointment_DE__c appointment : appointments) {
        resourceToAppointmentMap.get(appointment.Transportation_Resource__c).add(appointment);
    }

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
        List<Appointment_DE__c> appointmentsForCurrentResource = resourceToAppointmentMap.get(resource.Id);

        if (!shiftsForCurrentResource.isEmpty() || !appointmentsForCurrentResource.isEmpty()) {
            resourceWrapperList.add(new ResourceWrapperWeekShift(resource, shiftsForCurrentResource, appointmentsForCurrentResource));
        }
    }
    system.debug(resourceWrapperList);

    return resourceWrapperList;
}

public class ResourceWrapperWeekShift {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;
    @AuraEnabled public List<Appointment_DE__c> appointments;

    public ResourceWrapperWeekShift(Resource_DE__c res, List<Shifts_DE__c> shfts, List<Appointment_DE__c> appts) {
        resource = res;
        shifts = shfts;
        appointments = appts;
    }
}

@AuraEnabled
public static List<ResourceWrapperMonthShift> fetchCurrentMonthShiftsAndAppointments() {
    List<ResourceWrapperMonthShift> resourceWrapperList = new List<ResourceWrapperMonthShift>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c, Active_Employee__c FROM Resource_DE__c WHERE Active_Employee__c = true ORDER BY Name__c ASC];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    Map<Id, List<Appointment_DE__c>> resourceToAppointmentMap = new Map<Id, List<Appointment_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
        resourceToAppointmentMap.put(resource.Id, new List<Appointment_DE__c>());
    }

    Date currentDate = Date.today();
    Date monthStartDate = currentDate.toStartOfMonth(); // Get the start of the current month
    Date monthEndDate = monthStartDate.addMonths(1).addDays(-1); // Get the end of the current month

    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :monthStartDate AND EndDate_Time__c <= :monthEndDate AND ResourceId__c IN :resourceToShiftMap.keySet()];

    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    List<Appointment_DE__c> appointments = [SELECT Id, Name, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Scheduled_Start_Date_Time__c >= :monthStartDate AND Scheduled_End_Date_Time__c <= :monthEndDate AND Transportation_Resource__c  IN :resourceToAppointmentMap.keySet()];

    for (Appointment_DE__c appointment : appointments) {
        resourceToAppointmentMap.get(appointment.Transportation_Resource__c).add(appointment);
    }

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
        List<Appointment_DE__c> appointmentsForCurrentResource = resourceToAppointmentMap.get(resource.Id);

        resourceWrapperList.add(new ResourceWrapperMonthShift(resource, shiftsForCurrentResource, appointmentsForCurrentResource));
    }

    return resourceWrapperList;
}

public class ResourceWrapperMonthShift {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;
    @AuraEnabled public List<Appointment_DE__c> appointments;

    public ResourceWrapperMonthShift(Resource_DE__c res, List<Shifts_DE__c> shfts, List<Appointment_DE__c> appts) {
        resource = res;
        shifts = shfts;
        appointments = appts;
    }
}

@AuraEnabled
public static String fetchCurrentUserTimeZone() {
   String currentUserTimeZone;
   
   //try {
       
       User currentUser = [SELECT TimeZoneSidKey FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
     
       currentUserTimeZone = currentUser.TimeZoneSidKey;
   //} //catch (Exception e) {
      
       //currentUserTimeZone = 'Unknown';
   //}
   
   return currentUserTimeZone;
}

@AuraEnabled
    public static String updateResourceForShift(String shiftId, String newResourceId) {
        Shifts_DE__c shiftRecordres = [SELECT Id, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE Id = :shiftId LIMIT 1];
        if (shiftRecordres != null) {
            
			shiftRecordres.ResourceId__c = newResourceId;
            
			update shiftRecordres;
            
        }
        return 'shift resource is updated';
    }
    
      
     @AuraEnabled
            public static String updateShiftRecord(String shiftId, String newStartDateTime, String newEndDateTime, String newResourceId) {
               
                try {
                    
                   
                    System.debug(shiftId);
                	//System.debug('newstart'+DateTime.parse(newStartDateTime));
                    System.debug('entered');
                    Shifts_DE__c shiftRecord = [SELECT Id, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE Id = :shiftId LIMIT 1];
                    System.debug('got shift');
                    if (shiftRecord != null) {
                        System.debug('not null');
                        System.debug(newStartDateTime);
                        System.debug(newEndDateTime);
                       
                             system.debug('start date time');
                             system.debug(newStartDateTime);
                             List<string> startdateparams = newStartDateTime.split(' ');
                        system.debug('start params');
                                                    system.debug(startdateparams);
                        integer startmonth = integer.valueof(startdateparams[0].substringbefore('/'));
                        integer startday = integer.valueof(startdateparams[0].substringbetween('/','/'));
                        integer startyear = integer.valueof(startdateparams[0].substringafterlast('/'));
						integer starthours = integer.valueOf(startdateparams[1].substringbefore(':'));
                      	integer startminute = integer.valueOf(startdateparams[1].substringafter(':'));
                      
                     	shiftRecord.StartDate_Time__c = DateTime.newInstance(startyear, startmonth, startday, starthours, startminute, 0);
						
						
                        List<string> enddateparams = newEndDateTime.split(' ');
                        system.debug(enddateparams);
                        integer endmonth = integer.valueof(enddateparams[0].substringbefore('/'));
                        integer endday = integer.valueof(enddateparams[0].substringbetween('/','/'));
                        integer endyear = integer.valueof(enddateparams[0].substringafterlast('/'));
						integer endhours = integer.valueOf(enddateparams[1].substringbefore(':'));
                        integer endminute = integer.valueOf(enddateparams[1].substringafter(':'));
                     
                       	 shiftRecord.EndDate_Time__c = DateTime.newInstance(endyear, endmonth, endday, endhours, endminute, 0);
                   		
                        update shiftRecord;
                        
                        
                     
                        System.debug('updated');
                        return 'updated shift record';
                    } else {
                        return 'shift not found';
                    }
                } catch (Exception e) {
                    return 'Error updating shift: ' + e.getMessage();
                }
            }

            @AuraEnabled
    public static string deleteSelectedShift(string IdShiftdlte){
        system.debug(IdShiftdlte);
        Shifts_DE__c shifttodelete = [SELECT Id, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE Id = :IdShiftdlte LIMIT 1];
  
        if(shifttodelete != null){
            
            delete shifttodelete;
            
        }
         return 'shift resource is Deleted';
    } 
    
    @AuraEnabled
    public static String updateApptRecord(String apptId, String newStartApptDateTime, String newEndApptDateTime, String newResourceId) {
       
        try {
             //System.debug('newstart'+DateTime.parse(newStartDateTime));
            System.debug('entered');
            Appointment_DE__c  shiftRecord = [SELECT Id, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c  FROM Appointment_DE__c  WHERE Id = :apptId LIMIT 1];
            System.debug('got shift');
            if (shiftRecord != null) {
                System.debug('not null');
                System.debug(newStartApptDateTime);
                System.debug(newEndApptDateTime);
               
                     system.debug('start date time');
                     system.debug(newStartApptDateTime);
                     List<string> startdateparams = newStartApptDateTime.split(' ');
                system.debug('start params');
                                            system.debug(startdateparams);
                integer startmonth = integer.valueof(startdateparams[0].substringbefore('/'));
                integer startday = integer.valueof(startdateparams[0].substringbetween('/','/'));
                integer startyear = integer.valueof(startdateparams[0].substringafterlast('/'));
                integer starthours = integer.valueOf(startdateparams[1].substringbefore(':'));
                  integer startminute = integer.valueOf(startdateparams[1].substringafter(':'));
              
                 shiftRecord.Scheduled_Start_Date_Time__c = DateTime.newInstance(startyear, startmonth, startday, starthours, startminute, 0);
                
                
                List<string> enddateparams = newEndApptDateTime.split(' ');
                system.debug(enddateparams);
                integer endmonth = integer.valueof(enddateparams[0].substringbefore('/'));
                integer endday = integer.valueof(enddateparams[0].substringbetween('/','/'));
                integer endyear = integer.valueof(enddateparams[0].substringafterlast('/'));
                integer endhours = integer.valueOf(enddateparams[1].substringbefore(':'));
                integer endminute = integer.valueOf(enddateparams[1].substringafter(':'));
             
                    shiftRecord.Scheduled_Start_Date_Time__c = DateTime.newInstance(endyear, endmonth, endday, endhours, endminute, 0);
                   
                update shiftRecord;
                
                
             
                System.debug('updated');
                return 'updated shift record';
            } else {
                return 'shift not found';
            }
        } catch (Exception e) {
            return 'Error updating shift: ' + e.getMessage();
        }
    }

    @AuraEnabled
    public static String updateResourceForAppointments(String appointmentId, String newResourceId) {
        Appointment_DE__c shiftRecordres = [SELECT Id, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c  WHERE Id = :appointmentId LIMIT 1];
        if (shiftRecordres != null) {
            
			shiftRecordres.Transportation_Resource__c = newResourceId;
            
			update shiftRecordres;
            
        }
        return 'shift resource is updated';
    }
}