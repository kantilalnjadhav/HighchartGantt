import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


export default class NevigationtoPassengerNewPage extends LightningElement {
    navigateToNewRecordPage() {
        // Opens the new Account record modal
        // to create an Account.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Passenger_Detail_DE__c',
                actionName: 'new'
            }
        });
    }


}