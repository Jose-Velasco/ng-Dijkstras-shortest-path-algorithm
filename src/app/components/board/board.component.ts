import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { SquareStatusService } from '../../services/square-status.service';
import { DijkstrasAlog } from 'src/app/services/dijkstrasAlog.service';
import { SquareEventData } from 'src/app/shared/squareEventData.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  isSKeydown: boolean = false;
  isEKeydown: boolean = false;
  hasSOrEKeyPressed: boolean = false;
  totalNumberOfSquares: number;
  numberofSquaresPerRow: number;
  squares: number[] = [];

  constructor(
    private squareStatServ: SquareStatusService,
    private dijkstrasServ: DijkstrasAlog) { }

  ngOnInit() {
    this.totalNumberOfSquares = this.dijkstrasServ.getnumofNodes();
    for (let i = 0; i < this.dijkstrasServ.getnumofNodes(); i++) {
      // old value was  ^^^^1058
      this.squares.push(i);
    }
    this.numberofSquaresPerRow = this.calculateNumberOfSquaresPerRow(this.totalNumberOfSquares);
  }

  /**
   * for this visualization totalSquares should be perfect squares and >= 4
   * in order ot avoid possable visual bugs
   * @param totalSquares total number of square that will be visually represented
   */
  calculateNumberOfSquaresPerRow(totalSquares: number): number {
    let sqrtOfTotal: number = Math.sqrt(totalSquares);
    return sqrtOfTotal + sqrtOfTotal + (sqrtOfTotal / 2);
  }

  setBoardWidthWithRespectToTotalSquares(): string {
    return `${this.numberofSquaresPerRow}rem`;
  }

  @HostListener("document:keypress", ["$event"])
  onUpdateStartEndNode(event: KeyboardEvent) {
    switch(event.key) {
      case "s":
        this.isSKeydown = true;
        break;
      case "e":
        this.isEKeydown = true;
        break;
    }
  }

  // handles on relase of 's' or 'e' key
  @HostListener("document:keyup", ["$event"])
  onsssUpdateStartEndNode(event: KeyboardEvent) {
    this.isSKeydown = false;
    this.isEKeydown = false;
  }

  onSquareClicked(index: number) {
    if(this.isSKeydown && !this.isEKeydown) {
      this.hasSOrEKeyPressed = true;
      let squareClickedData: SquareEventData = {
        nodeindex: index,
        sKeyPressed: true
      };
      this.squareStatServ.handleAddingStartEndNodes(squareClickedData);
    } else if(this.isEKeydown && !this.isSKeydown) {
      this.hasSOrEKeyPressed = true;
      let squareClickedData: SquareEventData = {
        nodeindex: index,
        EKeyPressed: true,
      };
      this.squareStatServ.handleAddingStartEndNodes(squareClickedData);
    }
  }

  CheckMouseIfLeftOrRightButtonIsHeld(event: MouseEvent, nodeIndex: number) {
    if(this.isEKeydown || this.isSKeydown || event.buttons === 0) {
      return;
    }
    // this 1 in this represents left mouse click
    if(event.buttons === 1) {
      let squareClickedData: SquareEventData = {
        nodeindex: nodeIndex,
        noKeyPressedWithLeftMouseClick: true
      };
      this.squareStatServ.onHandleAddingWallNode(squareClickedData);
    // the 2 represents right mouse click
    } else if(event.buttons === 2) {
      this.squareStatServ.onHandleRemovingWallNodes(nodeIndex);
    }
  }

  // this might be an useless func delete later
  handleResetActiveKeypressesValues(): void {
    console.log("In board componetn: handleResetACtiveKey..");
    if(this.hasSOrEKeyPressed) {
      const squareResetValues: SquareEventData = {
        nodeindex: -1,
        sKeyPressed: false,
        EKeyPressed: false
      };
      this.squareStatServ.activatedEmitterSquare.next(squareResetValues);
    }
  }
  ngOnDestroy() {
    console.log("board was destroyed!!");
  }
}
