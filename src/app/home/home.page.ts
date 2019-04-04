import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PagesService } from '../services/pages.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isApp;
  constructor(
    public _router: Router,
    public _pager: PagesService,
    public _plt: Platform
  ) {
    this.isApp = _plt.is('android') || _plt.is('ios');
  }
  goRules() {
    this._router.navigate(['rules'])
  }
  goGame() {
    this._router.navigate(['game'])
  }
  print() {
    console.log(this._plt)
  }
  closeApp() {
    navigator['app'].exitApp()
  }
}
