import { LightningElement } from 'lwc';

export default class ParentCmp extends LightningElement {
    message= 'updated count will go here';
    updatemassage(event){
        this.message=event.detail.message;
    }
}