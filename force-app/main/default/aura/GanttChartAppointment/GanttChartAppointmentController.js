({
    initChart: function(component, event, helper) {
        var action = component.get("c.fetchResourceAndAppointments");

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
    
    
})