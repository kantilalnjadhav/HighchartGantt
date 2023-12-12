({
    closePopup: function (component) {
        var modalFade = component.find('modalFade');
        var modalBackdrop = component.find('modalBackdrop');
    
        $A.util.removeClass(modalFade, 'slds-fade-in-open');
        $A.util.removeClass(modalBackdrop, 'slds-backdrop_open');
    },

    showConfirmationToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
             "title": "Success!",
             "type" : 'success',
            "mode" : 'dismissible',
            "duration" : 5000,
            "message": "The shift record has been created successfully."
        });
        toastEvent.fire();
    }

})

