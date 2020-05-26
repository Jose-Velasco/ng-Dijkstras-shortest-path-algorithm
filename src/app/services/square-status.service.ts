import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SquareEventData } from '../shared/squareEventData.model';

@Injectable({
  providedIn: 'root'
})
export class SquareStatusService {
  activatedEmitterSquare = new Subject<SquareEventData>();
  private _onSquareVisited = new Subject<number>();
  private _startNode: number = null;
  private _endNode: number = null;

  constructor() { }

  get onSquareVisited(): Observable<number> {
    return this._onSquareVisited.asObservable();
  }
  get startNode(): number {
    return this._startNode;
  }
  get endNode(): number {
    return this._endNode;
  }
  set startNode(nodeIndex: number) {
    this._startNode = nodeIndex;
  }
  set endNode(nodeIndex: number) {
    this._endNode = nodeIndex;
  }

  resetBoardData(): void {
    this.startNode = null;
    this.endNode = null;
  }

  onVisualizeSearch(orderOfVisitedNodes: number[], shortestPath: number[]): void {
    // pathing holds an array of the minimum distance cost to each node/square
    // if the value is positive Infinity then the node was not visited
    console.log("start ===", this._startNode);
    console.log(this._endNode);
    const pathing: number[] = orderOfVisitedNodes;

    for(let i = 0; i < pathing.length; i++) {
      setTimeout(() => {
        this._onSquareVisited.next(pathing[i]);
        if(i === pathing.length - 1) {
          this.visualizeShortestPath(shortestPath);
        }
      }, 100 * i);
    }
  }

  visualizeShortestPath(pathing: number[]): void {
    for(let i = 0; i < pathing.length; i++) {
      setTimeout(() => {
        this._onSquareVisited.next(pathing[i]);
      }, 300 * i);
    }
  }
}
