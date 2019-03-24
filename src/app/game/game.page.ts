import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board';
import { Piece } from '../models/piece';
import { Lycanthrope } from '../models/lycanthrope';
import { Necromancer } from '../models/necromancer';
import { Vampire } from '../models/vampire';
import { Zombie } from '../models/zombie';

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
  private id: string;

  constructor() {
    this.board = new Board();
    this.turn = true;
    this.click = false;
    this.prevP = null;
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

  action(e: Piece | Array<number>, c: string, r: string) {
    let idd = this.id
    if (e instanceof Piece && !this.click) {
      //primer click
      //console.log(p)
      if (e.player === this.turn) {
        this.prevP = e;
        this.id = `${c}${r}`;
        document.getElementById(this.id).style.backgroundColor = this.turn ? 'rgba(100, 0, 0,0.3)' : 'rgba(0,0,0,0.3)'
        this.click = true;
      }
    } else if (this.click) {
      //segundo click
      if (e instanceof Piece) {
        if (e.player === this.turn) {
          this.prevP = e;
        } else {
          // batalla
          if (this.prevP instanceof Lycanthrope) {

          } else if (this.prevP instanceof Vampire) {
            //can drain

          } else if (this.prevP instanceof Necromancer) {
            //can attack at 2; ignore def
            let cd = Math.abs(this.prevP.col - e.col)
            let rd = Math.abs(this.prevP.row - e.row)
            console.log('batalla')
            console.log('x', cd, this.prevP.col, e.col)
            console.log('y', rd, this.prevP.row, e.row)
            if (((rd + cd) < 5 && (rd + cd) % 2 === 0) || (cd + rd === 1)) {
              let rhp = e.hp - this.prevP.atk
              if (rhp <= 0) {
                this.board.cells[e.col][e.row] = [e.col, e.row];
                if (e.player) this.player1--;
                else this.player2--
                if (this.player1 === 0) {
                  //acabar
                } else if (this.player2 === 0) {
                  //acabar
                }
              } else {
                e.hp = rhp
              }
            }

          } else if (this.prevP instanceof Zombie) {

          }


          this.turn = !this.turn;
        }
      } else {
        //mover
        // console.log(e)
        //e[0] = col, e[1] = row
        if (this.prevP instanceof Lycanthrope) {
          //can move at 2
          let cd = Math.abs(this.prevP.col - e[0])
          let rd = Math.abs(this.prevP.row - e[1])
          //console.log('x', cd, this.prevP.col, e[0])
          //console.log('y', rd, this.prevP.row, e[1])
          if (((rd + cd) < 5 && (rd + cd) % 2 === 0) || (cd + rd === 1)) {
            this.board.cells[this.prevP.col][this.prevP.row] = [this.prevP.col, this.prevP.row];
            this.prevP.col = e[0]
            this.prevP.row = e[1]
            this.board.cells[e[0]][e[1]] = this.prevP;
            document.getElementById(idd).style.backgroundColor = (parseInt(idd[0]) + parseInt(idd[1])) % 2 === 0 ? 'black' : 'white';
            this.click = false;
            this.turn = !this.turn;
          }
        } else if (this.prevP instanceof Vampire || this.prevP instanceof Zombie || this.prevP instanceof Necromancer) {
          let cd = Math.abs(this.prevP.col - e[0])
          let rd = Math.abs(this.prevP.row - e[1])
          if (rd < 2 && cd < 2) {
            this.board.cells[this.prevP.col][this.prevP.row] = [this.prevP.col, this.prevP.row];
            this.prevP.col = e[0]
            this.prevP.row = e[1]
            this.board.cells[e[0]][e[1]] = this.prevP;
            document.getElementById(idd).style.backgroundColor = (parseInt(idd[0]) + parseInt(idd[1])) % 2 === 0 ? 'black' : 'white';
            this.click = false;
            this.turn = !this.turn;
          }
        }
        //console.log(this.board.cells)

      }



    }
  }

}
