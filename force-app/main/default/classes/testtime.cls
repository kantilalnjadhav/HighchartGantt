     
       contextButton: {
                                    enabled: true,
                                },
      dayButton: 
                                        {
      								 text: 'Active Resources Day',
									 onclick: function () {
                                                console.log("Day button click");
                                                var action = component.get("c.fetchResourceAndShifts");
                                                //this.update();
                                                // alert('Update day view');
                                                action.setCallback(this, function (response) {
                                                    var state = response.getState();
                                                    if (state === "SUCCESS") {
                                                        
                                                        var data = response.getReturnValue();
                                                        console.log("Day data",data);
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
                                                        this.series[0].update({
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                         
                											 // Set series data
               												 //this.series[0].setData(newchartData);
                                                    
														console.log('updating');
                                             			   var currentDate = new Date();
                                                        var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
                                                        var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
                                                        this.xAxis[0].setExtremes(startOfDay, endOfDay);
                                                        this.update();
                                                        this.redraw();
                                                       

                                                    } else {
                                                        console.error("Error fetching data for the current day: " + response.getError());
                                                    }
                                                });
                                                $A.getCallback(function() {
                                                    $A.enqueueAction(action);
                                                })();
                                                
                                                
                                                
                                            }
                                        },
                                    
                                   
                                    weekButton: 
                                        {
      								 text: 'Week',
                                      onclick: function () {
                                              var action = component.get("c.fetchResourceAndShifts");
                                                    
                                                    action.setCallback(this, function (response) {
                                                        //console.log("in setcallbak");
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
                                                                        id:shifts[j].Id,
                                                                        start: Date.parse(shifts[j].StartDate_Time__c),
                                                                        end: Date.parse(shifts[j].EndDate_Time__c),
                                                                        y: ResData.length - 1
                                                                    });
                                                                }
                                                            }
                                                           
                                                            this.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            this.series[0].update({
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                             				console.log("draw week view");
                                                           var currentDate = new Date();
                                                            var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                                                            var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
                                                            this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());	
                                                            //this.update();
                                                            this.redraw();
                                                            
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
                                                                                      }
                                         },
                                              monthButton: 
                                        {
      								 text: 'Month',
                                         onclick: function () {
                                              var action = component.get("c.fetchResourceAndShifts");
                                                        //console.log("Month button Click2")
                                                        action.setCallback(this, function (response) {
                                                            var state = response.getState();
                                                            if (state === "SUCCESS") {
                                                                
                                                                var data = response.getReturnValue();
                                                                console.log("Month data",data);
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
                                                                
                                                                console.log('month y axis', this.yAxis);
                                                                // Set y-axis categories
                                                                this.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                    return resource.name;
                                                                }));
                                                                
                                                                // Set series data
                                                                //this.series[0].setData(newchartData);
                                                                this.series[0].update({
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                       			
                                                                var currentDate = new Date();
                                                                var startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                                                var endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                                                                this.xAxis[0].setExtremes(startOfMonth.getTime(), endOfMonth.getTime());
                                                                this.update();
                                                                this.redraw();
                                                            } else {
                                                                console.error("Error fetching data for the current day: " + response.getError());
                                                            }
                                                        });
                                                        $A.getCallback(function() {
                                                            $A.enqueueAction(action);
                                                        })();
                                         }
                                        },
                    		  