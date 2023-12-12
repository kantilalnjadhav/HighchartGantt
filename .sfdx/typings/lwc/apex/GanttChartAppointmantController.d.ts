declare module "@salesforce/apex/GanttChartAppointmantController.fetchResourceAndAppointments" {
  export default function fetchResourceAndAppointments(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartAppointmantController.fetchCurrentUserTimeZone" {
  export default function fetchCurrentUserTimeZone(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartAppointmantController.updateResourceForAppointment" {
  export default function updateResourceForAppointment(param: {ApptId: any, newResourceId: any}): Promise<any>;
}
declare module "@salesforce/apex/GanttChartAppointmantController.updateAppointmentRecord" {
  export default function updateAppointmentRecord(param: {ApptId: any, newStartDateTime: any, newEndDateTime: any, newResourceId: any}): Promise<any>;
}
