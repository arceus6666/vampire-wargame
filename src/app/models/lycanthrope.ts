import { Piece } from './piece';

export class Lycanthrope extends Piece {

  constructor(c: number, r: number, p: boolean) {
    super(c, r, p);
    this.hp = 5;
    this.atk = 5;
    this.def = 2;
    this.src = `../assets/imgs/${p ? 'red' : 'black'}_l.png`
  }

  public attack(objective: Piece): number {
    let rest = this.atk - objective.def;
    let dmg = rest === 0 ? 1 : rest;
    return objective.hp - dmg;
  }

  public showLife(): void {
    console.log(`HP: ${this.hp}`);
  }
}
