import { Piece } from './piece';

export class Necromancer extends Piece {

  constructor(c: number, r: number, p: boolean) {
    super(c, r, p);
    this.hp = 3;
    this.atk = 4;
    this.def = 1;
    this.src = `../assets/imgs/${p ? 'red' : 'black'}_n.png`
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
