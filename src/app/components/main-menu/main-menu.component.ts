import { Component, OnInit, OnDestroy } from '@angular/core';
import { DijkstrasAlog } from 'src/app/services/dijkstrasAlog.service';
import { SquareStatusService } from 'src/app/services/square-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  isAnimationInProgress: boolean;
  private animationInProgSubscription: Subscription;

  constructor(
    private dijkstrasAlgo: DijkstrasAlog,
    private squareStatusServ: SquareStatusService) { }

  ngOnInit() {
    this.animationInProgSubscription = this.squareStatusServ.animationInProgressHasChanged.subscribe((isStillInProgress) => {
      this.isAnimationInProgress = isStillInProgress;
    });
  }

  fullResetBoard() {
    let isFullReset = true;
    this.squareStatusServ.resetBoardData(isFullReset);
  }

  clearSearchPathAnimation(): void {
    let isFullReset = false;
    this.squareStatusServ.resetBoardData(isFullReset);
  }

  startVisualization() {
    if(!this.isAnimationInProgress) {
      this.dijkstrasAlgo.initiateVisualAlgorithm();
    }
  }

  ngOnDestroy() {
    if(this.animationInProgSubscription) {
      this.animationInProgSubscription.unsubscribe();
    }
  }
}
