import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';

export default class RedirectToPassengerRecordPage extends NavigationMixin (LightningElement) {
    @api NewRecordId

    navigateToRecord(NewRecordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId :'NewRecordId',
                actionName: 'view'
            }
        });
    }

     /*<handleStatusChange(event) {
        if(event.detail.status === 'FINISHED') {
             const outputVariables = event.detail.outputVariables;
             for(let i= 0; i < outputVariables.length; i++) {
                const outputVar = outputVariables[i];
                if(outputVar.name === 'redirect') {
                    this.navigateToRecord(outputVar.value);
                }
            }
        }
    } */    
}