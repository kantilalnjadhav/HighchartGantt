import { LightningElement, api, track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from "lightning/navigation";

export default class PassengerDetailFlowWrapper extends NavigationMixin(
    LightningElement
  ) {
    @api recordId;
    @track isModalOpen = true;
	closeAction(){
        this.dispatchEvent(new CloseActionScreenEvent());
        this.isModalOpen = false;
        console.log(recordId);
        console.log(resource);
    }

    handleRequestReturn(event) {
        if (event.detail.status === 'FINISHED') {
            if(this.recordId == undefined) {
                const outputVariables = event.detail.outputVariables;
                console.log('output vars');
                console.log(outputVariables);
                if(outputVariables.length > 0) {
                    this.recordId = outputVariables[0].value;
                }
            }
            console.log(this.recordId);
            this[NavigationMixin.GenerateUrl]({
                type: "standard__recordPage",
                attributes: {
                  recordId: this.recordId,
                  objectApiName: "Passenger_Detail_DE__c",
                  actionName: "view"
                }
              }).then((url) => {
                //we do this because salesforce by default will load the cached unupdated record if using default navigation
                // window.location.href = url;
            });
        }
    }

    get inputVariables() {
        return [
            {
                name: 'PassengerDetail',
                type: 'String',
                value: this.recordId ?? ''
            }
        ];
    }
}