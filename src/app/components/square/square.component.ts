import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SquareStatusService } from 'src/app/services/square-status.service';
import { Subscription } from 'rxjs';
import { SquareEventData } from 'src/app/shared/squareEventData.model';
import { ResetSquareData } from 'src/app/shared/resetSquareData.model';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit, OnDestroy {
  private activatedSquareSub: Subscription;
  private squareStatusSub: Subscription;
  private resetSquPropertiesSub: Subscription;
  @Input() squareIndex: number;
  startSquareColor: boolean = false;
  wallSquareColor: boolean = false;
  endSquareColor: boolean = false;
  hasBeenVisited: boolean = false;
  isOnShortestPath: boolean = false;

  constructor(private squareStatusServ: SquareStatusService) { }

  ngOnInit() {
    this.activatedSquareSub = this.squareStatusServ.activatedEmitterSquare.subscribe((squareEventData: SquareEventData) => {
      this.handleStartEndNodeEvent(squareEventData);
    });

    this.squareStatusSub = this.squareStatusServ.onSquareVisited.subscribe((nodeIndex: number) => {
      console.log(nodeIndex);
      if(this.hasBeenVisited && (nodeIndex == this.squareIndex)) {
        this.isOnShortestPath = true;
      } else if (this.squareIndex == nodeIndex) {
        this.hasBeenVisited = true;
      }
    });
    this.resetSquPropertiesSub = this.squareStatusServ.onResetSquareproperties.subscribe((fullResetData: ResetSquareData) => {
      if(fullResetData.fullReset) {
        this.resetSquareProperties(fullResetData.nodesIndexToBeReseted);
      }
    });
  }

  handleStartEndNodeEvent(sqEventData: SquareEventData) {
    // to make sure there is only one start and end node
    if(sqEventData.sKeyPressed) {
      this.startSquareColor = false;
    } else if(sqEventData.EKeyPressed) {
      this.endSquareColor = false;
    }

    // if the node was clicked
    // update start and end node indexs
    if(this.squareIndex === sqEventData.nodeindex) {
      if(sqEventData.sKeyPressed) {
        this.squareStatusServ.startNode = this.squareIndex;
        this.startSquareColor = true;
        this.endSquareColor = false;
      } else if(sqEventData.EKeyPressed) {
        this.squareStatusServ.endNode = this.squareIndex;
        this.endSquareColor = true;
        this.startSquareColor = false;
      }
    }
  }

  resetSquareProperties(nodeIndex: number) {
    if(nodeIndex === this.squareIndex) {
      this.startSquareColor = false;
      this.wallSquareColor = false;
      this.endSquareColor = false;
      this.hasBeenVisited = false;
      this.isOnShortestPath = false;
    }
  }

  ngOnDestroy() {
    console.log("sqaure destytored");
    this.activatedSquareSub.unsubscribe();
    this.squareStatusSub.unsubscribe();
  }
}
