import { LightningElement,wire, track } from 'lwc';
import GetAvailableResourceData from '@salesforce/apex/GetResourceDataController.GetAvailableResourceData'


export default class AvailableResources extends LightningElement {

    @track resourcelist;    
   

    @wire(GetAvailableResourceData) wiredAvailableResources({
    data,
    error,
  }) {
    console.log('testing',data)
    console.log(error)
    this.resourcelist = data
}
}