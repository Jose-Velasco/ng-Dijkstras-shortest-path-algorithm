import { Injectable } from '@angular/core';
import { Edge } from '../shared/edge.model';
import { MinIndexedDHeap } from '../shared/minIndexedDHeap.model';
import { DijkstrasShortestPathAdjacencyListWithDHeap } from '../shared/dijkstrasShortestPathAdjacencyListWithDHeap.model';
import { SquareStatusService } from './square-status.service';

@Injectable({
  providedIn: "root"
})
export class DijkstrasAlog extends DijkstrasShortestPathAdjacencyListWithDHeap {
  private _numOfNodes: number;

  private _edgeCount: number;
  private _dist: number[];
  private _prev: number[];
  private _graph: Edge[][];
  private _orderOfVisitedNodes: number[];

  constructor(private squareStatusServ: SquareStatusService) {
    super(18);
    this._graph = this.getGraph();
    this._edgeCount = this.getedgeCount();
    this._numOfNodes = this.getnumofNodes();
    this.constructNodeEdges();
  }

  /**
   * algorithm to handle linking each node to its neighbors.
   */
  constructNodeEdges(): void {
    let counter = 0;
    let nodesPerRow = 6;
    for(let i = 0; i < this._numOfNodes; i++) {
      // BELOW NODE
      // as long as it is not the last row because
      // there are no nodes below the nodes in th last row
      if((i) < (this._numOfNodes - nodesPerRow)) {
        // used to add edges from a node to the one below it.
        this.addEdge(i, i + nodesPerRow, 1);
      }
      // ABOVE NODE
      // as long as it is not the first row.
      if(i >= nodesPerRow) {
        // added edges from a node to the on above it.
        this.addEdge(i, i - nodesPerRow, 1);
      }
      if(i % nodesPerRow !== 0) {
        this.addEdge(i , i - 1, 1);
      }
      /**
       * used to handle wrap around at the last node in a row.
       * so the last node of a row does not have an edge to the
       * first node of the NEXT row
       */
      if(i % nodesPerRow === (nodesPerRow - 1)) {
        counter++;
        continue;
      }
      // RIGHT OF NODE
      // add edge from current node to the one directly to the right of it
      // as long as it is not the last node in a row.
      this.addEdge(i, i+1, 1);
      counter++;
    }
  }

  public addEdge(from: number, to: number, cost: number): void {
    this._edgeCount++;
    this._graph[from].push(new Edge(to, cost));
  }

  public dijkstra(start: number, end: number): number {

    // keep an Index Priority Queue (ipq) of the next most promising node
    // to vist
    const degree = Math.floor(this._edgeCount / this._numOfNodes);
    // a min indexed d-arry heap to avoid duplicate nodes in the priority que
    // which makes the algarith faster (this is what makes the eager approach)
    const ipq: MinIndexedDHeap = new MinIndexedDHeap(degree, this._numOfNodes);
    ipq.insert(start, 0.0);

    // maintain an array of the minium distance to each other
    this._dist = [];
    this._orderOfVisitedNodes = [];
    for(let k = 0; k < this._numOfNodes; k++) {
      this._dist[k] = Number.POSITIVE_INFINITY;
    }
    this._dist[start] = 0.0;

    const visited: boolean[] = [];
    this._prev = [];

    while(!ipq.isEmpty()) {
      let nodeId: number = ipq.peekMinKeyIndex();

      visited[nodeId] = true;
      // array that holds the order each node was visted
      // used to recreate visual animation
      this._orderOfVisitedNodes.push(nodeId);
      let minValue: any = ipq.pollMinValue();

      // we already found a better path before we got to
      // processing this node so we can ignore it
      if(minValue > this._dist[nodeId]) {
        continue;
      }

      this._graph[nodeId].forEach((edge: Edge) => {
        // we cannot get a shorter path by revisiting
        // a node we have already visited before
        /**
         * Error: Jump target cannot cross function boundary
         * fix: use return it will only stop executing the
         * current iteration of the forEach loop (lambda expression)
         */
        if(visited[edge.to]) {
          return;
        }

        // relax edge by updating minimum cost if applicable
        let newDist: number = this._dist[nodeId] + edge.cost;
        if(newDist < this._dist[edge.to]) {
          this._prev[edge.to] = nodeId;
          this._dist[edge.to] = newDist;
          // insert the cost of going to a node for the first time in the PQ,
          // or try and update it to a better value by calling decrease
          if(!ipq.contains(edge.to)) {
            ipq.insert(edge.to, newDist);
          } else {
            ipq.decrease(edge.to, newDist);
          }
        }
      });
      // Once we've processed the end node we can return early (without
      // necessarily visiting the whole graph) because we know we cannot get a
      // shorter path by routing through any other nodes since Dijkstra's is
      // greedy and there are no negative edge weights.
      if(nodeId == end) {
        return this._dist[end];
      }
    }
    // end node is unreachable
    return Number.POSITIVE_INFINITY
  }

  /**
   * Reconstructs the shortest path (of nodes) from 'start' to 'end' inclusive.
   *
   * @return An array of node indexes of the shortest path from 'start' to 'end'. If 'start' and
   *     'end' are not connected then an empty array is returned.
   */
  public reconstructPath(start: number, end: number): number[] {
    const path: number[] = [];
    let dist: number = this.dijkstra(start, end);
    if(dist == Number.POSITIVE_INFINITY) {
      return path;
    }
    for(let at = end; at != null; at = this._prev[at]) {
      path.push(at);
    }
    path.reverse();
    return path;
  }

  getdist(): number[] {
    return this._dist;
  }

   gettestgraph() {
    return this._graph;
  }

  // visualizeSearch(): void {

  //   const isEndNodeReachable: boolean = this.reconstructPath(0, 1).length === 0? true: false;
  //   if(isEndNodeReachable) {
  //     console.log("is end node reachable: ", false);
  //     return isEndNodeReachable;
  //   }
  //   this.squareStatusServ.onVisualizeSearch(this._orderOfVisitedNodes);
  //   return isEndNodeReachable;
  // }

  initiateVisualAlgorithm(): void {
    const pathing: number[] = this.reconstructPath(0, 11);
    const isEndNodeReachable: boolean = (pathing.length !== 0);
    if(isEndNodeReachable) {
      this.squareStatusServ.onVisualizeSearch(this._orderOfVisitedNodes);
      return;
    }
    console.log("is end node reachable: ", isEndNodeReachable);
  }

}
