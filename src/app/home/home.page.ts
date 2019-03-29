import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isApp;
  constructor(public _router: Router) {
    this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
  }
  goRules() {
    this._router.navigate(['rules'])
  }
  goGame() {
    this._router.navigate(['game'])
  }
  closeApp() {
    navigator['app'].exitApp()
  }
}
