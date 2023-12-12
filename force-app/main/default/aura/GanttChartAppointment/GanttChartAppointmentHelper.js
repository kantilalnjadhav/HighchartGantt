({
    drawChart: function (component, userTimeZone, data) {
      var chartData = [];
    
      var ResData = [];
      console.log("Data", data);
      for (var i = 0; i < data.length; i++) {
        var resource = data[i].resource;
        var Appts = data[i].Appts;

        ResData.push({
          name: resource.Name__c,
          id: resource.Id
        });
  
        for (var j = 0; j < Appts.length; j++) {
  
          chartData.push({
            resid :resource.Id,
            //name: resource.Name,
            //id: resource.Id,
            id: Appts[j].Id,
            start: Date.parse(Appts[j].Scheduled_Start_Date_Time__c),
            end: Date.parse(Appts[j].Scheduled_End_Date_Time__c),
            y: ResData.length - 1
          });
        }
      }
      console.log("All Data",data);
     
      Highcharts.ganttChart({
        chart: {
          renderTo: component.find("ganttContainer").getElement(),
          events: {
            load() {
              //const chart = this,
               // startDate = new Date().getTime(),
                //endDate = chart.xAxis[0].getExtremes().max;
  
              //chart.xAxis[0].setExtremes(startDate, endDate)
              var currentDate = new Date();
  
                    var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
                    var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
  
                    this.xAxis[0].setExtremes(startOfDay, endOfDay);
            }
          }
  
        },
  
  
        title: {
          text: "Resource Appointment Chart"
        },
        time: {
          //timezone: 'America/New_York', // Set the desired timezone here
          timezone: userTimeZone,
  		    useUTC: false,
      },

      plotOptions: {
        series: {
          dragDrop: {
            draggableX: true,
            dragPrecisionX: 1000 * 1800,
            draggableY: true
          },
            dataLabels: {
        enabled: true,
        align: 'center',
        formatter: function() {
          // Display the resource name as the data label
          return ResData[this.point.y].name;
        }
      },

point: {
    events: {
        drop: function(e) {
            const time = this.series.chart.time;
            const ApptId = this.id;
            const newResourceId = ResData[this.y].id; // Get the resource ID from the y-axis
            console.log('point', e.newPoint);
            // Check if it's a horizontal bar drop (x-axis) or resource drop (y-axis)
            if (e.newPoint.y !== this.y) {
                // It's a horizontal bar drop (x-axis)
                const start = time.dateFormat("%m/%d/%Y %H:%M", this.start);
               const end = time.dateFormat("%m/%d/%Y %H:%M", this.end);

                console.log(component);
                var action = component.get("c.updateAppointmentRecord");
                var updateObject = {
                  ApptId: ApptId,
                    newStartDateTime: start,
                    newEndDateTime: end,
                    newResourceId: newResourceId
                };

                console.log(JSON.stringify(updateObject));
                action.setParams({ "ApptId": ApptId, "newStartDateTime": start, "newEndDateTime": end, "newResourceId": newResourceId });
                console.log("shift", ApptId);
                console.log("start", start);
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var responseMessage = response.getReturnValue();
                        console.log(responseMessage);
                     
                    }
                    var responseMessage = response.getReturnValue();
                    console.log(state);
                });

                $A.enqueueAction(action);
            }
            
       
            else {
                
                console.log(component);
                var action = component.get("c.updateResourceForAppointment");
                var updateObject = {
                  ApptId: ApptId,
                    newResourceId: newResourceId
                };

                console.log(JSON.stringify(updateObject));
                action.setParams({ "ApptId": ApptId, "newResourceId": newResourceId });
                console.log("shift", ApptId);
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var responseMessage = response.getReturnValue();
                        console.log(responseMessage);
                      
                    }
                    var responseMessage = response.getReturnValue();
                    console.log(state);
                });

                $A.enqueueAction(action);
            }
        }
    }
}
    
        }
      },

        xAxis: [{
          type: 'datetime',
   
    labels: {
       dateTimeLabelFormats: {
      hour: '%I:%M %p' // 12-hour clock format with AM/PM
    }
      
  },
  currentDateIndicator: true,
          minTickInterval: 24,

},
{
startOfWeek: 0,
}],

yAxis: {
  type: 'category',

  categories: ResData.map(function(resource) {
    return resource.name;
  }),
  labels: {
    formatter: function() {
      return this.value; // Display resource name
    }
  }
},
  
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                {
                  text: 'Day',
                  onclick: function () {
                    var currentDate = new Date();
  
  
                    var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
                    var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
  
                    // Set x-axis range to current day from 12am to 12pm
                    this.xAxis[0].setExtremes(startOfDay, endOfDay);
                    
                  }
  
                }, {
                  text: 'Week',
                  onclick: function () {
                    var currentDate = new Date();
  
                    // Get the start and end dates of the current week
                    var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                    var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
  
                    // Set x-axis range to current week
                    this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());
                    this.redraw();
                  }
                }, {
                  text: 'Month',
                  onclick: function () {
                    var currentDate = new Date();
  
                    // Get the start and end dates of the current month
                    var startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    var endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
                    // Set x-axis range to current month
                    this.xAxis[0].setExtremes(startOfMonth.getTime(), endOfMonth.getTime());
                    this.redraw();
                  }
                }
              ]
            }
          }
        },
  
        series: [{
          
          name: "Appointment",
          data: chartData
        }],
  
      });
  
    }
  
  
  })
  
  