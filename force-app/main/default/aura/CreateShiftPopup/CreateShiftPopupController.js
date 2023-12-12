({
	openEventPopup : function(component, event, helper) {
        

		var modalFade = component.find('modalFade');
        var modalBackdrop = component.find('modalBackdrop');
 
        $A.util.addClass(modalFade,'slds-fade-in-open');
        $A.util.addClass(modalBackdrop,'slds-backdrop_open');
        
        console.log('Calling getAvailableResources method');

        var action = component.get("c.getAvailableResources");

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Handle the response and set the component attribute
                var resources = response.getReturnValue();
                component.set("v.resources", resources);
            } else {
                console.error("Error fetching resources: " + response.getError());
            }
        });
        $A.enqueueAction(action);
	},
   
    closeEventPopup : function(component, event, helper) {
		var modalFade = component.find('modalFade');
        var modalBackdrop = component.find('modalBackdrop');
 
        $A.util.removeClass(modalFade,'slds-fade-in-open');
        $A.util.removeClass(modalBackdrop,'slds-backdrop_open');
	},    
    
    saveShift: function(component, event, helper) {
        // Retrieve input values
        var startDate = component.find("startDateInput").get("v.value");
        var endDate = component.find("endDateInput").get("v.value");
        var selectedResource = component.get("v.selectedResource");
        

        // Create a new shift record
        var action = component.get("c.createShiftRecord");
        action.setParams({
            startDate: startDate,
            endDate: endDate,
            resourceId: selectedResource
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Shift record created successfully, you can handle any success logic here
                console.log("Shift record created successfully");

                component.find("startDateInput").set("v.value", "");
                component.find("endDateInput").set("v.value", "");
                component.set("v.selectedResource", "");
                // Close the popup
                helper.closePopup(component);
                
                helper.showConfirmationToast(component);

                /*component.find("navigationService").navigate({ 
                    type: "standard__webPage", 
                    attributes: { 
                        url: '/lightning/n/Dispatcher_view' 
                    } 
                });*/

            } else {
                // Handle any errors here
                console.error("Error creating shift record: " + response.getError());
            }
           // $A.get("e.force:refreshView").fire();
            
           
        });

        $A.enqueueAction(action);
    }

    
})



