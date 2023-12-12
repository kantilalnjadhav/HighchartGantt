({
    
    drawChart: function (component, userTimeZone, data) {
        //console.log("data ",data);
       
        var ResData = [];
        var chartData = [];
        
        
        for (var i = 0; i < data.length; i++) {
            var resource = data[i].resource;
            var shifts = data[i].shifts;
            
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
                    id:shifts[j].Id,
                    
                    start: Date.parse(shifts[j].StartDate_Time__c),
                    end: Date.parse(shifts[j].EndDate_Time__c),
                    y: ResData.length - 1
                    
                });
                
            }
        }
 
        console.log("chartdata all", chartData);
        
        var chart = Highcharts.ganttChart({
            chart: {
                
                renderTo: component.find("ganttContainer").getElement(),
                events: {
                    
                    load() {
                    
                    var action = component.get("c.fetchCurrentDayShifts");
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
                                                       	this.redraw();
														this.update();
                                                        this.redraw();
                                                       

                                                    } else {
                                                        console.error("Error fetching data for the current day: " + response.getError());
                                                    }
                                                });
                                                $A.getCallback(function() {
                                                    $A.enqueueAction(action);
                                                })();


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
            var action = component.get("c.fetchResourceAndShifts");
                                                    
                                                    action.setCallback(this, function (response) {
                                                       
                                                        var state = response.getState();
                                                        if (state === "SUCCESS") {
                                                            var data = response.getReturnValue();
                                                            console.log("day data",data);
                                                          
                                                            var ResData = [];
                                                            var newchartData = [];
                                                            
                                                            for (var i = 0; i < data.length; i++) {
                                                                var resource = data[i].resource;
                                                                var shifts = data[i].shifts;
                                                                
                                                               // if(shifts.length > 0){
                                                                    ResData.push({
                                                                        name: resource.Name__c,
                                                                        id: resource.Id
                                                                    });
                                                                //}
                                                                
                                                                for (var j = 0; j < shifts.length; j++) {
                                                                    newchartData.push({
                                                                        id:shifts[j].Id,
                                                                        start: Date.parse(shifts[j].StartDate_Time__c),
                                                                        end: Date.parse(shifts[j].EndDate_Time__c),
                                                                        y: ResData.length - 1
                                                                    });
                                                                }
                                                            }
                                                           console.log('update y axies');
                                                            chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            console.log('update series');
                                                            chart.series[0].update({                            
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                            
              										  //activeResourcesCheckbox.checked = false;
                                             			
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
        } else if (chart.xAxis[0].getExtremes().min === startOfWeek.getTime() && chart.xAxis[0].getExtremes().max === endOfWeek.getTime()) {
            console.log('All active resource week');
            var action = component.get("c.fetchResourceAndShifts");
                                                    
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
                                                                
                                                               // if(shifts.length > 0){
                                                                    ResData.push({
                                                                        name: resource.Name__c,
                                                                        id: resource.Id
                                                                    });
                                                                //}
                                                                
                                                                for (var j = 0; j < shifts.length; j++) {
                                                                    newchartData.push({
                                                                        id:shifts[j].Id,
                                                                        start: Date.parse(shifts[j].StartDate_Time__c),
                                                                        end: Date.parse(shifts[j].EndDate_Time__c),
                                                                        y: ResData.length - 1
                                                                    });
                                                                }
                                                            }
                                                           console.log('update y axies');
                                                            chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            console.log('update series');
                                                            chart.series[0].update({                            
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                            
              										  //activeResourcesCheckbox.checked = false;
                                             			
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
        }
            else if(chart.xAxis[0].getExtremes().min === startOfMonth.getTime() && chart.xAxis[0].getExtremes().max === endOfMonth.getTime()){
                console.log('All active resource of month');
                 console.log('All active resource month');
            var action = component.get("c.fetchResourceAndShifts");
                                                    
                                                    action.setCallback(this, function (response) {
                                                       
                                                        var state = response.getState();
                                                        if (state === "SUCCESS") {
                                                            var data = response.getReturnValue();
                                                            console.log("month data",data);
                                                          
                                                            var ResData = [];
                                                            var newchartData = [];
                                                            
                                                            for (var i = 0; i < data.length; i++) {
                                                                var resource = data[i].resource;
                                                                var shifts = data[i].shifts;
                                                                
                                                               // if(shifts.length > 0){
                                                                    ResData.push({
                                                                        name: resource.Name__c,
                                                                        id: resource.Id
                                                                    });
                                                                //}
                                                                
                                                                for (var j = 0; j < shifts.length; j++) {
                                                                    newchartData.push({
                                                                        id:shifts[j].Id,
                                                                        start: Date.parse(shifts[j].StartDate_Time__c),
                                                                        end: Date.parse(shifts[j].EndDate_Time__c),
                                                                        y: ResData.length - 1
                                                                    });
                                                                }
                                                            }
                                                           console.log('update y axies');
                                                            chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            console.log('update series');
                                                            chart.series[0].update({                            
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                            
              										  //activeResourcesCheckbox.checked = false;
                                             			
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
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
            var action = component.get("c.fetchCurrentDayShifts");
                                                //this.update();
                                                // alert('Update day view');
                                                action.setCallback(this, function (response) {
                                                    var state = response.getState();
                                                    if (state === "SUCCESS") {
                                                        
                                                        var data = response.getReturnValue();
                                                        console.log("Day data",data);
                                                        var ResData = [];
                                                        var newchartData = [];
                                                        
                                                        var currentDay = new Date();
                                                        var startOfDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), 0, 0, 0).getTime();
                                                        var endOfDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), 23, 59, 59).getTime()
                                                        
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
                                                        chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                            return resource.name;
                                                        }));
                                                        chart.series[0].update({
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                         //chart.xAxis[0].setExtremes(null, null);
                											 // Set series data
               												 //this.series[0].setData(newchartData);
                                                    
														console.log('updating');
                                             			   var currentDate = new Date();
                                                        var startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0).getTime();
                                                        var endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
                                                        chart.xAxis[0].setExtremes(startOfDay, endOfDay);
                                                       	
                                                        chart.update();
                                                        chart.redraw();
                                                     

                                                    } else {
                                                        console.error("Error fetching data for the current day: " + response.getError());
                                                    }
                                                });
                                                $A.getCallback(function() {
                                                    $A.enqueueAction(action);
                                                })();
        } else if (chart.xAxis[0].getExtremes().min === startOfWeek.getTime() && chart.xAxis[0].getExtremes().max === endOfWeek.getTime()) {
            console.log('All current resource of week');
            var action = component.get("c.fetchCurrentWeekShifts");
                                                    
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
                                                            console.log('setting data');
                                                            console.log('yaxis', this);
                                                            chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            chart.series[0].update({
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                            //this.series[0].setData(newchartData);
                                                   
                                                            
                                                            /*console.log('updating');
                                                            var currentDate = new Date();
                                                            var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                                                            var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
                                                            this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());	
                                                            this.update();
                                                            this.redraw();*/
                                                            
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
        } 
            else if(chart.xAxis[0].getExtremes().min === startOfMonth.getTime() && chart.xAxis[0].getExtremes().max === endOfMonth.getTime()){
                console.log('All current resource of month');
                 var action = component.get("c.fetchCurrentMonthShifts");
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
                                                                
                                                                
                                                                // Set y-axis categories
                                                                chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                    return resource.name;
                                                                }));
                                                                
                                                                // Set series data
                                                                //this.series[0].setData(newchartData);
                                                                chart.series[0].update({
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                       			
                                                                /*var currentDate = new Date();
                                                                var startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                                                var endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                                                                
                                                                if (startOfMonth.getDay() !== 0) {
   									 // If the start of the month is not a Sunday, adjust the start to the previous Sunday
   											 startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - startOfMonth.getDay());
												}

												// Check if the end of the month falls in the middle of the week
										if (endOfMonth.getDay() !== 7) {
  														  // If the end of the month is not a Saturday, adjust the end to the next Saturday
   														 endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 7 - endOfMonth.getDay());
										}
                                                                
                                                                this.xAxis[0].setExtremes(startOfMonth.getTime(), endOfMonth.getTime());
                                                               	this.redraw();
                                                                this.update();
                                                                this.redraw();*/
                                                            } else {
                                                                console.error("Error fetching data for the current day: " + response.getError());
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
                    var action = component.get("c.fetchResourceAndShiftsbyZtoA");
                                                    
                                                    action.setCallback(this, function (response) {
                                                       
                                                        var state = response.getState();
                                                        if (state === "SUCCESS") {
                                                            var data = response.getReturnValue();
                                                           console.log('Z to A filter', data);
                                                            var ResData = [];
                                                            var newchartData = [];
                                                            
                                                            for (var i = 0; i < data.length; i++) {
                                                                var resource = data[i].resource;
                                                                var shifts = data[i].shifts;
                                                                
                                                               // if(shifts.length > 0){
                                                                    ResData.push({
                                                                        name: resource.Name__c,
                                                                        id: resource.Id
                                                                    });
                                                                //}
                                                                
                                                                for (var j = 0; j < shifts.length; j++) {
                                                                    newchartData.push({
                                                                        id:shifts[j].Id,
                                                                        start: Date.parse(shifts[j].StartDate_Time__c),
                                                                        end: Date.parse(shifts[j].EndDate_Time__c),
                                                                        y: ResData.length - 1
                                                                    });
                                                                }
                                                            }
                                                           console.log('update y axies');
                                                            chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            console.log('update series');
                                                            chart.series[0].update({                            
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                            // Uncheck the checkbox
              										  //allResourcesCheckbox.checked = false;
                                             				
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
                }
                else{
                    console.log('All Active Resources checkbox is Unchecked');
                    console.log('Click the A to Z filter button');
         var action = component.get("c.fetchResourceAndShifts");
                                                    
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
                                                                
                                                               // if(shifts.length > 0){
                                                                    ResData.push({
                                                                        name: resource.Name__c,
                                                                        id: resource.Id
                                                                    });
                                                                //}
                                                                
                                                                for (var j = 0; j < shifts.length; j++) {
                                                                    newchartData.push({
                                                                        id:shifts[j].Id,
                                                                        start: Date.parse(shifts[j].StartDate_Time__c),
                                                                        end: Date.parse(shifts[j].EndDate_Time__c),
                                                                        y: ResData.length - 1
                                                                    });
                                                                }
                                                            }
                                                           console.log('update y axies');
                                                            chart.yAxis[0].setCategories(ResData.map(function (resource) {
                                                                return resource.name;
                                                            }));
                                                            console.log('update series');
                                                            chart.series[0].update({                            
                                                            data: newchartData,
                                                            dataLabels: {
                       										 enabled: true,
                       											 align: 'center',
                       												 formatter: function () {
                            										return ResData[this.point.y].name;
                       										 }
                   											 }
                                                        });
                                                            // Uncheck the checkbox
              										  //getResourcesByAtoZ.checked = false;
                                             				
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
                    
                }
		});
const dayButton = document.getElementById('btn3');
dayButton.addEventListener('click', () =>{
    console.log('Day Button click');
     //var chart = this;
                                                var action = component.get("c.fetchCurrentDayShifts");
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
});
    

const weekButton = document.getElementById('btn2');
weekButton.addEventListener('click', () =>{
    console.log('custom Week button click ');
     var action = component.get("c.fetchCurrentWeekShifts");
                                                    
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
                                                            console.log('setting data');
                                                            console.log('yaxis', this);
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
                                                            //this.series[0].setData(newchartData);
                                                   
                                                            
                                                            console.log('updating');
                                                            var currentDate = new Date();
                                                            var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                                                            var endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
                                                            this.xAxis[0].setExtremes(startOfWeek.getTime(), endOfWeek.getTime());	
                                                            this.update();
                                                            this.redraw();
                                                            
                                                            
                                                        } 
                                                        else {
                                                            console.error("Error fetching data for the current day: " + response.getError());
                                                        }
                                                        
                                                    });
                                                    $A.getCallback(function() {
                                                        $A.enqueueAction(action);
                                                    })();
    
});

const monthButton = document.getElementById('btn1');
monthButton.addEventListener('click', () =>{
    console.log('custom month Button click');
      //var chart = this;
                                                        console.log("Month button Click");
                                                        var action = component.get("c.fetchCurrentMonthShifts");
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
                                                                
                                                                if (startOfMonth.getDay() !== 0) {
   									 // If the start of the month is not a Sunday, adjust the start to the previous Sunday
   											 startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - startOfMonth.getDay());
												}

												// Check if the end of the month falls in the middle of the week
										if (endOfMonth.getDay() !== 7) {
  														  // If the end of the month is not a Saturday, adjust the end to the next Saturday
   														 endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 7 - endOfMonth.getDay());
										}
                                                                
                                                                this.xAxis[0].setExtremes(startOfMonth.getTime(), endOfMonth.getTime());
                                                               	this.redraw();
                                                                this.update();
                                                                this.redraw();
                                                            } else {
                                                                console.error("Error fetching data for the current day: " + response.getError());
                                                            }
                                                        });
                                                        $A.getCallback(function() {
                                                            $A.enqueueAction(action);
                                                        })();
});


const deleteButton = document.getElementById('delete');

deleteButton.addEventListener('click', () => {
    console.log('delete button click ');
    var selectedShiftId = component.get("v.selectedShiftId");
    var action = component.get("c.deleteSelectedShift");
    var deleteshiftobject ={
    IdShiftdlte: selectedShiftId 
};
   action.setParams({ "IdShiftdlte": selectedShiftId});

action.setCallback(this, function (response) {
    var state = response.getState();
    if (state === "SUCCESS") {
        var responseMessage = response.getReturnValue();
        
        console.log("Shift state: " ,state);
        
        
        helper.initChart(component);
        
        
        
    } else {
        console.error("Error deleting shift: " + response.getError());
    }
    this.selectedPoint.remove();		
});

$A.enqueueAction(action);

});

}
},
    
},
    
    
    title: {
        text: "Resource Shift Chart"
    },
        
        time: {
            //timezone: 'America/New_York',
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
                                    style: {
      							fontSize: '10px' // Set the desired font size here
   								 },
                                    formatter: function() {
                                        // Display the resource name as the data label
                                        return ResData[this.point.y].name;
                                        
                                    }
                        },
                            allowPointSelect: true,
                                
                                point: {
                                    events: {
                                        click: function () {
                                            //const chart = this.series.chart;
                                            // chart.selectedShiftId = this.id; // Store the selected shift ID
                                            //component.set("v.selectedShiftId", deshift);
                                            
                                            const chart = this.series.chart;
                                            
                                            this.series.chart.selectedPoint = this.id;
                                            const selectedShiftId= this.series.chart.selectedPoint;
                                            console.log('selected id', selectedShiftId);
                                            component.set("v.selectedShiftId", selectedShiftId);
                                        },
                                            
                                            drop: function(e) {
                                                const time = this.series.chart.time;
                                                const shiftId = this.id;
                                                const newResourceId = ResData[this.y].id; 
                                                console.log('point', e.newPoint);
                                                // Check if it's a horizontal bar drop (x-axis) or resource drop (y-axis)
                                                if (e.newPoint.y !== this.y) {
                                                    // It's a horizontal bar drop (x-axis)
                                                    const start = time.dateFormat("%m/%d/%Y %H:%M", this.start);
                                                    const end = time.dateFormat("%m/%d/%Y %H:%M", this.end);
                                                    
                                                    console.log(component);
                                                    var action = component.get("c.updateShiftRecord");
                                                    var updateObject = {
                                                        shiftId: shiftId,
                                                        newStartDateTime: start,
                                                        newEndDateTime: end,
                                                        newResourceId: newResourceId
                                                    };
                                                    
                                                    console.log(JSON.stringify(updateObject));
                                                    action.setParams({ "shiftId": shiftId, "newStartDateTime": start, "newEndDateTime": end, "newResourceId": newResourceId });
                                                    console.log("shift", shiftId);
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
                                                    var action = component.get("c.updateResourceForShift");
                                                    var updateObject = {
                                                        shiftId: shiftId,
                                                        newResourceId: newResourceId
                                                    };
                                                    
                                                    console.log(JSON.stringify(updateObject));
                                                    action.setParams({ "shiftId": shiftId, "newResourceId": newResourceId });
                                                    console.log("shift", shiftId);
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
                        
                       		align: 'center',
                        dateTimeLabelFormats: {
                            hour: '%I:%M %p', 
                            
                        }
                        
                    },
                    currentDateIndicator: true,
                    //minTickInterval: 3600 * 1000, // 1 hour
                    minTickInterval: 24,
                    
                },
                        {
                            startOfWeek: 0,
                        }],
                    
                    yAxis: {
                        uniqueNames: true,
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
                    /*yAxis: {
    uniqueNames: true,
    type: 'category',
    
    grid: {
        columns: [{
            title: {
                text: 'Resource'
            },
            categories: ResData.map(function(resource) {
                return resource.name;
            }),
            labels: {
        formatter: function() {
            return this.value; // Display resource name
        }
    },
        }, 
                  {
            title: {
                text: 'Department'
            },
            categories: ResData.map(function(resource) {
                return resource.department;
            }),
              labels: {
        formatter: function() {
            return this.value; // Display resource name
        }
    },
        }
        ]
    }
} , */             
                        exporting: {
                            enabled: false,
                        },
                        
                        
                                
                                series: [{
                                    
                                    name: "Shifts",
                                    data: chartData
                                    
                                }],
                                                                            
                        });
                                  
 			var expanded = false;
function showCheckboxes() {
    console.log('Click dropdown');
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
           
                                    
   },
                            
        })