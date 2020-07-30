import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SquareStatusService } from 'src/app/services/square-status.service';
import { Subscription } from 'rxjs';
import { SquareEventData } from 'src/app/shared/squareEventData.model';
import { ResetSquareData, SquareNodesOptionProperties } from 'src/app/shared/resetSquareData.model';

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
  isWallSquare: boolean = false;
  endSquareColor: boolean = false;
  hasBeenVisited: boolean = false;
  isOnShortestPath: boolean = false;

  constructor(private squareStatusServ: SquareStatusService) { }

  ngOnInit() {
    this.activatedSquareSub = this.squareStatusServ.activatedEmitterSquare.subscribe((squareEventData: SquareEventData) => {
      // fix to handle only one start and end square visually
      // if(this.squareIndex === squareEventData.nodeindex) {
      //   if(squareEventData.sKeyPressed || squareEventData.EKeyPressed) {
      //     this.handleStartEndNodeEvent(squareEventData);
      //   } else if(squareEventData.noKeyPressedWithLeftMouseClick || squareEventData.noKeyPressedWithRightMouseClick) {
      //     this.handleWallNodeEvent(squareEventData);
      //   }
      // }
      if(squareEventData.noKeyPressedWithLeftMouseClick || squareEventData.noKeyPressedWithRightMouseClick) {
        this.handleWallNodeEvent(squareEventData);
      } else if(squareEventData.sKeyPressed || squareEventData.EKeyPressed) {
        this.handleStartEndNodeEvent(squareEventData);
      }
    });

    this.squareStatusSub = this.squareStatusServ.onSquareVisited.subscribe((nodeIndex: number) => {
      if(this.hasBeenVisited && (nodeIndex == this.squareIndex)) {
        this.isOnShortestPath = true;
      } else if (this.squareIndex == nodeIndex) {
        this.hasBeenVisited = true;
      }
    });
    this.resetSquPropertiesSub = this.squareStatusServ.onResetSquareproperties.subscribe((fullResetData: ResetSquareData) => {
      if(fullResetData.fullReset) {
        this.resetSquareTouchedProperties(fullResetData.nodesIndexToBeReseted);
      } else {
        // this.handleRestANodeProperties(fullResetData.nodesIndexToBeReseted, fullResetData.optionToBeAdjusted);
        this.handlePartialReset(fullResetData);
      }
    });
  }

  handleStartEndNodeEvent(sqEventData: SquareEventData) {
    // CURRENTLY BORKEN
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

  // handles wall nodes events visually
  handleWallNodeEvent(sqEventData: SquareEventData) {
    if(this.squareIndex === sqEventData.nodeindex && sqEventData.noKeyPressedWithLeftMouseClick) {
      this.isWallSquare = true;
    } else if(this.squareIndex === sqEventData.nodeindex && sqEventData.noKeyPressedWithRightMouseClick) {
      this.isWallSquare = false;
    }
  }

  resetSquareTouchedProperties(nodeIndex: number) {
    if(nodeIndex === this.squareIndex) {
      this.startSquareColor = false;
      this.isWallSquare = false;
      this.endSquareColor = false;
      this.hasBeenVisited = false;
      this.isOnShortestPath = false;
    }
  }

  handleRestANodeProperties(nodeIndex: number, optionToBeReset: SquareNodesOptionProperties): void {
    if(this.squareIndex === nodeIndex) {
      switch(optionToBeReset) {
        case SquareNodesOptionProperties.Start:
          this.startSquareColor = false;
          break;
        case SquareNodesOptionProperties.End:
          this.endSquareColor = false;
          break;
        case SquareNodesOptionProperties.Wall:
          this.isWallSquare = false;
          break;
        case SquareNodesOptionProperties.Visited:
          this.hasBeenVisited = false;
          break;
        case SquareNodesOptionProperties.ShortestPath:
          this.isOnShortestPath = false;
          break;
      }
    }
  }

  handlePartialReset(resetSquareData: ResetSquareData): void {
    for(let i = 0; i < resetSquareData.optionToBeAdjusted.length; i++) {
      this.handleRestANodeProperties(resetSquareData.nodesIndexToBeReseted, resetSquareData.optionToBeAdjusted[i]);
    }
  }

  ngOnDestroy() {
    console.log("sqaure destytored");
    this.activatedSquareSub.unsubscribe();
    this.squareStatusSub.unsubscribe();
    this.resetSquPropertiesSub.unsubscribe();
  }
}
