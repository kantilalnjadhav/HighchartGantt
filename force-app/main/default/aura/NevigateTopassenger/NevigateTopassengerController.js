({
    invoke: function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": "a06Dn0000022JTZIA2" ,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },
})