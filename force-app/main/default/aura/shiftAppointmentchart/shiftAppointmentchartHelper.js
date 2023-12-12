({
  drawChart: function(component, userTimeZone, data) {
    console.log("data ", data);

    var ResData = [];
    var chartData = [];
    var chartapptData = [];

    for (var i = 0; i < data.length; i++) {
      var resource = data[i].resource;
      var shifts = data[i].shifts;
      var appointments = data[i].appointments;
      //if(shifts.length > 0){
      ResData.push({
        name: resource.Name__c,
        department: resource.Assigned_Location__c,
        id: resource.Id
      });
      //}

      for (var j = 0; j < shifts.length; j++) {
        chartData.push({
          //resid :resource.Id,
          //name: resource.Name,
          name: resource.Name__c,
          id: shifts[j].Id,
          start: Date.parse(shifts[j].StartDate_Time__c),
          end: Date.parse(shifts[j].EndDate_Time__c),
          y: ResData.length - 1
        });
      }
      for (var k = 0; k < appointments.length; k++) {
          var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
        chartapptData.push({
          name: resource.Name__c,
          id: appointments[k].Id,
          start: Date.parse(appointments[k].Scheduled_Start_Date_Time__c),
          end: Date.parse(appointments[k].Scheduled_End_Date_Time__c),
          y: ResData.length - 1 + 0.3,
            color: randomColor
        });
      }
    }
    console.log("ResData", ResData);

    var chart = Highcharts.ganttChart({
      chart: {
        renderTo: component.find("ganttContainer").getElement(),
        height: 2000,
        events: {
          load() {
            
            var action = component.get(
                "c.fetchCurrentDayShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
        
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3
                        //y: ResData.length * 1 - 1
                        //color: getRandomColor()
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  this.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
   					 min: 0,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  this.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  this.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                             
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             // const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newxaxiesResourceId = getNewResourceId(
                              //  resourceName
                            // );

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current day view");
                  // Update the series data

                  var currentDate = new Date();
                  var startOfDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    0,
                    0,
                    0
                  ).getTime();
                  var endOfDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    23,
                    59,
                    59
                  ).getTime();
					this.redraw();
                  this.xAxis[0].setExtremes(startOfDay, endOfDay);
                  this.update();
                  this.redraw();
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
            
           /* var currentDate = new Date();
            var startOfDay = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              0,
              0,
              0
            ).getTime();
            var endOfDay = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              23,
              59,
              59
            ).getTime();
            this.xAxis[0].setExtremes(startOfDay, endOfDay);*/
        
			document.querySelector(".selectBox").addEventListener("click", showCheckboxes);

            
            	const activeResourcesCheckbox = document.getElementById('one');

activeResourcesCheckbox.addEventListener('change', function () {
    var currentDate = new Date();
    var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
    var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
    var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
	var startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Adjust start and end of the month to align with week boundaries
    if (startOfMonth.getDay() !== 0) {
        startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - startOfMonth.getDay());
    }
    if (endOfMonth.getDay() !== 7) {
        endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 7 - endOfMonth.getDay());
    }
    
    if (activeResourcesCheckbox.checked) {
        console.log('All resource checkbox checked');

        if (chart.xAxis[0].getExtremes().min === startOfDay && chart.xAxis[0].getExtremes().max === endOfDay) {
            console.log('All active resource of day');
           
              var action = component.get(
                "c.fetchResourceAndShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3
                        //y: ResData.length * 1 - 1
                        //color: getRandomColor()
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                             				console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                            

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current week view");
                  // Update the series data
                } else {
                    console.error(
                      "Error fetching data for the current day: " +
                        response.getError()
                    );
                  }
                });
  
                $A.getCallback(function() {
                  $A.enqueueAction(action);
                })();
        } else if (chart.xAxis[0].getExtremes().min === startOfWeek.getTime() && chart.xAxis[0].getExtremes().max === endOfWeek.getTime()) {
            console.log('All active resource week');
           var action = component.get(
                "c.fetchResourceAndShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                       
                        color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                             				console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                            

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current week view");
                  // Update the series data
                } else {
                    console.error(
                      "Error fetching data for the current day: " +
                        response.getError()
                    );
                  }
                });
  
                $A.getCallback(function() {
                  $A.enqueueAction(action);
                })();
        }
            else if(chart.xAxis[0].getExtremes().min === startOfMonth.getTime() && chart.xAxis[0].getExtremes().max === endOfMonth.getTime()){
                console.log('All active resource of month');
                 console.log('All active resource month');
             var action = component.get(
                "c.fetchResourceAndShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3
                        //y: ResData.length * 1 - 1
                        //color: getRandomColor()
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                             				console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                            

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current week view");
                  // Update the series data
                } else {
                    console.error(
                      "Error fetching data for the current day: " +
                        response.getError()
                    );
                  }
                });
  
                $A.getCallback(function() {
                  $A.enqueueAction(action);
                })();
           
            }
            
            else {
            console.log('Unexpected view when checkbox is checked');
        }
    } else {
        console.log('Unchecked the All resource checkbox');

        if (chart.xAxis[0].getExtremes().min === startOfDay && chart.xAxis[0].getExtremes().max === endOfDay) {
            console.log('All current resource of day');
            var action = component.get(
                "c.fetchCurrentDayShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        
				var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                        color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            /*  var modalFade1 = component.find("eventPopId");
                              component.find("eventPopId").submitDR(modalFade1);
                              this.redraw();*/
                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newyResourceId = getNewResourceId(
                              //  resourceName
                              //);
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             // const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newxaxiesResourceId = getNewResourceId(
                              //  resourceName
                            // );

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                 
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
        } else if (chart.xAxis[0].getExtremes().min === startOfWeek.getTime() && chart.xAxis[0].getExtremes().max === endOfWeek.getTime()) {
            console.log('All current resource of week');
            var action = component.get(
                "c.fetchCurrentWeekShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                       color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            /*  var modalFade1 = component.find("eventPopId");
                              component.find("eventPopId").submitDR(modalFade1);
                              this.redraw();*/
                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newyResourceId = getNewResourceId(
                              //  resourceName
                              //);
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                           
                                console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                 
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
        } 
            else if(chart.xAxis[0].getExtremes().min === startOfMonth.getTime() && chart.xAxis[0].getExtremes().max === endOfMonth.getTime()){
                var action = component.get(
                "c.fetchCurrentMonthShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                        color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            /*  var modalFade1 = component.find("eventPopId");
                              component.find("eventPopId").submitDR(modalFade1);
                              this.redraw();*/
                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newyResourceId = getNewResourceId(
                              //  resourceName
                              //);
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             // const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newxaxiesResourceId = getNewResourceId(
                              //  resourceName
                            // );

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                 
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
            }
            else {
            console.log('Unexpected view when checkbox is unchecked');
        }
    }
});
            

			const allResourcesCheckbox = document.getElementById('three');

			allResourcesCheckbox.addEventListener('change', function(){
    			console.log('selected three checkbox');
                if(allResourcesCheckbox.checked){
                  console.log('All Active Resources By Z to A checkbox is checked');  
                    var action = component.get("c.fetchResourceAndShiftsAndAppointmentsztoa");
                   
              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                       color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             
							  console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
									
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });
								
                            	
                                  
                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                      
										setTimeout(() => {
                                            console.log('updated with refresh');
                                            
   										    this.redraw();
                                            console.log('updated with refresh 2');
                                           
									}, 900);			
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                  
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                      			
					                              }
                                
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
				
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
                               
                                                   
                }
                else{
                    console.log('All Active Resources checkbox is Unchecked');
                    console.log('Click the A to Z filter button');
         var action = component.get("c.fetchResourceAndShiftsAndAppointments");
                                                    
                                                   
              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                       color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  chart.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  chart.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  chart.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             
							  console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
									
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });
								
                            	
                                  
                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                      
										setTimeout(() => {
                                            console.log('updated with refresh');
                                            
   										    this.redraw();
                                            console.log('updated with refresh 2');
                                           
									}, 900);			
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                  
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                      			
					                              }
                                
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
				
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
                    
                }
		});


            const dayButton = document.getElementById("btn3");
            dayButton.addEventListener("click", () => {
              console.log("Day Button click");
              var action = component.get(
                "c.fetchCurrentDayShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                       color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  this.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  this.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  this.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             
							  console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
									
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });
								
                            	
                                  
                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                      
										setTimeout(() => {
                                            console.log('updated with refresh');
                                            
   										    this.redraw();
                                            console.log('updated with refresh 2');
                                           
									}, 900);			
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                  
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                      			
					                              }
                                
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current day view");
                  // Update the series data
              

             
                  var currentDate = new Date();
                  var startOfDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    0,
                    0,
                    0
                  ).getTime();
                  var endOfDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    23,
                    59,
                    59
                  ).getTime();
					this.redraw();
                  this.xAxis[0].setExtremes(startOfDay, endOfDay);
                  this.update();
                  this.redraw();
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
            });

		const weekButton = document.getElementById("btn2");
            weekButton.addEventListener("click", () => {
              console.log("week Button click");
              var action = component.get(
                "c.fetchCurrentWeekShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("Day data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        //y: ResData.length * 2 - 2
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3
                        //y: ResData.length * 1 - 1
                        //color: getRandomColor()
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  this.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  this.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  this.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            /*  var modalFade1 = component.find("eventPopId");
                              component.find("eventPopId").submitDR(modalFade1);
                              this.redraw();*/
                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newyResourceId = getNewResourceId(
                              //  resourceName
                              //);
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             // const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newxaxiesResourceId = getNewResourceId(
                              //  resourceName
                            // );

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current week view");
                  // Update the series data

                  var currentDate = new Date();
                  var startOfWeek = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - currentDate.getDay()
                  );
                  var endOfWeek = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - currentDate.getDay() + 7
                  );
                  chart.xAxis[0].setExtremes(
                    startOfWeek.getTime(),
                    endOfWeek.getTime()
                  );
                  chart.update();
                  chart.redraw();
                } else {
                  console.error(
                    "Error fetching data for the current day: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
            });	

			 const monthButton = document.getElementById("btn1");
           monthButton.addEventListener("click", () => {
              console.log("month Button click");
              var action = component.get(
                "c.fetchCurrentMonthShiftsAndAppointments"
              );

              action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                  var data = response.getReturnValue();
                  console.log("month data", data);
                  var ResData = [];
                  var chartData = [];
                  var chartapptData = [];

                  for (var i = 0; i < data.length; i++) {
                    var resource = data[i].resource;
                    var shifts = data[i].shifts;
                    var appointments = data[i].appointments;

                    ResData.push({
                      name: resource.Name__c,
                      department: resource.Assigned_Location__c,
                      id: resource.Id
                    });

                    for (var j = 0; j < shifts.length; j++) {
                      chartData.push({
                        name: resource.Name__c,
                        id: shifts[j].Id,
                        start: Date.parse(shifts[j].StartDate_Time__c),
                        end: Date.parse(shifts[j].EndDate_Time__c),
                        y: ResData.length - 1
                        
                      });
                    }

                    for (var k = 0; k < appointments.length; k++) {
                        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); 
                      chartapptData.push({
                        name: resource.Name__c,
                        id: appointments[k].Id,
                        start: Date.parse(
                          appointments[k].Scheduled_Start_Date_Time__c
                        ),
                        end: Date.parse(
                          appointments[k].Scheduled_End_Date_Time__c
                        ),
                        y: ResData.length - 1 + 0.3,
                       color: randomColor
                      });
                    }
                  }

                  //chart.update({
                  // chart: {
                  //  height: 900
                  // }
                  //});
                  this.update({
                    yAxis: {
                      uniqueNames: true,
                      draggableY: true,
                      max: ResData.length - 1,
                      type: "category",
                      categories: ResData.map(function(resource) {
                        return resource.name;
                      }),
                         labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
                      scrollbar: {
                        enabled: true
                      }
                    }
                  });

                  this.update({
                    plotOptions: {
                      bar: {
                        grouping: true,

                        pointPadding: 0.2, // Adjust the point padding
                        groupPadding: 0.2 // Adjust the group padding
                      },
                      series: {
                        pointWidth: 35,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        allowPointSelect: true
                      }
                    }
                  });

                  this.update({
                    series: [
                      {
                        name: "Shifts",
                        data: chartData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800
                        },
                        //pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              console.log("isclicked");
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );


                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const shiftId = this.id;
                              const newsResourceId = ResData[this.y].id;
                             
								console.log("shiftId id", shiftId);
                              console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
						 if (e.newPoint.y !== this.y) {
                                console.log("shift exstended on x-axies");
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateShiftRecord"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                  //newResourceId: newResourceId
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  shiftId: shiftId,
                                  newStartDateTime: start,
                                  newEndDateTime: end,
                                 // newResourceId: newResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                console.log("shift move on Y-axies");
								console.log("newsResourceId id", newsResourceId);
                               // console.log("newyResourceId id", newsResourceId);
                                // It's a resource drop (y-axis)
                                var action = component.get(
                                  "c.updateResourceForShift"
                                );
                                var updateObject = {
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                };

                                action.setParams({
                                  shiftId: shiftId,
                                  newResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              }
                            }
                          }
                        },
                       /* dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        } */
                      },
                      {
                        name: "Appointments",
                        data: chartapptData,
                        pointWidth: 25,
                        dragDrop: {
                          draggableX: true,
                          dragPrecisionX: 1000 * 1800,
                          draggableY: true,
                          dragPrecisionY: 1
                          //dragPrecisionY: 1000 * 1800,
                        },
                        // pointWidth: 20,
                        allowPointSelect: true,
                        point: {
                          events: {
                            click: function() {
                              const chart = this.series.chart;
                              this.series.chart.selectedPoint = this.id;
                              const selectedShiftId = this.series.chart
                                .selectedPoint;
                              console.log("selected id", selectedShiftId);
                              component.set(
                                "v.selectedShiftId",
                                selectedShiftId
                              );

                            },
                            drop: function(e) {
                              const time = this.series.chart.time;
                              const apptId = this.id;
                             // const newsResourceId = ResData[this.y].id;
                              //const resourceName = this.name; // Use the name property
                             // const newxaxiesResourceId = getNewResourceId(
                              //  resourceName
                            // );

                              console.log("apptId ", apptId);
                          
                              if (e.newPoint.y !== this.y) {
                                // It's a horizontal bar drop (x-axis)
                                const start = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.start
                                );
                                const end = time.dateFormat(
                                  "%m/%d/%Y %H:%M",
                                  this.end
                                );

                                var action = component.get(
                                  "c.updateApptRecord"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                  
                                };

                                console.log(JSON.stringify(updateObject));
                                action.setParams({
                                  apptId: apptId,
                                  newStartApptDateTime: start,
                                  newEndApptDateTime: end,
                                 
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
									
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                              } else {
                                  const newsResourceId = ResData[this.y].id;
                                console.log("Appointment Drop vertically");
								
                                  console.log("newsResourceId", newsResourceId);
                                var action = component.get(
                                  "c.updateResourceForAppointments"
                                );
                                var updateObject = {
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                };

                                action.setParams({
                                  apptId: apptId,
                                  newyaxiesResourceId: newsResourceId
                                });

                                action.setCallback(this, function(response) {
                                  var state = response.getState();
                                  if (state === "SUCCESS") {
                                    var responseMessage = response.getReturnValue();
                                    console.log(responseMessage);
                                 
                                      
                                  }
                                  var responseMessage = response.getReturnValue();
                                });
										
                                $A.getCallback(function() {
                                  $A.enqueueAction(action);
                                })();
                                  
                              }
                            }
                          }
                        },
                        /*dataLabels: {
                          enabled: true,
                          formatter: function() {
                            return this.series.name === "Shifts"
                              ? "Shift"
                              : "Appointment";
                          }
                        }*/
                      }
                    ]
                  });
					
                  console.log("start updating current month view");
                 var currentDate = new Date();
                  var startOfMonth = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                  );
                  var endOfMonth = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    0
                  );

                  if (startOfMonth.getDay() !== 0) {
                    // If the start of the month is not a Sunday, adjust the start to the previous Sunday
                    startOfMonth = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      1 - startOfMonth.getDay()
                    );
                  }

                  // Check if the end of the month falls in the middle of the week
                  if (endOfMonth.getDay() !== 7) {
                    // If the end of the month is not a Saturday, adjust the end to the next Saturday
                    endOfMonth = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      7 - endOfMonth.getDay()
                    );
                  }

                  chart.xAxis[0].setExtremes(
                    startOfMonth.getTime(),
                    endOfMonth.getTime()
                  );
                  chart.redraw();
                  chart.update();
                  chart.redraw();
                 
                } else {
                  console.error(
                    "Error fetching data for the current month: " +
                      response.getError()
                  );
                }
              });

              $A.getCallback(function() {
                $A.enqueueAction(action);
              })();
            });

          }
        }
      },
      title: {
        text: "Resource Shift/Appointment Chart"
      },
      time: {
        timezone: userTimeZone,
        useUTC: false
        //timezone: "America/New_York"
      },
      xAxis: [
        {
          type: "datetime",
          labels: {
            align: "center",
            dateTimeLabelFormats: {
              hour: "%I:%M %p"
            }
          },
          currentDateIndicator: true,
          minTickInterval: 24
        },
        {
          startOfWeek: 0
        }
      ],
      yAxis: {
        uniqueNames: true,
        draggableY: true,
            min: 0,
        max: ResData.length - 1,
        type: "category",
        categories: ResData.map(function(resource) {
          return resource.name;
        }),
             labels: {
                                        formatter: function() {
                                            return this.value; // Display resource name
                                        }
                                    },
        scrollbar: {
          enabled: true
        }
        //labels: {
        //formatter: function() {
        // return this.value; // Display resource name
        //}
        //}
      },

      
      exporting: {
        enabled: false
      },
      plotOptions: {
        bar: {
          grouping: true,

          pointPadding: 0.2, // Adjust the point padding
          groupPadding: 0.2 // Adjust the group padding
        },
        //series: {
        //intWidth: 25,
        series: {
          dragDrop: {
            draggableX: true,
            dragPrecisionX: 1000 * 1800,
            draggableY: true
            //dragPrecisionY: 1000 * 1800,
          },
          allowPointSelect: true
        }
      },
      series: [
        {
          name: "Shifts",
          draggableY: true,
          draggableX: true,
          data: chartData,
          pointWidth: 25
        },
        {
          name: "Appointments",
          data: chartapptData,
          draggableY: true,
          draggableX: true,
          pointWidth: 25
        }
      ]
      
    });
  
    var expanded = false;
    function showCheckboxes() {
      console.log("Click dropdown");
      var checkboxes = document.getElementById("checkboxes");
      if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
      } else {
        checkboxes.style.display = "none";
        checkboxes.style.right = "0";
        expanded = false;
      }
    }
  }
});