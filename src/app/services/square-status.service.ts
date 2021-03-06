import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SquareEventData } from '../shared/squareEventData.model';
import { ResetSquareData, SquareNodesOptionProperties } from '../shared/resetSquareData.model';
import { StartEndNodeCheckerData } from '../shared/startEndNodeCheckerData.interface';

@Injectable({
  providedIn: 'root'
})
export class SquareStatusService {
  activatedEmitterSquare = new Subject<SquareEventData>();
  private _onSquareVisited = new Subject<number>();
  private _onResetSquareproperties = new Subject<ResetSquareData>();
  private _animationInProgressHasChanged = new Subject<boolean>();
  private _startNode: number = null;
  private _endNode: number = null;
  private _animationTimer: ReturnType<typeof setTimeout>;
  private _isAnimationInProgress: boolean = false;
  private _orderOfVisitedNodes: number[] = [];
  private _shortestPath: number[] = [];
  private _stopAnimation: boolean = false;
  // this might need to be fixed because animation speeds
  // up as the value goes down
  private _animationFramesPerMilSec: number = 55;
  private _nodeIsWall: boolean[] = [];
  private _indexsOfWhichNodeIsWall: number[] = [];

  constructor() { }

  get onSquareVisited(): Observable<number> {
    return this._onSquareVisited.asObservable();
  }
  get onResetSquareproperties(): Observable<ResetSquareData> {
    return this._onResetSquareproperties.asObservable();
  }
  get animationInProgressHasChanged(): Observable<boolean> {
    return this._animationInProgressHasChanged.asObservable();
  }
  get startNode(): number {
    return this._startNode;
  }
  get endNode(): number {
    return this._endNode;
  }
  get isAnimationInProgress(): boolean {
    return this._isAnimationInProgress;
  }
  set isAnimationInProgress(isInProgress: boolean) {
    this._isAnimationInProgress = isInProgress;
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
   * returns a StartEndNodeCheckerData obj that has all values set to false
   * if the indexOfNode is not a start or end node
   * @param indexOfNode index of node to be checked
   */
  checkIsStartOrEndNode(indexOfNode: number): StartEndNodeCheckerData {
    let checkIsStartOrEndNodeData: StartEndNodeCheckerData = {
      isStartOrEndNode: false,
      isStartNode: false,
      isEndNode: false
    };

    if((this.startNode === indexOfNode) || (this.endNode === indexOfNode)) {
      let isEqualToStartNode: boolean = this.startNode === indexOfNode;
      checkIsStartOrEndNodeData.isStartOrEndNode = true;
      checkIsStartOrEndNodeData.isStartNode = isEqualToStartNode;
      checkIsStartOrEndNodeData.isEndNode = !isEqualToStartNode;
    }
    return checkIsStartOrEndNodeData;
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

  onHandleAddingWallNode(squareEventData: SquareEventData): void {
    if(!this.isAnimationInProgress) {
      this.activatedEmitterSquare.next(squareEventData);
      this.handleAddingWallNodes(squareEventData.nodeindex);
    }
  }

  handleAddingWallNodes(nodeIndex: number): void {
    const startEndNodeData = this.checkIsStartOrEndNode(nodeIndex);
    if(startEndNodeData.isStartOrEndNode) {
      this.handleWallingOverAStartOrEndNode(nodeIndex, startEndNodeData.isStartNode);
    }
    // this prevents from having duplicate nodes indexs that are walls
    if(this.indexsOfWhichNodeIsWall.includes(nodeIndex)) {
      return;
    }
    this.nodeIsWall[nodeIndex] = true;
    this.indexsOfWhichNodeIsWall.push(nodeIndex);
  }

  /**
   * when creating a wall over a start or end node this handles
   * making sure to update the node to not be a start or end node to avoid visual
   * and logic bugs
   * @param nodeIndex node/square index to be reset to default values
   * @param isStartNode is the start node/square or the end node/sqaure
   */
  private handleWallingOverAStartOrEndNode(nodeIndex:number, isStartNode: boolean) {
    if(!this.checkIsStartOrEndNode(nodeIndex).isStartOrEndNode) {
      return;
    }
    let adjustSquareData: ResetSquareData = {
      fullReset: false,
      nodesIndexToBeReseted: nodeIndex,
      optionToBeAdjusted: []
    };
    if(isStartNode) {
      this.startNode = null;
      adjustSquareData.optionToBeAdjusted.push(SquareNodesOptionProperties.Start);
      this._onResetSquareproperties.next(adjustSquareData);
    } else {
      this.endNode = null;
      adjustSquareData.optionToBeAdjusted.push(SquareNodesOptionProperties.End);
      this._onResetSquareproperties.next(adjustSquareData);
    }
  }

  /**
   * checks if the node 'wall' being removed is a node marked as a wall and removes it
   * from the indexsOfWhichNodeIsWall.
   * notice the usage of nodeIndex and 'i' when marking a node as not being a 'wall'.
   * In the for loop 'i' represents the index location of the node being removed in the
   * indexsOfWhichNodeIsWall.
   * @param nodeIndex index of node to be removed from indexsOfWhichNodeIsWall array if it has been marked as a wall
   */
  handleRemovingWallNodes(nodeIndex: number): void {
    for(let i = 0; i < this.indexsOfWhichNodeIsWall.length; i++) {
      if(this.indexsOfWhichNodeIsWall[i] === nodeIndex) {
        let squareClickedData: SquareEventData = {
          nodeindex: nodeIndex,
          noKeyPressedWithRightMouseClick: true,
        };
        this.activatedEmitterSquare.next(squareClickedData);
        this.nodeIsWall[nodeIndex] = false;
        this.indexsOfWhichNodeIsWall.splice(i, 1);
        return;
      }
    }
  }

  onHandleRemovingWallNodes(nodeIndex: number): void {
    if(!this.isAnimationInProgress) {
      this.handleRemovingWallNodes(nodeIndex);
    }
  }

  handleAddingStartEndNodes(squareEventData: SquareEventData): void {
    if(!this.isAnimationInProgress) {
      if(this.nodeIsWall[squareEventData.nodeindex]) {
        this.handleRemovingWallNodes(squareEventData.nodeindex);
      }
      this.activatedEmitterSquare.next(squareEventData);
    }
  }

  /**
   * True will wipe the whole board clean.
   * false will ONLY wipe the square/node animation that occurs during dijkstras algorithm (path search),
   * this will still keep nodes marked as walls or start/end nodes.
   * @param fullReset true will reset all touched node values to untouched values(default)
   */
  resetBoardData(fullReset: boolean): void {
    this.stopAnimation = true;
    let resetDataValues: ResetSquareData = {
      fullReset: null,
      nodesIndexToBeReseted: null
    };
    let indexOfNodesToBeReset: number[];
    if(fullReset) {
      resetDataValues.fullReset = true;
      indexOfNodesToBeReset = this.createArrayOfNodesToBeReseted(fullReset);
      for(let i = 0; i < indexOfNodesToBeReset.length; i++) {
        resetDataValues.nodesIndexToBeReseted = indexOfNodesToBeReset[i];
        this._onResetSquareproperties.next(resetDataValues);
      }
      this.startNode = null;
      this.endNode = null;
      this.resetNodeAllIsWallArray();
    }
    if(!fullReset) {
      resetDataValues.fullReset = false;
      resetDataValues.optionToBeAdjusted = [SquareNodesOptionProperties.Visited, SquareNodesOptionProperties.ShortestPath];
      indexOfNodesToBeReset = this.createArrayOfNodesToBeReseted(resetDataValues.fullReset);
      for(let i = 0; i < indexOfNodesToBeReset.length; i++) {
        resetDataValues.nodesIndexToBeReseted = indexOfNodesToBeReset[i];
        this._onResetSquareproperties.next(resetDataValues);
      }
    }
    this._orderOfVisitedNodes.length = 0;
    this._shortestPath.length = 0;
  }

  /**
   *
   * True value will return an array that contains all the nodes that had
   * values that at some point were touch, in order to be used to fully reset all values.
   * False value will return an array that contains only nodes that were changed
   * during the animation.
   * @param isFullReset true to get arrry for full reset
   */
  createArrayOfNodesToBeReseted(isFullReset: boolean): number[] {
    // might be duplicate node index between _orderOfVisitedNodes _indexsOfWhichNodeIsWall
    // but once 'wall' check is added to dijkstras this might not be an issue
    let nodesToReset: number[];
    if(isFullReset) {
      nodesToReset = [
        ...this._orderOfVisitedNodes,
        ...this._indexsOfWhichNodeIsWall,
      ];
      if(this.startNode != null) {
        nodesToReset.push(this.startNode);
      }
      if(this.endNode != null) {
        nodesToReset.push(this.endNode);
      }
    } else {
      nodesToReset = [
        ...this._orderOfVisitedNodes,
      ];
    }
    return nodesToReset;
  }

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
    // might be an issue beacuse this is not changed at the very instance when the algorithm is started
    if(!this.isAnimationInProgress) {
      this.isAnimationInProgress = true;
      this._animationInProgressHasChanged.next(this.isAnimationInProgress);
    }
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
      this.isAnimationInProgress = false;
      this._animationInProgressHasChanged.next(this.isAnimationInProgress);
      clearTimeout(this._animationTimer);
      return;
    } else {
      this._animationTimer = setTimeout(() => {
        this.visualizeSearchAndShortestPathAnimation(isShortestPath, totalAnimationIter, currentIter + 1);
      }, this._animationFramesPerMilSec);
    }
  }
}
