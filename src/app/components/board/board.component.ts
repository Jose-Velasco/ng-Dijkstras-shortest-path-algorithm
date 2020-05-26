import { Component, OnInit, HostListener } from '@angular/core';
import { SquareStatusService } from '../../services/square-status.service';
import { DijkstrasAlog } from 'src/app/services/dijkstrasAlog.service';
import { SquareComponent } from '../square/square.component';
import { SquareEventData } from 'src/app/shared/squareEventData.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  isSKeydown: boolean = false;
  isEKeydown: boolean = false;
  hasSOrEKeyPressed: boolean = false;
  boardWidth: number = 64
  boardHeight: number = 64
  squares: number[] = [];
  // isStartingLocation: boolean;
  // isEditMode: boolean;
  // isEndingLocation: boolean;
  // testDijkstra: DijkstrasShortestPathAdjacencyListWithDHeap;

  constructor(
    private squareStatServ: SquareStatusService,
    private dijkstrasServ: DijkstrasAlog) { }

  ngOnInit() {
    for (let i = 0; i < this.dijkstrasServ.getnumofNodes(); i++) {
      // old value was  ^^^^1058
      this.squares.push(i);
    }

    // for (let y = 0; y < this.boardHeight; y++) {
    //   for (let x = 0; x < this.boardWidth; x++) {
    //     this.squares.push
    //   }
    // }
    console.log(this.dijkstrasServ.gettestgraph());
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
      }
      this.squareStatServ.activatedEmitterSquare.next(squareClickedData);
    } else if(this.isEKeydown && !this.isSKeydown) {
      this.hasSOrEKeyPressed = true;
      let squareClickedData: SquareEventData = {
        nodeindex: index,
        EKeyPressed: true,
      }
      this.squareStatServ.activatedEmitterSquare.next(squareClickedData);
    }
  }

  //  need to find a way to hold left mouse button to color squares faster
  // onSquaredragover(index: number) {
  //   setTimeout(() => {
  //     this.squareStatServ.activatedEmitterSquare.next(index);
  //   }, 500);
  // }

  handleResetActiveKeypressesValues(): void {
    if(this.hasSOrEKeyPressed) {
      const squareResetValues: SquareEventData = {
        nodeindex: -1,
        sKeyPressed: false,
        EKeyPressed: false
      }
      this.squareStatServ.activatedEmitterSquare.next(squareResetValues);
    }
  }
}
