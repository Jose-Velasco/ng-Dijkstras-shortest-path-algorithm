import { Injectable } from '@angular/core';
import { Edge } from '../shared/edge.model';
import { MinIndexedDHeap } from '../shared/minIndexedDHeap.model';
import { DijkstrasShortestPathAdjacencyListWithDHeap } from '../shared/dijkstrasShortestPathAdjacencyListWithDHeap.model';

@Injectable({
  providedIn: "root"
})
export class DijkstrasAlog extends DijkstrasShortestPathAdjacencyListWithDHeap {
  private _numOfNodes: number;

  private _edgeCount: number;
  private _dist: number[];
  private _prev: number[];
  private _graph: Edge[][];

  constructor() {
    super(9);
    this._graph = this.getGraph();
    this._edgeCount = this.getedgeCount();
    this._dist = this.getdist();
    this._prev = this.getprev();
    this._numOfNodes = this.getnumofNodes();
  }

   gettestgraph() {
    return this._graph;
  }

  // tesxt() {

  // }

}
