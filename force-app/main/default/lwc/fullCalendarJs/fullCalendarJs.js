import { LightningElement, track, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
//import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import FullCalender from '@salesforce/resourceUrl/FullCalender';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllShifts from '@salesforce/apex/FullCalendarService.fetchAllShifts';
import fetchAllResource from '@salesforce/apex/FullCalendarService.fetchAllResource';
/**
 * FullCalendarJs
 * @description Full Calendar JS - Lightning Web Components
 */
export default class FullCalendarJs extends NavigationMixin(LightningElement) {
    resourceRecords = [];

  fullCalendarJsInitialised = false;
  @track allEvents = [];
  @track selectedEvent = undefined;
  /**
   * @description Standard lifecyle method 'renderedCallback'
   *              Ensures that the page loads and renders the 
   *              container before doing anything else
   */
  renderedCallback() {

    // Performs this operation only on first render
    if (this.fullCalendarJsInitialised) {
      return;
    }
    this.fullCalendarJsInitialised = true;

    // Executes all loadScript and loadStyle promises
    // and only resolves them once all promises are done
    Promise.all([
      loadScript(this, FullCalender + '/jquery.min.js'),
      loadScript(this, FullCalender + '/moment.min.js'),
      //loadScript(this, FullCalender + '/theme.js'),
      loadScript(this, FullCalender + '/fullcalendar.min.js'),
      loadStyle(this, FullCalender + '/fullcalendar.min.css'),
      // loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
    ])
    
    .then(() => {
      // Initialise the calendar configuration
      this.getAllEvents();
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({
        message: 'Error occured on FullCalendarJS',
        error
      });
    })
  }

  /**
   * @description Initialise the calendar configuration
   *              This is where we configure the available options for the calendar.
   *              This is also where we load the Events data.
   */
  initialiseFullCalendarJs() {
    const ele = this.template.querySelector('div.fullcalendarjs');
    // eslint-disable-next-line no-undef
    $(ele).fullCalendar({
      header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,basicWeek,basicDay'
      },
      themeSystem : 'standard',
      defaultDate: new Date(), 
      navLinks: true,
      editable: true,
      eventLimit: true,
      events: this.allEvents,
      dragScroll : true,
      droppable: true,
      weekNumbers : true,
      eventDrop: function(event, delta, revertFunc) {
        alert(event.title + " was dropped on " + event.start.format());
        if (!confirm("Are you sure about this change? ")) {
          revertFunc();
        }
      },
      eventClick: function(event, jsEvent, view) {
        alert('Event Clicked '+event.title)
        this.selectedEvent =  event;
      },
      dayClick :function(date, jsEvent, view) {
        jsEvent.preventDefault();
        
      },
      eventMouseover : function(event, jsEvent, view) {
      }
    });
  }

  getAllEvents(){
    fetchAllShifts()
      .then(result => {
        this.allEvents = result.map(item => {
          return {
            id : item.Id,
            editable : true,
            title : item.Name,
            start : item.StartDate_Time__c,
            end : item.EndDate_Time__c,
            description : item.Resource_Name__c,
            allDay : false,
            //extendedProps : {
             // whoId : item.WhoId,
              //whatId : item.WhatId
            //},
            backgroundColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")",
            borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
          };
        });
        // Initialise the calendar configuration
        this.initialiseFullCalendarJs();
      })
      .catch(error => {
        window.console.log(' Error Occured ', error)
      })
      .finally(()=>{
        //this.initialiseFullCalendarJs();
      })
  }
  @wire(fetchAllResource)
    wiredResources({ error, data }) {
        if (data) {
            this.resourceRecords = data;
        } else if (error) {
            console.error('Error fetching resource records:', error);
        }
    }
  

  closeModal(){
    this.selectedEvent = undefined;
  }
}