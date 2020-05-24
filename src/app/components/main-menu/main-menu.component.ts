import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DijkstrasAlog } from 'src/app/services/dijkstrasAlog.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private dijkstrasAlgo: DijkstrasAlog) { }

  ngOnInit() {
  }

  refreshComponent() {
    this.router.navigateByUrl('/board', { skipLocationChange: true }).then(() => {
      this.router.navigate(['']);
  });
  }

  startVisualization() {
    this.dijkstrasAlgo.initiateVisualAlgorithm();
  }
}
