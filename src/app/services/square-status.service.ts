import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SquareEventData } from '../shared/squareEventData.model';
import { ResetSquareData } from '../shared/resetSquareData.model';

@Injectable({
  providedIn: 'root'
})
export class SquareStatusService {
  activatedEmitterSquare = new Subject<SquareEventData>();
  private _onSquareVisited = new Subject<number>();
  private _onResetSquareproperties = new Subject<ResetSquareData>();
  private _startNode: number = null;
  private _endNode: number = null;
  private _animationTimer: ReturnType<typeof setTimeout>;
  private _isAnimationInProgress: boolean = false;
  private _orderOfVisitedNodes: number[] = [];
  private _shortestPath: number[] = [];
  private _stopAnimation: boolean = false;
  private _animationFramesPerMilSec: number = 150;
  private _nodeIsWall: boolean[] = [];
  private _indexsOfWhichNodeIsWall: number[] = [];

  constructor() { }

  get onSquareVisited(): Observable<number> {
    return this._onSquareVisited.asObservable();
  }
  get onResetSquareproperties(): Observable<ResetSquareData> {
    return this._onResetSquareproperties.asObservable();
  }
  get startNode(): number {
    return this._startNode;
  }
  get endNode(): number {
    return this._endNode;
  }
  get stopAnimation(): boolean {
    return this._stopAnimation;
  }
  set stopAnimation(hasStoped: boolean) {
    this._stopAnimation = hasStoped;
  }
  set startNode(nodeIndex: number) {
    this._startNode = nodeIndex;
  }
  set endNode(nodeIndex: number) {
    this._endNode = nodeIndex;
  }

  get nodeIsWall(): boolean[] {
    return this._nodeIsWall;
  }

  get indexsOfWhichNodeIsWall(): number[] {
    return this._indexsOfWhichNodeIsWall;
  }

  /**
   * only call once to initialize array with the amount of bool equal
   * to the number of nodes in the graph
   * @param numOfNodes the number of nodes in the graph
   */
  initializeNodeIsWallBoolArrayValues(numOfNodes: number): void {
    for(let i = 0; i < numOfNodes; i++) {
      this.nodeIsWall[i] = false;
    }
  }

  /**
   * used to clear all current walls
   */
  resetNodeAllIsWallArray(): void {
    for(let i = this.indexsOfWhichNodeIsWall.length - 1; 0 <= i; i--) {
      this.nodeIsWall[this.indexsOfWhichNodeIsWall[i]] = false;
      this.indexsOfWhichNodeIsWall.pop();
    }
  }

  // might have to check here to make sure wall being added is not a start or end node
  handleAddingWallNodes(nodeIndex: number): void {
    // this prevents from having duplicate nodes indexs that are walls
    if(this.indexsOfWhichNodeIsWall.includes(nodeIndex)) {
      return;
    }
    this.nodeIsWall[nodeIndex] = true;
    this.indexsOfWhichNodeIsWall.push(nodeIndex);
  }

  handleRemovingWallNodes(nodeIndex: number): void {
    for(let i = 0; i < this.indexsOfWhichNodeIsWall.length; i++) {
      if(this.indexsOfWhichNodeIsWall[i] === nodeIndex) {
        this.nodeIsWall[nodeIndex] = false;
        this.indexsOfWhichNodeIsWall.splice(nodeIndex, 1);
        let squareClickedData: SquareEventData = {
          nodeindex: nodeIndex,
          noKeyPressedWithRightMouseClick: true,
        };
        this.activatedEmitterSquare.next(squareClickedData);
        return;
      }
    }
  }

  resetBoardData(fullReset: boolean): void {
    if(fullReset) {
      this.stopAnimation = true;
      let resetDataValues: ResetSquareData = {
        fullReset: true,
        nodesIndexToBeReseted: null
      };
      let startAndEndNode: number[] = [this.startNode, this.endNode];
      let indexOfNodesToBeReset: number[] = this.createArrayOfNodesToBeReseted();
      // used plus to to account for the start and end node
      // for(let i = 0; i < (this._orderOfVisitedNodes.length + startAndEndNode.length); i++) {
      //   resetDataValues = {
      //     fullReset: true,
      //     nodesIndexToBeReseted: this._orderOfVisitedNodes[i]
      //   }
      //   this._onResetSquareproperties.next(resetDataValues);
      //   if(i < startAndEndNode.length) {
      //     resetDataValues.nodesIndexToBeReseted = startAndEndNode[i];
      //     this._onResetSquareproperties.next(resetDataValues);
      //   }
      // }
      for(let i = 0; i < indexOfNodesToBeReset.length; i++) {
        resetDataValues.nodesIndexToBeReseted = indexOfNodesToBeReset[i];
        this._onResetSquareproperties.next(resetDataValues);
      }
      console.log(indexOfNodesToBeReset);
      this.startNode = null;
      this.endNode = null;
      this._orderOfVisitedNodes = [];
      this._shortestPath = [];
      this.resetNodeAllIsWallArray();
    }
  }

  createArrayOfNodesToBeReseted(): number[] {
    // might be duplicate node index between _orderOfVisitedNodes _indexsOfWhichNodeIsWall
    // but once 'wall' check is added to dijkstras this might not be an issue
    let nodesToReset: number[] = [
      ...this._orderOfVisitedNodes,
      ...this._indexsOfWhichNodeIsWall,
    ];
    if(this.startNode != null) {
      nodesToReset.push(this.startNode);
    }
    if(this.endNode != null) {
      nodesToReset.push(this.endNode);
    }
    return nodesToReset;
  }

  // onVisualizeSearch(orderOfVisitedNodes: number[], shortestPath: number[]): void {
  //   // pathing holds an array of the minimum distance cost to each node/square
  //   // if the value is positive Infinity then the node was not visited
  //   console.log("start ===", this._startNode);
  //   console.log(this._endNode);
  //   const pathing: number[] = orderOfVisitedNodes;

  //   for(let i = 0; i < pathing.length; i++) {
  //     setTimeout(() => {
  //       this._onSquareVisited.next(pathing[i]);
  //       if(i === pathing.length - 1) {
  //         this.visualizeShortestPath(shortestPath);
  //       }
  //     }, 100 * i);
  //   }
  // }

  // visualizeShortestPath(pathing: number[]): void {
  //   for(let i = 0; i < pathing.length; i++) {
  //     setTimeout(() => {
  //       this._onSquareVisited.next(pathing[i]);
  //     }, 300 * i);
  //   }
  // }

  onVisualizeSearch(orderOfVisitedNodes: number[], shortestPath: number[]): void {
    // pathing holds an array of the minimum distance cost to each node/square
    // if the value is positive Infinity then the node was not visited
    this._orderOfVisitedNodes = orderOfVisitedNodes;
    this._shortestPath = shortestPath;
    let firstAnimIter: number = 0;
    const totalAnimationIterations: number = orderOfVisitedNodes.length + shortestPath.length;
    this.visualizeSearchAndShortestPathAnimation(false, totalAnimationIterations, firstAnimIter);
  }

  visualizeSearchAndShortestPathAnimation(isShortestPath: boolean, totalAnimationIter:number, currentIter: number) {
    // when we have finished iterating thru the vistedNodes array
    // then starrt going thru the shortestPath array
    if(currentIter >= this._orderOfVisitedNodes.length && !isShortestPath) {
      isShortestPath = true;
      currentIter = 0;
    }
    if(isShortestPath) {
      // once we finish iterating thru shortestPath array
      // set up breaking out of recursion
      if(currentIter >= this._shortestPath.length) {
        this.stopAnimation = true;
      } else {
        this._onSquareVisited.next(this._shortestPath[currentIter]);
      }
    } else {
      this._onSquareVisited.next(this._orderOfVisitedNodes[currentIter]);
    }
    // if we have stoped animation or once we gone thru both visted and shortest arrays
    // then stop animation and clean up setTimeout
    if(currentIter >= totalAnimationIter || this._stopAnimation) {
      this.stopAnimation = false;
      clearTimeout(this._animationTimer);
      return;
    } else {
      this._animationTimer = setTimeout(() => {
        this.visualizeSearchAndShortestPathAnimation(isShortestPath, totalAnimationIter, currentIter + 1);
      }, this._animationFramesPerMilSec);
    }
  }
}
