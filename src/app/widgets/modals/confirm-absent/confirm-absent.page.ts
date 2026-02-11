import { Component, OnInit } from '@angular/core';



import { NavParams, PopoverController } from '@ionic/angular';



@Component({
  selector: 'app-confirm-absent',
  templateUrl: './confirm-absent.page.html',
  styleUrls: ['./confirm-absent.page.scss'],
  standalone:false
})

export class ConfirmAbsentPage implements OnInit {

  agent_name : any;
  subcontractor: any;
  is_absence : boolean = false;
  is_late : boolean = false;
  is_without_EPI : boolean = false;
  agent : any;

  selectedTime : any;
  currentTime: any = this.getCurrentTime()
  hours: any;
  minutes: any;
  note: string = '';
  interval_hour_Id: any;
  modalOpen = false;
  
  constructor(private popoverController: PopoverController,private navParams: NavParams) { }

  ngOnInit() {
    this.agent = this.navParams.get('agent');

    this.agent_name = this.navParams.get('agent_name');
    this.subcontractor = this.navParams.get('subcontractor');
    
  }

  confirmAbsent() {
    const return_type = this.is_absence
      ? 'absent'
      : this.is_without_EPI && this.is_late
      ? 'epi-late'
      : this.is_without_EPI && !this.is_late
      ? 'epi'
      : 'late';

      const absence : any = {
        agent_id: this.agent.id,
        subcontractor_id: this.agent.subcontractor_id,
        return_type,
        date: new Date(Date.now()),
        currentTime: this.currentTime,
        hours: this.hours ? this.hours : new Date (Date.now()).getHours() ,
        minutes: this.minutes ? this.minutes :  new Date (Date.now()).getMinutes(),
        note: this.note,
        selected_time: !this.selectedTime ? this.getCurrentTime() : this.selectedTime,
      }
      this.popoverController.dismiss({
      confirmed: true,
      absence 
    });
  }

   getCurrentTime() {
    const now = new Date();
    let hours  :any= now.getHours();
    let minutes :any= now.getMinutes();

    // Pad hours and minutes with leading zero if needed
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes}`;
}

  closePopover() {
    this.popoverController.dismiss({ confirmed: false });
  }

  checkboxChanged(){
    this.is_absence = false;
    //console.log(this.is_absence);
    //console.log(this.is_late);
    //console.log(this.is_without_EPI);
  }

  radioClicked(){
    console.log('radio buton clicked !')
      this.is_late = false;
      this.is_without_EPI = false;
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

}


