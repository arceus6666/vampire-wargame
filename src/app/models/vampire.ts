import { Piece } from './piece';

export class Vampire extends Piece {

  constructor(c: number, r: number, p: boolean) {
    super(c, r, p);
    this.hp = 4;
    this.atk = 3;
    this.def = 5;
    this.src = `../assets/imgs/${p ? 'red' : 'black'}_v.png`
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
