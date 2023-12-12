({
   // doInit: function(component, event, helper) {
        // Initiate any logic you might need on component initialization
   // },
    
    showShiftChart : function(component, event, helper){

        component.set("v.displayShiftGantt", true);
        component.set("v.displayAppointmentGantt", false);
        component.set("v.displayshiftAppointment", false);
        

    },
    showAppointmentChart : function(component, event, helper){

        component.set("v.displayShiftGantt", false);
        component.set("v.displayAppointmentGantt", true);
        component.set("v.displayshiftAppointment", false);
        

    },
    showShiftApptChart : function(component, event, helper){
        component.set("v.displayShiftGantt", false);
        component.set("v.displayAppointmentGantt", false);
        component.set("v.displayshiftAppointment", true);
    }

})
