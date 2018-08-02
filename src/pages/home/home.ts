import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data = { title: '', description: '', date: '', time: '' };

  constructor(public navCtrl: NavController,
    public localNotifications: LocalNotifications,
    public alertCtrl: AlertController,
    public platform: Platform) {

  }

  registerPrayReminder() {
    console.log(this.data);
    let date = new Date(this.data.date + " " + this.data.time);
    console.log(date);
    this.localNotifications.schedule({
      text: 'Delayed ILocalNotification',
      trigger: { at: date },
      led: 'FF0000',
      sound: this.setSound(),
    });
    let alert = this.alertCtrl.create({
      title: 'Congratulation!',
      subTitle: 'Notification setup successfully at ' + date,
      buttons: ['OK']
    });
    alert.present();
    this.data = { title: '', description: '', date: '', time: '' };
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/Rooster.mp3'
    } else {
      return 'file://assets/sounds/Rooster.caf'
    }
  }
}
