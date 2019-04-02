import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PagesService } from '../services/pages.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
})
export class RulesPage implements OnInit {

  constructor(
    private _router: Router,
    private _pager: PagesService
  ) { }

  ngOnInit() {
  }

  back() {
    this._router.navigate([this._pager.lastPage]);
  }

}
