import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SquareStatusService {
  activatedEmitterSquare = new Subject<{}>();
  private _onSquareVisited = new Subject<number>();

  constructor() { }

  get onSquareVisited(): Observable<number> {
    return this._onSquareVisited.asObservable();
  }

  onVisualizeSearch(dist: number[]) {
    // pathing holds an array of the minimum distance cost to each node/square
    // if the value is positive Infinity then the node was not visited
    const pathing: number[] = dist;

    for(let i = 0; i < pathing.length; i++) {
      // if(pathing[i] == Number.POSITIVE_INFINITY) {
      //   continue;
      // }
      setTimeout(() => {
        this._onSquareVisited.next(pathing[i]);
      }, 900 * i);
    }
  }
}
