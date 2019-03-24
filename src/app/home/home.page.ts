import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public _router: Router) {

  }
  goRules(){
    this._router.navigate(['rules'])
  }
  goGame(){
    this._router.navigate(['game'])
  }
}
