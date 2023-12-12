import { LightningElement, api, wire, track } from 'lwc';
import getResourceData from '@salesforce/apex/GetResourceDataController.GetResourceData'
import HideCoordinatesonMap from "@salesforce/resourceUrl/HideCoordinatesonMap";
import { loadStyle } from "lightning/platformResourceLoader";


export default class LocationOfResources extends LightningElement {

 
  mapMarkers = [];

 renderedCallback() {
        
        Promise.all([
            loadStyle( this, HideCoordinatesonMap )
            ]).then(() => {
                console.log( 'Files loaded' );
            })
            .catch(error => {
                console.log( error.body.message );
        });

    }

    @wire(getResourceData) wiredResources({
    data,
    error,
  }) {
    console.log(data)
    console.log(error)
//  if (error) {

//      console.log("Error = ", error);
//     } else if (data) {
    

      // var dataArray = []; //holds all long/lat data
      // //for loop over the data
      // for(var i = 0; i < data.length; i++) {
      //    const name = data[i].Name
      //     const Latitude =  data[i].Location_Latitude__c;
      //     const Longitude = data[i].Location_Longitude__c;
      //     const resourceName = data[i].Name__c;
      //     const resourceVehicle = data[i].Current_Vehicle_Assigned__c;
      //     const resourceAvailable = data[i].CurrentlyAvailable__c;
      //   dataArray.push({
      //     location: { Latitude, Longitude },
      //     title:`${resourceName} -  ${name}` ,
      //     description:   `  Resource Vehicle :<b > ${resourceVehicle} </b> <br>  Currently Available : <b>${resourceAvailable} </b>`  , 
      //     icon: "standard:account"
      //   });
       if (data) {
      data.forEach(dataItem => {
                this.mapMarkers = [...this.mapMarkers,
                {
                    location: {
                    
                        Latitude: dataItem.Location_Latitude__c,
                        Longitude: dataItem.Location_Longitude__c,
                       
                    },
                    icon: 'standard:avatar',
                    title:`${dataItem.Name__c} -  ${dataItem.Name}` ,
                    description:   `  Resource Vehicle :<b > ${dataItem.Current_Vehicle_Assigned__c} </b> <br>  Currently Available : <b>${dataItem.CurrentlyAvailable__c} </b>`  , 
                }
                ];
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
        

        
};
 
}
    //   }
    //   // Transform resource data into map markers
    //   console.log(dataArray)
    //   this.mapMarkers = dataArray;
    // }