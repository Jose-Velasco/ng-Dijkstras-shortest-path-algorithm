import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DijkstrasAlog } from 'src/app/services/dijkstrasAlog.service';
import { SquareStatusService } from 'src/app/services/square-status.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private dijkstrasAlgo: DijkstrasAlog,
    private squareStatusServ: SquareStatusService) { }

  ngOnInit() {
  }

  refreshComponent() {
    // this.squareStatusServ.stopAnimation = true;
    this.squareStatusServ.resetBoardData(true);
  }

  clearSearchPathAnimation(): void {
    this.squareStatusServ.resetBoardData(false);
  }

  startVisualization() {
    this.dijkstrasAlgo.initiateVisualAlgorithm();
  }
}
