import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertBtn } from '../models/alert-btn';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private _alertCtrl: AlertController) { }

  public async showAlert(
    title: string,
    buttons: Array<AlertBtn | string> = ['Ok'],
    subtitle?: string,
    message?: string,
    cssClass?: string | Array<string>
  ) {
    const alert = await this._alertCtrl.create({
      header: title,
      subHeader: subtitle,
      message: message,
      buttons: buttons,
      cssClass: cssClass
    });
    await alert.present()
  }
}
