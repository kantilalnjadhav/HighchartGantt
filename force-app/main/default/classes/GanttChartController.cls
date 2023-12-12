public with sharing class GanttChartController {
    
     @AuraEnabled
        public static List<ResourceWrapper> fetchResourceAndShifts() {
            List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();
    
            // Query resources and related shift records
            
            List<Resource_DE__c> resources = [Select Id, Name, Name__c, Active_Employee__c From Resource_DE__c Where Active_Employee__c = true];
            Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    
            for (Resource_DE__c resource : resources) {
                resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
            }
    
            List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE ResourceId__c IN :resourceToShiftMap.keySet()];
    
            for (Shifts_DE__c shift : shifts) {
                resourceToShiftMap.get(shift.ResourceId__c).add(shift);
            }
    
            for (Resource_DE__c resource : resources) {
                List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
               
                resourceWrapperList.add(new ResourceWrapper(resource, resourceToShiftMap.get(resource.Id)));
            }
    
            return resourceWrapperList;
        }
        
        public class ResourceWrapper {
            @AuraEnabled public Resource_DE__c resource;
            @AuraEnabled public List<Shifts_DE__c> shifts;
    
            public ResourceWrapper(Resource_DE__c res, List<Shifts_DE__c> shfts) {
                resource = res;
                shifts = shfts;
            }
        }
    
      @AuraEnabled
    public static List<ResourceWrapperDayShift> fetchCurrentDayShifts() {
        List<ResourceWrapperDayShift> resourceWrapperList = new List<ResourceWrapperDayShift>();

        // Query resources and related shift records
        List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c];
        Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

        for (Resource_DE__c resource : resources) {
            resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
        }

        Date currentDate = Date.today();
        DateTime currentDateStart = DateTime.newInstance(currentDate, Time.newInstance(0, 0, 0, 0));
        DateTime currentDateEnd = DateTime.newInstance(currentDate, Time.newInstance(23, 59, 59, 999));

        List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :currentDateStart AND EndDate_Time__c <= :currentDateEnd AND ResourceId__c IN :resourceToShiftMap.keySet()];

        for (Shifts_DE__c shift : shifts) {
            resourceToShiftMap.get(shift.ResourceId__c).add(shift);
        }

        for (Resource_DE__c resource : resources) {
            List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
			if (shiftsForCurrentResource.size() > 0) {
            resourceWrapperList.add(new ResourceWrapperDayShift(resource, shiftsForCurrentResource));
        }
            //resourceWrapperList.add(new ResourceWrapperDayShift(resource, shiftsForCurrentResource));
        }

        for (ResourceWrapperDayShift resourceWrapper : resourceWrapperList) {
            System.debug('Resource: ' + resourceWrapper.resource.Name__c);
            for (Shifts_DE__c shift : resourceWrapper.shifts) {
                System.debug('Shift Name: ' + shift.Name);
                System.debug('Start Date/Time: ' + shift.StartDate_Time__c);
                System.debug('End Date/Time: ' + shift.EndDate_Time__c);
            }
        }

        return resourceWrapperList;
    }
     public class ResourceWrapperDayShift {
        @AuraEnabled public Resource_DE__c resource;
        @AuraEnabled public List<Shifts_DE__c> shifts;

        public ResourceWrapperDayShift(Resource_DE__c resource, List<Shifts_DE__c> shifts) {
            this.resource = resource;
            this.shifts = shifts;
        }
    }
    
    
  
    
   @AuraEnabled
public static List<ResourceWrapperWeekShift> fetchCurrentWeekShifts() {
    List<ResourceWrapperWeekShift> resourceWrapperList = new List<ResourceWrapperWeekShift>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
    }

    Date currentDate = Date.today();
    Integer dayOfWeek = Math.mod(Date.newInstance(1900, 1, 7).daysBetween(currentDate),7); // Get the current day of the week 
    system.debug(dayOfWeek);
    Date weekStartDate = currentDate.addDays(1 - dayOfWeek); // Calculate the start of the current week
    Date weekEndDate = weekStartDate.addDays(6); // Calculate the end of the current week

    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :weekStartDate AND EndDate_Time__c <= :weekEndDate AND ResourceId__c IN :resourceToShiftMap.keySet()];
	system.debug(weekStartDate);
    system.debug(weekEndDate);
    system.debug(shifts);
    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }
    system.debug(resourceToShiftMap);

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
        if(shiftsForCurrentResource.Size() > 0) {
        	resourceWrapperList.add(new ResourceWrapperWeekShift(resource, shiftsForCurrentResource));
        }
    }
    system.debug(resourceWrapperList);

    return resourceWrapperList;
}

public class ResourceWrapperWeekShift {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;

    public ResourceWrapperWeekShift(Resource_DE__c res, List<Shifts_DE__c> shfts) {
        resource = res;
        shifts = shfts;
    }
}

    @AuraEnabled
public static List<ResourceWrapperMonthShift> fetchCurrentMonthShifts() {
    List<ResourceWrapperMonthShift> resourceWrapperList = new List<ResourceWrapperMonthShift>();

    // Query resources and related shift records
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
    }

    Date currentDate = Date.today();
    Date monthStartDate = currentDate.toStartOfMonth(); // Get the start of the current month
    Date monthEndDate = monthStartDate.addMonths(1).addDays(-1); // Get the end of the current month

    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :monthStartDate AND EndDate_Time__c <= :monthEndDate AND ResourceId__c IN :resourceToShiftMap.keySet()];

    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    for (Resource_DE__c resource : resources) {
        List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
       
        resourceWrapperList.add(new ResourceWrapperMonthShift(resource, shiftsForCurrentResource));
    }

    return resourceWrapperList;
}

public class ResourceWrapperMonthShift {
    @AuraEnabled public Resource_DE__c resource;
    @AuraEnabled public List<Shifts_DE__c> shifts;

    public ResourceWrapperMonthShift(Resource_DE__c res, List<Shifts_DE__c> shfts) {
        resource = res;
        shifts = shfts;
    }
}
         @AuraEnabled
        public static List<ResourceWrapperWeekActive> fetchAcitveWeekResources() {
            List<ResourceWrapperWeekActive> resourceWrapperList = new List<ResourceWrapperWeekActive>();
    
            // Query resources and related shift records
            
            List<Resource_DE__c> resources = [Select Id, Name, Name__c, Active_Employee__c From Resource_DE__c Where Active_Employee__c = true];
            Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    
            for (Resource_DE__c resource : resources) {
                resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
            }
    
            List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE ResourceId__c IN :resourceToShiftMap.keySet()];
    
            for (Shifts_DE__c shift : shifts) {
                resourceToShiftMap.get(shift.ResourceId__c).add(shift);
            }
    
            for (Resource_DE__c resource : resources) {
                List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
               
                resourceWrapperList.add(new ResourceWrapperWeekActive(resource, resourceToShiftMap.get(resource.Id)));
            }
    
            return resourceWrapperList;
        }
        
        public class ResourceWrapperWeekActive {
            @AuraEnabled public Resource_DE__c resource;
            @AuraEnabled public List<Shifts_DE__c> shifts;
    
            public ResourceWrapperWeekActive(Resource_DE__c res, List<Shifts_DE__c> shfts) {
                resource = res;
                shifts = shfts;
            }
        }

      @AuraEnabled
        public static List<ResourceWrapperDayActive> fetchAcitveDayResources() {
            List<ResourceWrapperDayActive> resourceWrapperList = new List<ResourceWrapperDayActive>();
    		
            // Query resources and related shift records
            
            List<Resource_DE__c> resources = [Select Id, Name, Name__c, Active_Employee__c From Resource_DE__c Where Active_Employee__c = true];
            Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();
    
            for (Resource_DE__c resource : resources) {
                resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
            }

            List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE ResourceId__c IN :resourceToShiftMap.keySet()];
    
            for (Shifts_DE__c shift : shifts) {
                resourceToShiftMap.get(shift.ResourceId__c).add(shift);
            }
    
            for (Resource_DE__c resource : resources) {
                List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);
               
                resourceWrapperList.add(new ResourceWrapperDayActive(resource, resourceToShiftMap.get(resource.Id)));
            }
    
            return resourceWrapperList;
        }
        
        public class ResourceWrapperDayActive {
            @AuraEnabled public Resource_DE__c resource;
            @AuraEnabled public List<Shifts_DE__c> shifts;
    
            public ResourceWrapperDayActive(Resource_DE__c res, List<Shifts_DE__c> shfts) {
                resource = res;
                shifts = shfts;
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
        
    
}