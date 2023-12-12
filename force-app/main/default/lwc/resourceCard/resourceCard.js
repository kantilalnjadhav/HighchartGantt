import { LightningElement, wire } from 'lwc';
import fetchAllResource from '@salesforce/apex/ResourceList.fetchAllResource';

export default class ResourceCard extends LightningElement {
   
    resourceRecords = [];

    @wire(fetchAllResource)
    wiredResources({ error, data }) {
        if (data) {
            this.resourceRecords = data;
        } else if (error) {
            console.error('Error fetching resource records:', error);
        }
    }
}