({
    invoke: function(component, event, helper) {
        var navService = component.find("navService");
        var pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Passenger_Detail_DE__c',
                actionName: 'new'
            }
        };
         navService.navigate(pageReference);
    
    }
    
})