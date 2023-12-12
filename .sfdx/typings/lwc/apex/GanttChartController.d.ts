declare module "@salesforce/apex/GanttChartController.fetchResourceAndShifts" {
  export default function fetchResourceAndShifts(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.fetchCurrentDayShifts" {
  export default function fetchCurrentDayShifts(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.fetchCurrentWeekShifts" {
  export default function fetchCurrentWeekShifts(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.fetchCurrentMonthShifts" {
  export default function fetchCurrentMonthShifts(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.fetchAcitveWeekResources" {
  export default function fetchAcitveWeekResources(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.fetchAcitveDayResources" {
  export default function fetchAcitveDayResources(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.fetchCurrentUserTimeZone" {
  export default function fetchCurrentUserTimeZone(): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.updateResourceForShift" {
  export default function updateResourceForShift(param: {shiftId: any, newResourceId: any}): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.updateShiftRecord" {
  export default function updateShiftRecord(param: {shiftId: any, newStartDateTime: any, newEndDateTime: any, newResourceId: any}): Promise<any>;
}
declare module "@salesforce/apex/GanttChartController.deleteSelectedShift" {
  export default function deleteSelectedShift(param: {IdShiftdlte: any}): Promise<any>;
}
