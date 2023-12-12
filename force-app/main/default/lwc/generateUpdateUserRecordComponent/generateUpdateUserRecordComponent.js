import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import API_USER_FIELD from '@salesforce/schema/Resource_DE__c.API_User_Id__c';
import { refreshApex } from '@salesforce/apex';

export default class GenerateUpdateUserRecordComponent extends LightningElement {
	@api recordId;
    @track resource;
    @track hasAPIUserId; 
    @track isModalOpen = false;
    @track hasResource = false;
	
    @wire(getRecord, { recordId: '$recordId', fields: [API_USER_FIELD] })
    wiredResource(result){
        this.resource = result; 
        if (result.data) {
            this.hasResource = true;
            this.hasAPIUserId = !isEmpty(getFieldValue(this.resource.data, API_USER_FIELD));
        }
    };

    closeModal() {
        this.isModalOpen = false;
    }

    handleClick() {
        this.isModalOpen = true;
    }

    handleFlowStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.isModalOpen = false;
            refreshApex(this.resource);
        }
    }

    get inputVariables() {
        return [
            {
                name: 'ResourceRecord',
                type: 'String',
                value: this.recordId ?? ''
            }
        ];
    }    
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}