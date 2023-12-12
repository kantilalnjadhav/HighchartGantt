({

    /*initChart: function (component, event, helper) {
        console.log('entered');
        // Use the action queue to call the four Apex methods in sequence
        var actionQueue = [];
        
        // Define a function to execute each action and store the result
        function executeAction(actionName) {
            return new Promise(function (resolve, reject) {
                var action = component.get(actionName);
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        resolve(response.getReturnValue());
                    } else {
                        reject(response.getError());
                    }
                });
                $A.enqueueAction(action);
            });
        }

        // Add the actions to the queue
        actionQueue.push(executeAction("c.fetchResourceAndShifts"));
        //actionQueue.push(executeAction("c.fetchCurrentDayShifts"));
        //actionQueue.push(executeAction("c.fetchCurrentWeekShifts"));
        //actionQueue.push(executeAction("c.fetchCurrentMonthShifts"));

        // Execute all actions in the queue
        Promise.all(actionQueue)
            .then(function (results) {
                // 'results' is an array containing the results from each Apex method
                console.log('results', results);
                var data = results[0];
console.log('got data', data);
                // Pass the 'data' variable to the helper function
                helper.drawChart(component, data);
            })
            .catch(function (errors) {
                console.error("Error calling Apex methods: " + errors);
            });
    },*/


    
    
    initChart: function(component, event, helper) {
        var action = component.get("c.fetchResourceAndShifts");

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                
                var userTimeZoneAction = component.get("c.fetchCurrentUserTimeZone");
                userTimeZoneAction.setCallback(this, function(userTimeZoneResponse){
                    var timeZoneState = userTimeZoneResponse.getState();
                     if (timeZoneState === "SUCCESS") {
                        var userTimeZone = userTimeZoneResponse.getReturnValue();
                         
                      
                        // Pass the user's timezone to the helper function
                       helper.drawChart(component, userTimeZone, data);
                         
                    }
                     else {
                        console.error("Error fetching user's timezone: " + userTimeZoneResponse.getError());
                    }
                    
                });
                 $A.enqueueAction(userTimeZoneAction);
                
                //helper.drawChart(component, data);
            } else {
                console.error("Error fetching data: " + response.getError());
            }
        });
       

        $A.enqueueAction(action);
         
        
    },
 
  	
    
   OpenEventPopup : function(component, event, helper) {		
        var modalFade1 = component.find('eventPopId');    
        component.find("eventPopId").submitDR(modalFade1);
	}, 
    
     /* handleCheckboxChange: function (component, event, helper) {
        const isChecked = event.getSource().get("v.checked");
        console.log("isChecked", isChecked);
        // Update the isDayCheckboxChecked attribute
        component.set("v.isDayCheckboxChecked", isChecked);
        //console.log("isChecked", component.set("v.isDayCheckboxChecked", isChecked));
        // Update the chart based on the checkbox value
        helper.drawChart(component);
    },*/
		
	

 

    
 
   
})