import { Component, OnInit } from '@angular/core';
import { DijkstrasShortestPathAdjacencyListWithDHeap } from 'src/shared/DijkstrasShortestPathAdjacencyListWithDHeap.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  testDijkstra: DijkstrasShortestPathAdjacencyListWithDHeap;

  constructor() {

  }

  ngOnInit() {
    this.testDijkstra = new DijkstrasShortestPathAdjacencyListWithDHeap(20);
    this.testDijkstra.addEdge(0, 1, 1);
    this.testDijkstra.addEdge(5, 1, 1);
    this.testDijkstra.addEdge(0, 2, 1);
    this.testDijkstra.addEdge(1, 5, 1);
    this.testDijkstra.addEdge(2, 5, 1);
    this.testDijkstra.addEdge(1, 4, 1);
    this.testDijkstra.addEdge(1, 12, 1);
    this.testDijkstra.addEdge(3, 2, 1);
    this.testDijkstra.addEdge(3, 5, 1);
    this.testDijkstra.addEdge(3, 1, 1);
    this.testDijkstra.addEdge(6, 5, 1);
    this.testDijkstra.addEdge(6, 0, 1);
    this.testDijkstra.addEdge(19, 0, 1);
    this.testDijkstra.addEdge(1, 7, 1);
    this.testDijkstra.addEdge(1, 8, 1);
    this.testDijkstra.addEdge(1, 16, 1);
    this.testDijkstra.addEdge(18, 0, 1);
    this.testDijkstra.addEdge(17, 0, 1);
    this.testDijkstra.addEdge(19, 6, 1);
    this.testDijkstra.addEdge(8, 1, 1);
    this.testDijkstra.addEdge(0, 17, 1);
    this.testDijkstra.addEdge(10, 15, 1);
    this.testDijkstra.addEdge(12, 11, 1);
    this.testDijkstra.addEdge(11, 1, 1);
    this.testDijkstra.addEdge(15, 0, 1);
    this.testDijkstra.addEdge(7, 8, 1);
    this.testDijkstra.addEdge(4, 8, 1);
    this.testDijkstra.addEdge(9, 0, 1);
    this.testDijkstra.addEdge(13, 11, 1);
    this.testDijkstra.addEdge(14, 18, 1);
    this.testDijkstra.addEdge(17, 0, 1);
    this.testDijkstra.addEdge(16, 12, 1);
    this.testDijkstra.addEdge(17, 0, 1);
    this.testDijkstra.addEdge(0, 19, 1);
    this.testDijkstra.addEdge(18, 1, 1);
    this.testDijkstra.addEdge(1, 18, 1);
    console.log(this.testDijkstra.getGraph());
    console.log(this.testDijkstra.reconstructPath(9, 18));
  }

}
