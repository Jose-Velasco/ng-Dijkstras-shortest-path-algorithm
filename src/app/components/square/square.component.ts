import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SquareStatusService } from 'src/app/services/square-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit, OnDestroy {
  private activatedSquareSubscri: Subscription;
  @Input() sqaureIndex: number;
  clickedSquare: number;
  startSquareColor: boolean = false;
  wallSquareColor: boolean = false;
  endSquareColor: boolean = false;
  xCoordinate: number;
  yCoordinate: number;
  visited: boolean = false;


  constructor(private squareStatusServ: SquareStatusService) { }

  ngOnInit() {
    this.activatedSquareSubscri = this.squareStatusServ.activatedEmitterSquare.subscribe(currentMode => {
      // this.startSquareColor = currentMode[0];
      // this.wallSquareColor = currentMode[1];
      // this.endSquareColor = currentMode[2];
      // this.clickedSquare = currentMode[3];
      this.clickedSquare = currentMode["squareindex"];

      this.onCheckSquareStatus(currentMode);

    });
  }

  ngOnDestroy() {
    this.activatedSquareSubscri.unsubscribe();
  }

  onCheckSquareStatus(currentMode) {
    if (this.sqaureIndex == this.clickedSquare) {
      if (currentMode["isStartingLocation"] == true) {
        this.startSquareColor = true;
      }
      if (currentMode["isEditMode"] == true) {
        this.wallSquareColor = true;
      }
      if (currentMode["isEndingLocation"] == true) {
        this.endSquareColor = true;
      }

    }
  }


}
