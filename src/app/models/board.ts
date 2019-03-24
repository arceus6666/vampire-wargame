import { Piece } from './piece';
import { Lycanthrope } from './lycanthrope';
import { Vampire } from './vampire';
import { Necromancer } from './necromancer';

export class Board {
  public cells: Array<Array<Piece | Array<number>>>;

  constructor() {
    this.cells = [];
    // [col][row]
    for (let col = 0; col < 6; col++) {
      this.cells[col] = [];
      for (let row = 0; row < 6; row++) {
        this.cells[col][row] = [col, row];
      }
    }

    this.cells[0][0] = new Lycanthrope(0, 0, false);
    this.cells[1][0] = new Vampire(1, 0, false);
    this.cells[2][0] = new Necromancer(2, 0, false);
    this.cells[3][0] = new Necromancer(3, 0, false);
    this.cells[4][0] = new Vampire(4, 0, false);
    this.cells[5][0] = new Lycanthrope(5, 0, false);

    this.cells[0][5] = new Lycanthrope(0, 5, true);
    this.cells[1][5] = new Vampire(1, 5, true);
    this.cells[2][5] = new Necromancer(2, 5, true);
    this.cells[3][5] = new Necromancer(3, 5, true);
    this.cells[4][5] = new Vampire(4, 5, true);
    this.cells[5][5] = new Lycanthrope(5, 5, true);

  }
}
