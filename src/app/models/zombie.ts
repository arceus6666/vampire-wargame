import { Piece } from './piece';

export class Zombie extends Piece {

  constructor(c: number, r: number, p: boolean) {
    super(c, r, p);
    this.hp = 1;
    this.atk = 1;
    this.def = 0;
    this.src = `../assets/imgs/${p ? 'red' : 'black'}_z.png`;
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
