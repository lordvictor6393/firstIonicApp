import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { NavController, AlertController, Platform } from 'ionic-angular';
import { FileChooser } from "@ionic-native/file-chooser";
import { AppPreferences } from '@ionic-native/app-preferences';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  prayNotificationForm: FormGroup;
  sound = 'file://assets/sounds/message_tone.mp3';

  count: number;
  repeat = [
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'quarter',
    'year'
  ];
  repeatTime: string;
  repeatInterval: string;

  minute: number;
  hour: number;
  day: number;
  weekday: number;
  weekdayOrdinal: number;
  week: number;
  weekOfMonth: number;
  month: number;
  quarter: number;
  year: number; 

  matchTime: string;

  constructor(public navCtrl: NavController,
    public localNotifications: LocalNotifications,
    public fileChooser: FileChooser,
    private appPreferences: AppPreferences,
    public alertCtrl: AlertController,
    public platform: Platform) {
    this.prayNotificationForm = new FormGroup({
      description: new FormControl(null),
      firstEnabled: new FormControl(null),
      firstTime: new FormControl(null),
      secondEnabled: new FormControl(null),
      secondTime: new FormControl(null),
      thirdEnabled: new FormControl(null),
      thirdTime: new FormControl(null)
    });

    let firstNotificationTime = this.appPreferences.fetch('maranatha', 'firstNotificationTime');
    let secondNotificationTime = this.appPreferences.fetch('maranatha', 'secondNotificationTime');
    let thirdNotificationTime = this.appPreferences.fetch('maranatha', 'thirdNotificationTime');

    this.prayNotificationForm.patchValue({
      description: 'Llego el tiempo de oración!',
      firstEnabled: !!firstNotificationTime,
      firstTime: firstNotificationTime || '08:00',
      secondEnabled: !!secondNotificationTime,
      secondTime: secondNotificationTime || '13:30',
      thirdEnabled: !!thirdNotificationTime,
      thirdTime: thirdNotificationTime || '21:00'
    });

    // this.prayNotificationForm.patchValue({
    //   description: 'Llego el tiempo de oración!',
    //   firstEnabled: true,
    //   firstTime: '08:00',
    //   secondEnabled: true,
    //   secondTime: '13:30',
    //   thirdEnabled: true,
    //   thirdTime: '21:00'
    // });
  }

  // openSoundPicker() {
  //   this.fileChooser.open()
  //     .then(uri => {
  //       console.log(uri);
  //       this.sound = uri;
  //     })
  //     .catch(console.warn);
  // }

  getNotificationDate(notTime: string) {
    let baseDate = new Date();
    const hour = notTime.split(":")[0];
    const minutes = notTime.split(":")[1];

    baseDate.setSeconds(0);
    baseDate.setMilliseconds(0);
    baseDate.setHours(+hour);
    baseDate.setMinutes(+minutes);

    return baseDate;
  }

  getNotificationConfig(id: number, text: string, time: string) {
    return {
      id: id,
      title: 'Maranatha App',
      text: text,
      trigger: {
        count: 365,
        every: { hour: +time.split(':')[0], minute: +time.split(':')[1]}
      }
    }
  }

  registerPrayReminders() {
    const data = this.prayNotificationForm.value;
    let notifications = [];

    if (data.firstEnabled) {
      notifications.push(this.getNotificationConfig(1, data.description, data.firstTime));
      this.appPreferences.store('maranatha', 'firstNotificationTime', data.firstTime);
    } else {
      this.localNotifications.cancel(1);
      this.appPreferences.remove('maranatha', 'firstNotificationTime');
    }
    if (data.secondEnabled) {
      notifications.push(this.getNotificationConfig(2, data.description, data.secondTime));
      this.appPreferences.store('maranatha', 'secondNotificationTime', data.secondTime);
    } else {
      this.localNotifications.cancel(2);
      this.appPreferences.remove('maranatha', 'secondNotificationTime');
    }
    if (data.thirdEnabled) {
      notifications.push(this.getNotificationConfig(3, data.description, data.thirdTime));
      this.appPreferences.store('maranatha', 'thirdNotificationTime', data.thirdTime);
    } else {
      this.localNotifications.cancel(3);
      this.appPreferences.remove('maranatha', 'thirdNotificationTime');
    }

    this.localNotifications.schedule(notifications);

    let alert = this.alertCtrl.create({
      title: 'Perfecto!',
      subTitle: 'Los horarios fueron registrados correctamente.',
      buttons: ['OK']
    });
    alert.present();
  }

  // disablePrayNotifications() {
  //   this.localNotifications.cancelAll();
  //   let alert = this.alertCtrl.create({
  //     title: 'Aviso',
  //     subTitle: 'Las notificaciones fueron desactivadas.',
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  addRepeatNotification() {
    let config = [];
    let trig = {
      every: this.repeatInterval
    };
    if(this.count) trig['count'] = +this.count;
    if(this.repeatTime) trig['firstAt'] = this.getNotificationDate(this.repeatTime);
    config.push({
      id: 10,
      title: 'test repeat notification',
      trigger: trig
    });
    this.localNotifications.schedule(config);
    console.log('repeat config: ', config);
  }

  buildScheduleObject() {
    let obj = {};
    if(this.minute) { obj['minute'] = +this.minute;  }
    if(this.hour) { obj['hour'] = +this.hour;  }
    if(this.day) { obj['day'] = +this.day;  }
    if(this.weekday) { obj['weekday'] = +this.weekday;  }
    if(this.weekdayOrdinal) { obj['weekdayOrdinal'] = +this.weekdayOrdinal;  }
    if(this.week) { obj['week'] = +this.week;  }
    if(this.weekOfMonth) { obj['weekOfMonth'] = +this.weekOfMonth;  }
    if(this.month) { obj['month'] = +this.month;  }
    if(this.quarter) { obj['quarter'] = +this.quarter;  }
    if(this.year) { obj['year'] = +this.year;  }
    return obj;
  }

  addMatchNotification() {
    let config = [];
    let trig = {
      every: this.buildScheduleObject()
    };
    if(this.count) trig['count'] = +this.count;
    if(this.matchTime) trig['firstAt'] = this.getNotificationDate(this.matchTime);
    config.push({
      id: 11,
      title: 'test match notification',
      trigger: trig
    });
    this.localNotifications.schedule(config);
    console.log('match config: ', config);
  }
}
