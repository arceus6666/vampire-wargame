export abstract class Piece {
  public hp: number;
  public atk: number;
  public def: number;
  public col: number;
  public row: number;
  public player: boolean;
  public src: string;

  constructor(c: number, r: number, p: boolean) {
    this.col = c;
    this.row = r;
    this.player = p;
  }
}
