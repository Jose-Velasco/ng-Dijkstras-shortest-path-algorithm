import { Component, OnInit } from '@angular/core';
import { SquareStatusService } from '../../services/square-status.service';


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




  constructor(private squareStatServ: SquareStatusService) { }

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      // old value was  ^^^^1058
      this.squares.push(i);
    }

    // for (let y = 0; y < this.boardHeight; y++) {
    //   for (let x = 0; x < this.boardWidth; x++) {
    //     this.squares.push
    //   }
    // }
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
