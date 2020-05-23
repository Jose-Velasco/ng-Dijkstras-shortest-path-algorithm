/**
* This file contains an implementation of Dijkstra's shortest path algorithm from a start node to a
* specific ending node. Dijkstra's can also be modified to find the shortest path between a
* starting node and all other nodes in the graph with minimal effort.
*/

import { Edge } from './edge.model';
import { MinIndexedDHeap } from './minIndexedDHeap.model';

// ArrayList class is a resizable array, which can be found in the java.util package

export class DijkstrasShortestPathAdjacencyListWithDHeap {
  // properties should only be modifiable when an object is first created.
  // readonly before the name of the property does this
  // The number of nodes in the graph.
  private readonly numOfNodes: number;

  private edgeCount: number;
  private dist: number[];
  private prev: number[];
  // Adjacency List
  // dynamic arrays (vector in C++/ArrayList in Java) to represent adjacency
  // lists instead of linked list.
  // The resizeable array implementation has advantages of cache friendliness
  // VS linked lists
  private graph: Edge[][];

  /**
   * Initialize the solver by providing the graph size and a starting node. Use the {@link #addEdge}
   * method to actually add edges to the graph.
   * @param numOfNode - the number of nodes in the graph
   */
  constructor(numOfNode: number) {
    this.numOfNodes = numOfNode;
    this.createEmptyGraph();
  }

  // Construct an empty graph with n nodes including the source and sink nodes.
  private createEmptyGraph(): void {
    this.graph = [];
    this.edgeCount = 0;
    for(let i = 0; i < this.numOfNodes; i++) {
      this.graph.push([]);
    }
  }

  /**
   * adds a directed edge to the graph
   *
   * @param from - the index of the node the directed edge starts at.
   * @param to - the index of the node the directed edge end at.
   * @param cost - the cost of the edge.
   */
  public addEdge(from: number, to: number, cost: number): void {
    this.edgeCount++;
    this.graph[from].push(new Edge(to, cost));
  }

  /**
   * method to retrieve the
   * constructed graph.
   */
  public getGraph(): Edge[][] {
    return this.graph;
  }

  // Run Dijkstra's algorithm on a directed graph to find the shortest path
  // from a starting node to an ending node. If there is no path between the
  // starting node and the destination node the returned value is set to be
  // Double.POSITIVE_INFINITY.
  public dijkstra(start: number, end: number): number {

    // keep an Index Priority Queue (ipq) of the next most promising node
    // to vist
    const degree = Math.floor(this.edgeCount / this.numOfNodes);
    // a min indexed d-arry heap to avoid duplicate nodes in the priority que
    // which makes the algarith faster (this is what makes the eager approach)
    const ipq: MinIndexedDHeap = new MinIndexedDHeap(degree, this.numOfNodes);
    ipq.insert(start, 0.0);

    // maintain an array of the minium distance to each other
    // const dist: number[] = new Array(this.numOfNodes);
    const dist: number[] = [];
    // dist.fill(Number.POSITIVE_INFINITY, 0, this.numOfNodes);
    for(let k = 0; k < this.numOfNodes; k++) {
      dist[k] = Number.POSITIVE_INFINITY;
    }
    dist[start] = 0.0;

    // const visited: boolean[] = new Array(this.numOfNodes);
    // prev: number[] = new Array(this.numOfNodes);
    const visited: boolean[] = [];
    this.prev = [];

    while(!ipq.isEmpty()) {
      let nodeId: number = ipq.peekMinKeyIndex();

      visited[nodeId] = true;
      let minValue: any = ipq.pollMinValue();

      // we already found a better path before we got to
      // processing this node so we can ignore it
      if(minValue > dist[nodeId]) {
        continue;
      }

      this.graph[nodeId].forEach((edge: Edge) => {

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
        let newDist: number = dist[nodeId] + edge.cost;
        if(newDist < dist[edge.to]) {
          this.prev[edge.to] = nodeId;
          dist[edge.to] = newDist;
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
        return dist[end];
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
    for(let at = end; at != null; at = this.prev[at]) {
      path.push(at);
    }
    path.reverse();
    return path;
  }

}
