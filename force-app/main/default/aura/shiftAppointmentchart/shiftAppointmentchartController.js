({
    initChart: function(component, event, helper) {
        var action = component.get("c.fetchResourceAndShiftsAndAppointments");

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
		
	openPopup: function(component, event, helper) {
    var point = event.getSource().get("v.value");

    // Get the default values for the record
    var startDate = new Date(point.options.start);
    var endDate = new Date(point.options.end);
    var resource = point.options.resource;

    // Set the default values in the component's attributes
    component.set("v.startDate", startDate);
    component.set("v.endDate", endDate);
    component.set("v.resource", resource);

    // Show the popup
    var popup = component.find("popup");
    $A.util.removeClass(popup, "hidden");
  },

  saveRecord: function(component, event, helper) {
    // Get the updated values from the component's attributes
    var startDate = component.get("v.startDate");
    var endDate = component.get("v.endDate");
    var resource = component.get("v.resource");

    // Close the popup
    var popup = component.find("popup");
    $A.util.addClass(popup, "hidden");
  },

  cancelEdit: function(component, event, helper) {
    // Close the popup without saving changes
    var popup = component.find("popup");
    $A.util.addClass(popup, "hidden");
  },

 

    
 
   
})