import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Board } from '../models/board';
import { Piece } from '../models/piece';
import { Lycanthrope } from '../models/lycanthrope';
import { Necromancer } from '../models/necromancer';
import { Vampire } from '../models/vampire';
import { Zombie } from '../models/zombie';

import { ScreenService } from '../services/screen.service';
import { PagesService } from '../services/pages.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public board: Board;
  public drawBoard = [];
  public turn: boolean;
  public click: boolean;
  public prevP: Piece;
  public player1: number;
  public player2: number;
  public necro: boolean;
  public vamp: boolean;
  private id: Array<number>;

  constructor(
    private _screen: ScreenService,
    private _router: Router,
    private _pager: PagesService
  ) {
    this.board = this._pager.board;
    this.turn = true;
    this.click = false;
    this.prevP = null;
    this.necro = true;
    this.player1 = 6;
    this.player2 = 6;
  }

  ngOnInit() {
    for (let i = 0; i < 6; i++) {
      this.drawBoard[i] = [];
      for (let j = 0; j < 6; j++) {
        this.drawBoard[i][j] = this.board.cells[j][i];
      }
    }
  }

  setNecro(value: boolean) {
    this.necro = value;
  }

  setVamp(value: boolean) {
    this.vamp = value;
  }

  getHpArray() {
    let a = [];
    let h = this.prevP.hp;
    for (let i = 0; i < 5; i++) {
      a.push(i < h);
    }
    return a;
  }

  getPType(p: Piece): string {
    return p instanceof Lycanthrope ? 'l' : p instanceof Zombie ? 'z' : p instanceof Necromancer ? 'n' : 'v';
  }

  bg(cc: number, rr: number, set: boolean) {
    if (set)
      document.getElementById(`${cc}${rr}`).className = (cc + rr) % 2 === 0 ? 'black-red' : 'white-red';
    else
      document.getElementById(`${cc}${rr}`).className = (cc + rr) % 2 === 0 ? 'black' : 'white';
  }

  goRules() {
    this._pager.board = this.board;
    this._pager.lastPage = 'game';
    this._router.navigate(['rules'])
  }

  home() {
    this._pager.board = new Board();
    this._pager.lastPage = 'home';
    this._router.navigate(['home']);
  }

  action(e: Piece | Array<number>, c: number, r: number) {
    if (e instanceof Piece && !this.click) {
      //primer click
      //console.log(p)
      if (e.player === this.turn) {
        if (e instanceof Necromancer) this.necro = true;
        if (e instanceof Vampire) this.vamp = true;
        this.prevP = e;
        this.id = [c, r];
        this.bg(c, r, true);
        this.click = true;
      }
    } else if (this.click) {
      //segundo click
      if (e instanceof Piece) {
        // cambiar pieza o batalla
        if (this.prevP instanceof Necromancer && !this.necro) {
          this._screen.showAlert('Press an empty cell!');
        } else {
          if (e.player === this.turn) {
            //cambiar pieza
            this.prevP = e;
            this.bg(this.id[0], this.id[1], false);
            this.id = [c, r];
            this.bg(c, r, true);
          } else {
            // batalla
            if (!this.prevP) return
            let cd = Math.abs(this.prevP.col - e.col);
            let rd = Math.abs(this.prevP.row - e.row);
            if (
              this.prevP instanceof Lycanthrope ||
              this.prevP instanceof Zombie ||
              (this.prevP instanceof Vampire && this.vamp)
            ) {
              /*
              let pt = this.getPType(this.prevP)
              let et = this.getPType(e)
              console.log(`${pt} vs ${et}`)
              //*/
              if (rd < 2 && cd < 2) {
                let dmg = this.prevP.atk - e.def;
                let rhp = e.hp - (dmg < 1 ? 1 : dmg);
                if (rhp <= 0) {
                  //console.log(`${et} muerto`)
                  this.board.cells[e.col][e.row] = [e.col, e.row];
                  if (this.prevP.player) this.player2--;
                  else this.player1--;
                } else {
                  e.hp = rhp;
                  //console.log(`${et} con: ${rhp} restante`)
                }
                this.bg(this.prevP.col, this.prevP.row, false);
                this.turn = !this.turn;
                this.prevP = null;
              }
            } else if (this.prevP instanceof Vampire && !this.vamp) {
              //drain hp
              if (rd < 2 && cd < 2) {
                let dmg = this.prevP.atk - e.def;
                let rhp = e.hp - (dmg < 1 ? 1 : dmg);
                let rrhp = rhp / 2 < 2 ? 1 : rhp / 2;
                if (rrhp <= 0) {
                  //console.log(`${et} muerto`)
                  this.board.cells[e.col][e.row] = [e.col, e.row];
                  if (this.prevP.player) this.player2--;
                  else this.player1--;
                } else {
                  e.hp = rrhp;
                  //console.log(`${et} con: ${rhp} restante`)
                }
                this.prevP.hp = this.prevP.hp + rrhp > 5 ? 5 : this.prevP.hp + rrhp;
                this.board.cells[this.prevP.col][this.prevP.row] = this.prevP;
                this.vamp = true;
                this.bg(this.prevP.col, this.prevP.row, false);
                this.turn = !this.turn;
                this.prevP = null;
              }
            } else if (this.prevP instanceof Necromancer) {
              //can attack at 2; ignore def
              //console.log('batalla')
              //console.log('x', cd, this.prevP.col, e.col);
              //console.log('y', rd, this.prevP.row, e.row);
              if (((rd + cd) < 5 && (rd + cd) % 2 === 0) || (cd + rd === 1)) {
                let rhp = e.hp - this.prevP.atk;
                if (rhp <= 0) {
                  this.board.cells[e.col][e.row] = [e.col, e.row];
                  if (this.prevP.player) this.player2--;
                  else this.player1--;
                } else {
                  e.hp = rhp;
                }
                this.bg(this.prevP.col, this.prevP.row, false);
                this.turn = !this.turn;
                this.prevP = null;
              }
            }
            if (this.player1 <= 0) {
              //llamar alert
              this._screen.showAlert('Player 2 Wins', null, null, null, ['txt']);
              this.home()
            } else if (this.player2 <= 0) {
              this._screen.showAlert('Player 1 Wins');
              this._router.navigate(['home']);
              this.home();
            }
          }
        }
      } else {
        //mover
        if (this.prevP instanceof Lycanthrope) {
          //can move at 2
          let cd = Math.abs(this.prevP.col - e[0]);
          let rd = Math.abs(this.prevP.row - e[1]);
          //console.log('x', cd, this.prevP.col, e[0])
          //console.log('y', rd, this.prevP.row, e[1])
          if (((rd + cd) < 5 && (rd + cd) % 2 === 0) || (cd + rd === 1)) {
            this.board.cells[this.prevP.col][this.prevP.row] = [this.prevP.col, this.prevP.row];
            this.prevP.col = e[0];
            this.prevP.row = e[1];
            this.board.cells[e[0]][e[1]] = this.prevP;
            //document.getElementById(this.id).style.backgroundColor = (parseInt(this.id[0]) + parseInt(this.id[1])) % 2 === 0 ? 'black' : 'white';
            this.bg(this.id[0], this.id[1], false);
            this.click = false;
            this.turn = !this.turn;
          }
        } else if (
          this.prevP instanceof Zombie ||
          this.prevP instanceof Vampire ||
          (this.prevP instanceof Necromancer && this.necro)
        ) {
          let cd = Math.abs(this.prevP.col - e[0]);
          let rd = Math.abs(this.prevP.row - e[1]);
          if (rd < 2 && cd < 2) {
            this.board.cells[this.prevP.col][this.prevP.row] = [this.prevP.col, this.prevP.row];
            this.prevP.col = e[0];
            this.prevP.row = e[1];
            this.board.cells[e[0]][e[1]] = this.prevP;
            this.bg(this.id[0], this.id[1], false);
            this.click = false;
            this.turn = !this.turn;
          }
        } else if (this.prevP instanceof Necromancer && !this.necro) {
          //console.log('summoned')
          this.board.cells[e[0]][e[1]] = new Zombie(e[0], e[1], this.prevP.player);
          this.bg(this.id[0], this.id[1], false);
          this.click = false;
          if (this.prevP.player) this.player1++;
          else this.player2++;
          this.turn = !this.turn;
        }
      }
    }
  }
}
