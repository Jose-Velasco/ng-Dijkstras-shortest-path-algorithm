import { Component, OnInit } from '@angular/core';
import { SquareStatusService } from '../../services/square-status.service';
import { DijkstrasAlog } from 'src/app/services/dijkstrasAlog.service';
// import { DijkstrasShortestPathAdjacencyListWithDHeap } from '../../shared/dijkstrasShortestPathAdjacencyListWithDHeap.model'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  boardWidth: number = 64
  boardHeight: number = 64
  squares: number[] = [];
  counter: number = 3;
  // isStartingLocation: boolean;
  // isEditMode: boolean;
  // isEndingLocation: boolean;
  // testDijkstra: DijkstrasShortestPathAdjacencyListWithDHeap;

  constructor(
    private squareStatServ: SquareStatusService,
    private dijkstrasServ: DijkstrasAlog) { }

  ngOnInit() {
    for (let i = 0; i < 20; i++) {
      // old value was  ^^^^1058
      this.squares.push(i);
    }

    // for (let y = 0; y < this.boardHeight; y++) {
    //   for (let x = 0; x < this.boardWidth; x++) {
    //     this.squares.push
    //   }
    // }

    // this.dijkstras.testDijkstra.addEdge(0, 3, 3);
    // this.dijkstras.testDijkstra.addEdge(0, 4, 8);
    // this.dijkstras.testDijkstra.addEdge(1, 3, 9);
    // this.dijkstras.testDijkstra.addEdge(2, 0, 3);
    // this.dijkstras.testDijkstra.addEdge(2, 1, 5);
    // this.dijkstras.testDijkstra.addEdge(2, 5, 5);
    // this.dijkstras.testDijkstra.addEdge(2, 6, 1);
    // this.dijkstras.testDijkstra.addEdge(3, 5, 1);
    // this.dijkstras.testDijkstra.addEdge(5, 7, 4);
    // this.dijkstras.testDijkstra.addEdge(7, 6, 7);
    // // custom under here
    // this.dijkstras.testDijkstra.addEdge(4, 9, 1);
    // console.log(this.dijkstras.testDijkstra.getGraph());
    console.log(this.dijkstrasServ.gettestgraph());
  }

  // createStartLocation() {

  // }


  onSquareClicked(index: number) {

    let currentMode: {} = {
      "isStartingLocation": false,
      "isEditMode": false,
      "isEndingLocation": false,
      "squareindex": index,
    }

    if (this.counter == 3) {
      currentMode["isStartingLocation"] = true;
      this.squareStatServ.activatedEmitterSquare.next(currentMode);

    }
    else if (this.counter == 2) {
      currentMode["isEditMode"] = true;
      this.squareStatServ.activatedEmitterSquare.next(currentMode);

    }
    else if (this.counter == 1) {
      currentMode["isEndingLocation"] = true;
      this.squareStatServ.activatedEmitterSquare.next(currentMode);

    }
    // this.squareStatServ.activatedEmitterSquare.next(index);
    this.counter--;
  }

  //  need to find a way to hold left mouse button to color squares faster
  // onSquaredragover(index: number) {
  //   setTimeout(() => {
  //     this.squareStatServ.activatedEmitterSquare.next(index);
  //   }, 500);
  // }

}
