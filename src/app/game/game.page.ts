import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board';
import { Piece } from '../models/piece';
import { Lycanthrope } from '../models/lycanthrope';
import { Necromancer } from '../models/necromancer';
import { Vampire } from '../models/vampire';
import { Zombie } from '../models/zombie';
import { ScreenService } from '../services/screen.service';
import { Router } from '@angular/router';

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
    private _router: Router
  ) {
    this.board = new Board();
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

  getType() {
    if (this.prevP instanceof Necromancer) return 'n';
    else if (this.prevP instanceof Vampire) return 'v';
    else if (this.prevP instanceof Lycanthrope) return 'w';
    else if (this.prevP instanceof Zombie) return 'z';
    return null;
  }

  setNecro(value: boolean) {
    this.necro = value;
  }

  setVamp(value: boolean) {
    this.vamp = value;
  }

  getHpArray() {
    let a = [];
    for (let i = 0; i < this.prevP.hp; i++) {
      a.push('');
    }
    return a;
  }

  getPType(p: Piece): string {
    return p instanceof Lycanthrope ? 'l' : p instanceof Zombie ? 'z' : p instanceof Necromancer ? 'n' : 'v';
  }

  resetBG(cc, rr) {
    document.getElementById(`${cc}${rr}`).style.backgroundColor = (cc + rr) % 2 === 0 ? 'black' : 'white';
  }

  setBG(cc, rr) {
    document.getElementById(`${cc}${rr}`).style.backgroundColor = this.turn ? 'rgba(100, 0, 0,0.3)' : 'rgba(0,0,0,0.3)';
  }

  action(e: Piece | Array<number>, c: number, r: number) {
    if (e instanceof Piece && !this.click) {
      //primer click
      //console.log(p)
      if (e.player === this.turn) {
        if (e instanceof Necromancer) this.necro = true;
        if (e instanceof Vampire) this.vamp = true;
        this.prevP = e;
        //this.id = `${c}${r}`;
        this.id = [c, r];
        //document.getElementById(this.id).style.backgroundColor = this.turn ? 'rgba(100, 0, 0,0.3)' : 'rgba(0,0,0,0.3)'
        //document.getElementById(`${this.id[0]}${this.id[1]}`).style.backgroundColor = this.turn ? 'rgba(100, 0, 0,0.3)' : 'rgba(0,0,0,0.3)';
        this.setBG(this.id[0], this.id[1]);
        this.click = true;
      }
    } else if (this.click) {
      //segundo click
      if (e instanceof Piece) {
        // cambiar pieza o batalla
        if (e.player === this.turn) {
          //cambiar pieza
          this.prevP = e;
          //document.getElementById(this.id).style.backgroundColor = (parseInt(this.id[0]) + parseInt(this.id[1])) % 2 === 0 ? 'black' : 'white';
          //document.getElementById(`${this.id[0]}${this.id[1]}`).style.backgroundColor = (this.id[0] + this.id[1]) % 2 === 0 ? 'black' : 'white';
          this.resetBG(this.id[0], this.id[1]);
          //this.id = `${c}${r}`;
          this.id = [c, r];
          //document.getElementById(this.id).style.backgroundColor = this.turn ? 'rgba(100, 0, 0,0.3)' : 'rgba(0,0,0,0.3)'
          //document.getElementById(`${this.id[0]}${this.id[1]}`).style.backgroundColor = this.turn ? 'rgba(100, 0, 0,0.3)' : 'rgba(0,0,0,0.3)';
          this.setBG(this.id[0], this.id[1])
        } else {
          // batalla
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
                if (e.player) this.player2--;
                else this.player1--;
              } else {
                e.hp = rhp;
                //console.log(`${et} con: ${rhp} restante`)
              }
              this.resetBG(this.prevP.col, this.prevP.row);
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
                if (e.player) this.player2--;
                else this.player1--;
              } else {
                e.hp = rrhp;
                //console.log(`${et} con: ${rhp} restante`)
              }
              this.prevP.hp = this.prevP.hp + rrhp > 5 ? 5 : this.prevP.hp + rrhp;
              this.board.cells[this.prevP.col][this.prevP.row] = this.prevP;
              this.vamp = true;
              this.resetBG(this.prevP.col, this.prevP.row);
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
                if (e.player) this.player2--;
                else this.player1--;
              } else {
                e.hp = rhp;
              }
              this.resetBG(this.prevP.col, this.prevP.row);
            }
          }
          if (this.player1 <= 0) {
            //llamar alert
            this._screen.showAlert('Jugador 2 Gana');
            this._router.navigate(['home']);
          } else if (this.player2 <= 0) {
            this._screen.showAlert('Jugador 2 Gana');
            this._router.navigate(['home']);
          }
          this.turn = !this.turn;
        }
      } else {
        //mover
        // console.log(e)
        //e[0] = col, e[1] = row
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
            document.getElementById(`${this.id[0]}${this.id[1]}`).style.backgroundColor = (this.id[0] + this.id[1]) % 2 === 0 ? 'black' : 'white';
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
            //document.getElementById(this.id).style.backgroundColor = (parseInt(this.id[0]) + parseInt(this.id[1])) % 2 === 0 ? 'black' : 'white';
            document.getElementById(`${this.id[0]}${this.id[1]}`).style.backgroundColor = (this.id[0] + this.id[1]) % 2 === 0 ? 'black' : 'white';
            this.click = false;
            this.turn = !this.turn;
          }
        } else if (this.prevP instanceof Necromancer && !this.necro) {
          console.log('invocar')
          if (!(this.board.cells[e[0]][e[1]] instanceof Piece)) {
            this.board.cells[e[0]][e[1]] = new Zombie(e[0], e[1], this.turn);
            document.getElementById(`${this.id[0]}${this.id[1]}`).style.backgroundColor = (this.id[0] + this.id[1]) % 2 === 0 ? 'black' : 'white';
            this.click = false;
            this.turn = !this.turn;
          } else {
            this._screen.showAlert('Press an empty cell!');
          }
        }
      }
    }
  }
}
