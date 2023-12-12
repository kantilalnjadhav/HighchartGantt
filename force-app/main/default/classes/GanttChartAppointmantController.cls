public with sharing class GanttChartAppointmantController {
    
    @AuraEnabled
    public static List<ResourceWrapper> fetchResourceAndAppointments() {
        List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();

        // Query resources and related shift records
        
        List<Resource_DE__c> resources = [Select Id, Name, Name__c From Resource_DE__c ];
        Map<Id, List<Appointment_DE__c>> resourceToShiftMap = new Map<Id, List<Appointment_DE__c>>();

        for (Resource_DE__c resource : resources) {
            resourceToShiftMap.put(resource.Id, new List<Appointment_DE__c>());
        }

        List<Appointment_DE__c> Appts = [SELECT Id, Name, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Transportation_Resource__c IN :resourceToShiftMap.keySet()];

        for (Appointment_DE__c Appt : Appts) {
            resourceToShiftMap.get(Appt.Transportation_Resource__c).add(Appt);
        }

        for (Resource_DE__c resource : resources) {
            resourceWrapperList.add(new ResourceWrapper(resource, resourceToShiftMap.get(resource.Id)));
        }

        return resourceWrapperList;
    }
    
    public class ResourceWrapper {
        @AuraEnabled public Resource_DE__c resource;
        @AuraEnabled public List<Appointment_DE__c> Appts;

        public ResourceWrapper(Resource_DE__c res, List<Appointment_DE__c> shfts) {
            resource = res;
            Appts = shfts;
        }
    }
    @AuraEnabled
    public static String fetchCurrentUserTimeZone() {
       String currentUserTimeZone;
       
       try {
           
           User currentUser = [SELECT TimeZoneSidKey FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
         
           currentUserTimeZone = currentUser.TimeZoneSidKey;
       } catch (Exception e) {
          
           currentUserTimeZone = 'Unknown';
       }
       
       return currentUserTimeZone;
   }

   @AuraEnabled
    public static String updateResourceForAppointment(String ApptId, String newResourceId) {
        Appointment_DE__c AppointmentRecordres = [SELECT Id, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Id = :ApptId LIMIT 1];
        if (AppointmentRecordres != null) {
            
			AppointmentRecordres.Transportation_Resource__c = newResourceId;
            
			update AppointmentRecordres;
            
        }
        return 'shit resource is updated';
    }
    @AuraEnabled
            public static String updateAppointmentRecord(String ApptId, String newStartDateTime, String newEndDateTime, String newResourceId) {
               
                try {
                    
                   
                    System.debug(ApptId);
                	//System.debug('newstart'+DateTime.parse(newStartDateTime));
                    System.debug('entered');
                    Appointment_DE__c AppoitmentRecord = [SELECT Id, Scheduled_Start_Date_Time__c, Scheduled_End_Date_Time__c, Transportation_Resource__c FROM Appointment_DE__c WHERE Id = :ApptId LIMIT 1];
                    System.debug('got shift');
                    if (AppoitmentRecord != null) {
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
                       //starthours +=( startdateparams[2].equalsIgnoreCase('PM') ? 12 : 0);
                       
                        AppoitmentRecord.Scheduled_Start_Date_Time__c = DateTime.newInstance(startyear, startmonth, startday, starthours, startminute, 0);
						System.debug('startdate'+AppoitmentRecord.Scheduled_Start_Date_Time__c);
						
                        List<string> enddateparams = newEndDateTime.split(' ');
                        system.debug(enddateparams);
                        integer endmonth = integer.valueof(enddateparams[0].substringbefore('/'));
                        integer endday = integer.valueof(enddateparams[0].substringbetween('/','/'));
                        integer endyear = integer.valueof(enddateparams[0].substringafterlast('/'));
						integer endhours = integer.valueOf(enddateparams[1].substringbefore(':'));
                        integer endminute = integer.valueOf(enddateparams[1].substringafter(':'));
                        
                        System.debug('endmonth'+endmonth);
                        System.debug('endday'+endday);
                        System.debug('endyear'+endyear);
                        System.debug('endhours'+endhours);
                        System.debug('endminute'+endminute);
                        
                        
                     	  
                        AppoitmentRecord.Scheduled_End_Date_Time__c = DateTime.newInstance(endyear, endmonth, endday, endhours, endminute, 0);
                   		System.debug('enddate'+AppoitmentRecord.Scheduled_End_Date_Time__c);              
                        System.debug('set');
                     
                        update AppoitmentRecord;
                        
                        
                     
                        System.debug('updated');
                        return 'updated shift record';
                    } else {
                        return 'Shift not found.';
                    }
                } catch (Exception e) {
                    return 'Error updating shift: ' + e.getMessage();
                }
            }



}


