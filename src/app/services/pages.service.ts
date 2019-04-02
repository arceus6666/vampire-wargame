import { Injectable } from '@angular/core';
import { Board } from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  public board: Board;
  public lastPage: string;
  constructor() {
    this.board = new Board();
    this.lastPage = 'home';
  }

}
