
import { LightningElement } from 'lwc';

export default class ChildCmp extends LightningElement {

        count=0;

        icrementcount(){
            this.dispatchEvent(new CustomEvent('increasecount' ,{
                detail:{
                    message: 'Increase count to ' + (++this.count)
                }
            }));



        }
    

}   