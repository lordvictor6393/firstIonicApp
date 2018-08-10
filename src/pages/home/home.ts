import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileChooser } from "@ionic-native/file-chooser";
import { FormGroup, FormControl } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  prayNotificationForm: FormGroup;
  sound = 'file://assets/sounds/message_tone.mp3';

  constructor(public navCtrl: NavController,
    public localNotifications: LocalNotifications,
    public fileChooser: FileChooser,
    public alertCtrl: AlertController,
    public platform: Platform) {
    this.prayNotificationForm = new FormGroup({
      description: new FormControl(null),
      firstTime: new FormControl(null),
      secondTime: new FormControl(null),
      thirdTime: new FormControl(null)
    });
    this.prayNotificationForm.patchValue({
      description: 'Llego el tiempo de oración!',
      firstTime: '08:00',
      secondTime: '13:30',
      thirdTime: '21:00'
    });
  }

  openSoundPicker() {
    this.fileChooser.open()
      .then(uri => {
        console.log(uri);
        this.sound = uri;
      })
      .catch(console.warn);
  }

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

  getNotificationConfig(id: number, text: string, trigger: Date) {
    return {
      id: id,
      title: 'Maranatha App',
      text: text,
      sound: this.sound,
      trigger: {
        at: trigger
      }
    }
  }

  registerPrayReminders() {
    const data = this.prayNotificationForm.value;
    let notifications = [];
    let firstDate: Date;
    let secondDate: Date;
    let thirdDate: Date;

    if (data.firstTime) {
      firstDate = this.getNotificationDate(data.firstTime);
      notifications.push(this.getNotificationConfig(1, data.description, firstDate))
    }
    if (data.secondTime) {
      secondDate = this.getNotificationDate(data.secondTime);
      notifications.push(this.getNotificationConfig(2, data.description, secondDate))
    }
    if (data.thirdTime) {
      thirdDate = this.getNotificationDate(data.thirdTime);
      notifications.push(this.getNotificationConfig(3, data.description, thirdDate))
    }

    // notifications.push({
    //   id: 4,
    //   title: 'test',
    //   text: 'this is a test notification that runs\nevery minute.',
    //   trigger: {
    //     every: 'minute',
    //     firstAt: this.getNotificationDate('18:45')
    //   }
    // });

    // notifications.push({
    //   id: 4,
    //   title: 'test',
    //   text: 'this is a test notification that runs\nevery minute.',
    //   trigger: {
    //     every: { 'hour': 18, 'minute': 17 }
    //   }
    // });

    this.localNotifications.schedule(notifications);

    let alert = this.alertCtrl.create({
      title: 'Perfecto!',
      subTitle: 'Los horarios fueron registrados correctamente.',
      buttons: ['OK']
    });
    alert.present();
  }

  disablePrayNotifications() {
    this.localNotifications.cancelAll();
    let alert = this.alertCtrl.create({
      title: 'Aviso',
      subTitle: 'Las notificaciones fueron desactivadas.',
      buttons: ['OK']
    });
    alert.present();
  }
}
