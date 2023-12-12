public with sharing class getResourceData {
     @AuraEnabled(cacheable=true)
   
         public static List<Resource_DE__c> getResourceData() {
         List<Resource_DE__c> ResourceList = new List<Resource_DE__c>();
      

           try {
        ResourceList = [ SELECT Id,Name__c,Location_Latitude__c,Location_Longitude__c FROM Resource_DE__c  ORDER BY Name__c ];
            System.debug(JSON.serializePretty(ResourceList));
            }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
         return ResourceList;

    
         }onload

           var currentDate = new Date();
    var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
    var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();

    // Filter the chartData array to include only the shifts for the current day
    var filteredData = chartData.filter(function(shift) {
      return shift.start >= startOfDay && shift.end <= endOfDay;
    });

    var resourceIds = filteredData.map(function(shift) {
      return shift.resid;
    });
    // Remove duplicates from resourceIds
    resourceIds = [...new Set(resourceIds)];

    // Filter the ResData array to include only the resources with shifts on the current day
    var filteredResData = ResData.filter(function(resource) {
      return resourceIds.includes(resource.id);
    });

    // Create an object to store the shifts per resource
    var shiftsPerResource = {};
    filteredData.forEach(function(shift) {
      if (!shiftsPerResource[shift.resid]) {
        shiftsPerResource[shift.resid] = [];
      }
      shiftsPerResource[shift.resid].push(shift);
    });

    // Create an array to store the linked shifts for each resource in the correct order
    var linkedShifts = [];
    filteredResData.forEach(function(resource) {
      if (shiftsPerResource[resource.id]) {
        linkedShifts = linkedShifts.concat(shiftsPerResource[resource.id]);
      }
    });

    this.xAxis[0].setExtremes(startOfDay, endOfDay);
    // Update the categories and data in the chart
    this.update({
      yAxis: { 
        type: 'category',
        categories: filteredResData.map(function(resource) {
          return resource.name;
        }),
        min: 0,
        max: filteredResData.length-1
      },
      series: [
        {
          name: "Shifts",
          data: linkedShifts
        }
      ]
    });
 var numRows = filteredResData.length;
    var rowHeight = 50; // Adjust this value as needed
    var chartHeight = numRows * rowHeight + 100; // Adjust the additional height as needed
    this.setSize(null, chartHeight);
    this.redraw();



         {
            text: 'Day',
            onclick: function() {
              var currentDate = new Date();
              var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
              var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
          
              // Filter the chartData array to include only the shifts for the current day
              var filteredData = chartData.filter(function(shift) {
                return shift.start >= startOfDay && shift.end <= endOfDay;
              });
          
              var resourceIds = filteredData.map(function(shift) {
                return shift.resid;
              });
              // Remove duplicates from resourceIds
              resourceIds = [...new Set(resourceIds)];
          
              // Filter the ResData array to include only the resources with shifts on the current day
              var filteredResData = ResData.filter(function(resource) {
                return resourceIds.includes(resource.id);
              });
          
              // Create an object to store the shifts per resource
              var shiftsPerResource = {};
              filteredData.forEach(function(shift) {
                if (!shiftsPerResource[shift.resid]) {
                  shiftsPerResource[shift.resid] = [];
                }
                shiftsPerResource[shift.resid].push(shift);
              });
          
              // Create an array to store the linked shifts for each resource in the correct order
              var linkedShifts = [];
              filteredResData.forEach(function(resource) {
                if (shiftsPerResource[resource.id]) {
                  linkedShifts = linkedShifts.concat(shiftsPerResource[resource.id]);
                }
              });
          
              this.xAxis[0].setExtremes(startOfDay, endOfDay);
              // Update the categories and data in the chart
              this.update({
                yAxis: {
                  type: 'category',
                  categories: filteredResData.map(function(resource) {
                    return resource.name;
                  }),
                  min: 0,
                  max: filteredResData.length-1
                },
                series: [
                  {
                    name: "Shifts",
                    data: linkedShifts
                  }
                ]
              });
          
              // Hide other shifts and resources
              this.series[0].points.forEach(function(point) {
                if (!linkedShifts.includes(point.options)) {
                  point.hide();
                }
              });
          
              // Adjust chart height based on the number of resources
              var numRows = filteredResData.length;
              var rowHeight = 50; // Adjust this value as needed
              var chartHeight = numRows * rowHeight + 100; // Adjust the additional height as needed
              this.setSize(null, chartHeight);
              this.redraw();
            }
          },
                              
                         /* {
            text: 'Day',
            onclick: function() {
              var currentDate = new Date();
              var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
              var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
          
              // Filter the chartData array to include only the shifts for the current day
              var filteredData = chartData.filter(function(shift) {
                return shift.start >= startOfDay && shift.end <= endOfDay;
              });
          
              var resourceIds = filteredData.map(function(shift) {
                return shift.resid;
              });
              // Remove duplicates from resourceIds
              resourceIds = [...new Set(resourceIds)];
          
              // Filter the ResData array to include only the resources with shifts on the current day
              var filteredResData = ResData.filter(function(resource) {
                return resourceIds.includes(resource.id);
              });
          
              // Create an object to store the shifts per resource
              var shiftsPerResource = {};
              filteredData.forEach(function(shift) {
                if (!shiftsPerResource[shift.resid]) {
                  shiftsPerResource[shift.resid] = [];
                }
                shiftsPerResource[shift.resid].push(shift);
              });
          
              // Create an array to store the linked shifts for each resource in the correct order
              var linkedShifts = [];
              filteredResData.forEach(function(resource) {
                if (shiftsPerResource[resource.id]) {
                  linkedShifts = linkedShifts.concat(shiftsPerResource[resource.id]);
                }
              });
          
              this.xAxis[0].setExtremes(startOfDay, endOfDay);
              // Update the categories and data in the chart
              this.update({
                yAxis: {
                  type: 'category',
                  categories: filteredResData.map(function(resource) {
                    return resource.name;
                  }),
                  min: 0,
                  max: filteredResData.length-1
                },
                series: [
                  {
                    name: "Shifts",
                    data: linkedShifts
                  }
                ]
              });
                   var numRows = filteredResData.length;
              var rowHeight = 70;//Adjust this value as needed
              var chartHeight = numRows * rowHeight + 100; // Adjust the additional height as needed
              this.setSize(null, chartHeight);
              this.redraw();
            }
          },*/
                          {
            text: 'Week',
            onclick: function() {
              var currentDate = new Date();
              var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
              var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
          
              // Filter the chartData array to include only the shifts for the current week
              var filteredData = chartData.filter(function(shift) {
                return shift.start >= startOfWeek.getTime() && shift.end <= endOfWeek.getTime();
              });
          
              var resourceIds = filteredData.map(function(shift) {
                return shift.resid;
              });
              // Remove duplicates from resourceIds
              resourceIds = [...new Set(resourceIds)];
          
              // Filter the ResData array to include only the resources with shifts on the current week
              var filteredResData = ResData.filter(function(resource) {
                return resourceIds.includes(resource.id);
              });
                console.log("filteredData for week", filteredResData);
          
              // Create an object to store the shifts per resource
              var shiftsPerResource = {};
              filteredData.forEach(function(shift) {
                if (!shiftsPerResource[shift.resid]) {
                  shiftsPerResource[shift.resid] = [];
                }
                shiftsPerResource[shift.resid].push(shift);
              });
                console.log("shiftsPerResource", shiftsPerResource);
          
              // Create an array to store the linked shifts for each resource in the correct order
              var linkedShifts = [];
              filteredResData.forEach(function(resource) {
                if (shiftsPerResource[resource.id]) {
                  linkedShifts = linkedShifts.concat(shiftsPerResource[resource.id]);
                }
              });
          
              this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());
              // Update the categories and data in the chart
              this.update({
                yAxis: {
                  type: 'category',
                  categories: filteredResData.map(function(resource) {
                    return resource.name;
                  }),
                  min: 0,
                  max: filteredResData.length-1
                },
                series: [
                  {
                    name: "Shifts",
                    data: linkedShifts
                  }
                ]
              });
               var numRows = filteredResData.length;
              var rowHeight = 50; // Adjust this value as needed
              var chartHeight = numRows * rowHeight + 100; // Adjust the additional height as needed
              this.setSize(null, chartHeight);
              this.redraw();
            }
          },
                          {
            text: 'Month',
            onclick: function() {
              var currentDate = new Date();
              var startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
              var endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getTime();
          
              // Filter the chartData array to include only the shifts for the current month
              var filteredData = chartData.filter(function(shift) {
                return shift.start >= startOfMonth && shift.end <= endOfMonth;
              });
          
              var resourceIds = filteredData.map(function(shift) {
                return shift.resid;
              });
              // Remove duplicates from resourceIds
              resourceIds = [...new Set(resourceIds)];
          
              // Filter the ResData array to include only the resources with shifts on the current month
              var filteredResData = ResData.filter(function(resource) {
                return resourceIds.includes(resource.id);
              });
          
              // Create an object to store the shifts per resource
              var shiftsPerResource = {};
              filteredData.forEach(function(shift) {
                if (!shiftsPerResource[shift.resid]) {
                  shiftsPerResource[shift.resid] = [];
                }
                shiftsPerResource[shift.resid].push(shift);
              });
          
              // Create an array to store the linked shifts for each resource in the correct order
              var linkedShifts = [];
              filteredResData.forEach(function(resource) {
                if (shiftsPerResource[resource.id]) {
                  linkedShifts = linkedShifts.concat(shiftsPerResource[resource.id]);
                }
              });
          
              this.xAxis[0].setExtremes(startOfMonth, endOfMonth);
              // Update the categories and data in the chart
              this.update({
                yAxis: {
                  type: 'category',
                  categories: filteredResData.map(function(resource) {
                    return resource.name;
                  }),
                  min: 0,
                  max: filteredResData.length-1
                },
                series: [
                  {
                    name: "Shifts",
                    data: linkedShifts
                  }
                ]
              });
           var numRows = filteredResData.length;
              var rowHeight = 50; // Adjust this value as needed
              var chartHeight = numRows * rowHeight + 100; // Adjust the additional height as needed
              this.setSize(null, chartHeight);
              this.redraw();
            }
          }, 
          /*{
            text: 'Week',
            onclick: function() {
              var currentDate = new Date();
              var startOfWeek = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate() - currentDate.getDay());
              var endOfWeek = new Date( currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate() - currentDate.getDay() + 7);
              //this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());
              // Filter the chartData array to include only the shifts for the current week
              var filteredData = chartData.filter(function(shift) {
                return shift.start >= startOfWeek.getTime() && shift.end <= endOfWeek.getTime();
              });
          
              
              
             var resourceIds = filteredData.map(function(shift) {
                return shift.resid;
              });
              //resourceIds = [...new Set(resourceIds)]; // Remove duplicates
          
              // Filter the ResData array to include only the resources with shifts on the current week
              var filteredResData = ResData.filter(function(resource) {
                return resourceIds.includes(resource.id);
              });
                
               this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());
              // Update the categories and data in the chart
              this.update({
                yAxis: {
                    type: 'category',
                  categories: filteredResData.map(function(resource) {
                    return resource.name;
                  }),
                    
                    min: 0,
                 max: filteredResData.length - 1
                    
                },
                series: [
                  {
                    name: "Shifts",
                    data: filteredData
                   
                  }
                ]
              });
          
              this.redraw();
            }
          },*/
          /*{
            text: 'Month',
            onclick: function() {
              var currentDate = new Date();
              var startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              var endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                  //this.xAxis[0].setExtremes(startOfMonth.getTime(), endOfMonth.getTime());
              // Filter the chartData array to include only the shifts for the current month
              var filteredData = chartData.filter(function(shift) {
                return shift.start >= startOfMonth.getTime() && shift.end <= endOfMonth.getTime();
              });
          
              // Get the unique resource IDs for the shifts on the current month
              var resourceIds = filteredData.map(function(shift) {
                return shift.resid;
              });
              //resourceIds = [...new Set(resourceIds)]; // Remove duplicates
          
              // Filter the ResData array to include only the resources with shifts on the current month
              var filteredResData = ResData.filter(function(resource) {
                return resourceIds.includes(resource.id);
              });
              
          this.xAxis[0].setExtremes(startOfMonth.getTime(), endOfMonth.getTime());
              // Update the categories and data in the chart
              this.update({
                yAxis: {
                  categories: filteredResData.map(function(resource) {
                    return resource.name;
                  }),
                    
                    min: 0,
                  max: filteredResData.length-1
                },
                series: [
                  {
                    name: "Shifts",
                    data: filteredData
                   
                  }
                ]
              });
          
              this.redraw();
            }
          }*/
          @AuraEnabled
public static List<ResourceWrapper> fetchResourceAndShifts() {
    List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();

    // Fetch all resources
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c];
    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

    for (Resource_DE__c resource : resources) {
        resourceToShiftMap.put(resource.Id, new List<Shifts_DE__c>());
    }

    // Fetch all shifts for resources
    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE ResourceId__c IN :resourceToShiftMap.keySet()];

    for (Shifts_DE__c shift : shifts) {
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    for (Resource_DE__c resource : resources) {
        resourceWrapperList.add(new ResourceWrapper(resource, resourceToShiftMap.get(resource.Id)));
    }

    return resourceWrapperList;
}

@AuraEnabled
public static List<ResourceWrapper> fetchCurrentDayShifts() {
    List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();

    // Fetch current day shifts and related resources
    Date currentDate = Date.today();

    // Modify your query to filter shifts by the current day
    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :currentDate && EndDate_Time__c <= :currentDate];

    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

    for (Shifts_DE__c shift : shifts) {
        if (!resourceToShiftMap.containsKey(shift.ResourceId__c)) {
            resourceToShiftMap.put(shift.ResourceId__c, new List<Shifts_DE__c>());
        }
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    // Fetch related resources
    List<Id> resourceIds = new List<Id>(resourceToShiftMap.keySet());
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c WHERE Id IN :resourceIds];

    for (Resource_DE__c resource : resources) {
        resourceWrapperList.add(new ResourceWrapper(resource, resourceToShiftMap.get(resource.Id)));
    }

    return resourceWrapperList;
}

@AuraEnabled
public static List<ResourceWrapper> fetchCurrentWeekShifts() {
    List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();

    // Fetch current week shifts and related resources
    Date currentDate = Date.today();
    Integer dayOfWeek = currentDate.dayOfWeek;
    Date weekStartDate = currentDate.addDays(-dayOfWeek + 1);
    Date weekEndDate = weekStartDate.addDays(6);

    // Modify your query to filter shifts by the current week
    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :weekStartDate && EndDate_Time__c <= :weekEndDate];

    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

    for (Shifts_DE__c shift : shifts) {
        if (!resourceToShiftMap.containsKey(shift.ResourceId__c)) {
            resourceToShiftMap.put(shift.ResourceId__c, new List<Shifts_DE__c>());
        }
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    // Fetch related resources
    List<Id> resourceIds = new List<Id>(resourceToShiftMap.keySet());
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c WHERE Id IN :resourceIds];

    for (Resource_DE__c resource : resources) {
        resourceWrapperList.add(new ResourceWrapper(resource, resourceToShiftMap.get(resource.Id)));
    }

    return resourceWrapperList;
}

@AuraEnabled
public static List<ResourceWrapper> fetchCurrentMonthShifts() {
    List<ResourceWrapper> resourceWrapperList = new List<ResourceWrapper>();

    // Fetch current month shifts and related resources
    Date currentDate = Date.today();
    Date monthStartDate = currentDate.toStartOfMonth();
    Date monthEndDate = currentDate.toStartOfMonth().addMonths(1).addDays(-1);

    // Modify your query to filter shifts by the current month
    List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c FROM Shifts_DE__c WHERE StartDate_Time__c >= :monthStartDate && EndDate_Time__c <= :monthEndDate];

    Map<Id, List<Shifts_DE__c>> resourceToShiftMap = new Map<Id, List<Shifts_DE__c>>();

    for (Shifts_DE__c shift : shifts) {
        if (!resourceToShiftMap.containsKey(shift.ResourceId__c)) {
            resourceToShiftMap.put(shift.ResourceId__c, new List<Shifts_DE__c>());
        }
        resourceToShiftMap.get(shift.ResourceId__c).add(shift);
    }

    // Fetch related resources
    List<Id> resourceIds = new List<Id>(resourceToShiftMap.keySet());
    List<Resource_DE__c> resources = [SELECT Id, Name, Name__c FROM Resource_DE__c WHERE Id IN :resourceIds];

    for (Resource_DE__c resource : resources) {
        resourceWrapperList.add(new ResourceWrapper(resource, resourceToShiftMap.get(resource.Id)));
    }

    return resourceWrapperList;
}

 // Helper method to fetch and render data for the current day
 fetchAndRenderCurrentDayData: function (component) {
    var action = component.get("c.fetchCurrentDayShifts");
    action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
            var data = response.getReturnValue();
            this.drawChart(component, data);
        } else {
            console.error("Error fetching data for the current day: " + response.getError());
        }
    });
    $A.enqueueAction(action);
},
  // Helper method to fetch and render data for the current week
fetchAndRenderCurrentWeekData: function (component) {
    var action = component.get("c.fetchCurrentWeekShifts");
    action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
            var data = response.getReturnValue();
            this.drawChart(component, data);
        } else {
            console.error("Error fetching data for the current week: " + response.getError());
        }
    });
    $A.enqueueAction(action);
},

// Helper method to fetch and render data for the current month
fetchAndRenderCurrentMonthData: function (component) {
    var action = component.get("c.fetchCurrentMonthShifts");
    action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
            var data = response.getReturnValue();
            this.drawChart(component, data);
        } else {
            console.error("Error fetching data for the current month: " + response.getError());
        }
    });
    $A.enqueueAction(action);
},

// Method to fetch and render data for the current day
fetchAndRenderCurrentDay: function (component, event, helper) {
    helper.fetchAndRenderCurrentDayData(component);
},
// Method to fetch and render data for the current week
fetchAndRenderCurrentWeek: function (component, event, helper) {
    helper.fetchAndRenderCurrentWeekData(component);
},

fetchAndRenderCurrentMonth: function (component, event, helper) {
    helper.fetchAndRenderCurrentMonthData(component);
},

{
    text: 'Day',
    onclick: function () {
        var component = this.series.chart.component;
        
        // Handle Day button click here
        // You can fetch the data from your Apex method and prepare the data
        var action = component.get("c.fetchDataForDay"); // Replace with your actual Apex method
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                
                // Now, prepare data for the chart using a loop
                var ResData = [];
                var chartData = [];
                
                for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    
                    if (shifts.length > 0) {
                        ResData.push({
                            name: resource.Name__c,
                            id: resource.Id
                        });
                    }
                    
                    for (var j = 0; j < shifts.length; j++) {
                        chartData.push({
                            id: shifts[j].Id,
                            start: Date.parse(shifts[j].StartDate_Time__c),
                            end: Date.parse(shifts[j].EndDate_Time__c),
                            y: ResData.length - 1
                        });
                    }1`
                }
                
                // Set y-axis categories
                this.yAxis[0].setCategories(ResData.map(function (resource) {
                    return resource.name;
                }));
                
                // Set series data
                this.series[0].setData(chartData);
            } else {
                console.error("Error fetching data for the current day: " + response.getError());
            }
        });
        $A.enqueueAction(action);
    }
}


public with sharing class YourControllerClass {

    // Define the inner class for ResourceWrapperDayShift
    public class ResourceWrapperDayShift {
        @AuraEnabled public Resource_DE__c resource;
        @AuraEnabled public List<Shifts_DE__c> shifts;

        public ResourceWrapperDayShift(Resource_DE__c resource, List<Shifts_DE__c> shifts) {
            this.resource = resource;
            this.shifts = shifts;
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

        List<Shifts_DE__c> shifts = [SELECT Id, Name, StartDate_Time__c, EndDate_Time__c, ResourceId__c
                                     FROM Shifts_DE__c
                                     WHERE StartDate_Time__c >= :currentDateStart
                                     AND EndDate_Time__c <= :currentDateEnd
                                     AND ResourceId__c IN :resourceToShiftMap.keySet()];

        for (Shifts_DE__c shift : shifts) {
            resourceToShiftMap.get(shift.ResourceId__c).add(shift);
        }

        for (Resource_DE__c resource : resources) {
            List<Shifts_DE__c> shiftsForCurrentResource = resourceToShiftMap.get(resource.Id);

            resourceWrapperList.add(new ResourceWrapperDayShift(resource, shiftsForCurrentResource));
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
}
Highcharts.chart('container', {
    exporting: {
      buttons: {
        contextButton: {
          enabled: true
        },
        dayButton: {
          text: 'Day',
          onclick: function() {
            // Handle the click event for the "Day" button
            var chart = this;
            
            // Make your API call to fetch the data for the day
            // Assuming the data is in the format [{ resource: 'Resource 1', shifts: [...shiftData] }, ...]
            var data = [{ resource: 'Resource 1', shifts: [...] }, { resource: 'Resource 2', shifts: [...] }, ...];
            
            // Process the data to create the series data and resource names
            var seriesData = [];
            var resourceNames = [];
            
            data.forEach(function(item, index) {
              var resource = item.resource;
              var shifts = item.shifts;
              
              if (shifts.length > 0) {
                resourceNames.push(resource);
              }
              
              shifts.forEach(function(shift) {
                seriesData.push({
                  start: Date.parse(shift.StartDate_Time__c),
                  end: Date.parse(shift.EndDate_Time__c),
                  y: index
                });
              });
            });
            
            // Set y-axis categories
            chart.yAxis[0].setCategories(resourceNames);
            
            // Set series data
            chart.series[0].setData(seriesData);
            
            // Set x-axis extremes for the day
            var currentDate = new Date();
            var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
            var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
            chart.xAxis[0].setExtremes(startOfDay, endOfDay);
            
            // Redraw the chart
            chart.redraw();
          }
        }
      }
    },
    plotOptions: {
      series: {
     dataLabels: {
          enabled: true,
          formatter: function() {
            return this.series.chart.options.resourceNames[this.y];
          }
        }
      }
    },
    series: [{
      data: [1, 2, 3, 4, 5] // Example data
    }],
    resourceNames: ['Resource 1', 'Resource 2', 'Resource 3', 'Resource 4', 'Resource 5'] // Example resource names
  });


  Added alert in code--------->
    /*weekButton: {
                text: 'Week',
                onclick: function () {
                  
		//var chart = this;
    var action = component.get("c.fetchCurrentWeekShifts");
//this.update();                    
		alert('Update week view');
                    this.redraw();
    action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
			
            var data = response.getReturnValue();
			console.log("Week data",data);
            var ResData = [];
		var newchartData = [];
      
      
for (var i = 0; i < data.length; i++) {
      var resource = data[i].resource;
      var shifts = data[i].shifts;
		
        if(shifts.length > 0){
             ResData.push({
        name: resource.Name__c,
        id: resource.Id
      });
        }
            
   
      for (var j = 0; j < shifts.length; j++) {
          
          newchartData.push({
          //resid :resource.Id,
         //name: resource.Name,
          id:shifts[j].Id,
  
         start: Date.parse(shifts[j].StartDate_Time__c),
         end: Date.parse(shifts[j].EndDate_Time__c),
          y: ResData.length - 1
       
        });
  
    }
    }

            // Set y-axis categories
                this.yAxis[0].setCategories(ResData.map(function (resource) {
                    return resource.name;
                }));
             /*chart.update({
                        series: [{
								
                            data: chartData
                                // Updated data for the series
                            
                        }]
                    });
            
                 // Set series data
               this.series[0].setData(newchartData);
            	this.update();
        } else {
            console.error("Error fetching data for the current day: " + response.getError());
        }
    });
    $A.enqueueAction(action);
				 var currentDate = new Date();
				var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                  var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
				 this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());		
                    this.redraw();
                }
              }*/