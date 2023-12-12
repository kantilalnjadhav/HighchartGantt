import { LightningElement, track } from 'lwc';
import createShifts from '@salesforce/apex/ShiftCreationController.createShifts';


export default class CreateMultiShiftRecords extends LightningElement {
    @track startDateTime;
    @track endDateTime;
    @track selectedDays = [];
    daysOptions = [
        { label: 'Sunday', value: 'Sun' },
        { label: 'Monday', value: 'Mon' },
        { label: 'Tuesday', value: 'Tue' },
        { label: 'Wednesday', value: 'Wed' },
        { label: 'Thursday', value: 'Thu' },
        { label: 'Friday', value: 'Fri' },
        { label: 'Saturday', value: 'Sat' }
    ];

    handleStartDateTimeChange(event) {
        this.startDateTime = event.target.value;
    }

    handleEndDateTimeChange(event) {
        this.endDateTime = event.target.value;
    }

    handleDaysChange(event) {
        this.selectedDays = event.detail.value;
    }

    createShifts() {
        createShifts({
            startDate: this.startDateTime,
            endDate: this.endDateTime,
            selectedDays: this.selectedDays,
            resourceId: Id.ResourceId__c // Replace with the Id of the Resource record for which shifts will be created.
        })
        .then(result => {
            // Handle success (e.g., show success message).
        })
        .catch(error => {
            // Handle error (e.g., show error message).
        });
    }


}


