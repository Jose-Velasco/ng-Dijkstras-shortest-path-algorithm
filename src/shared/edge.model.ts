// An edge class to represent a directed edge
// between two nodes with a certain cost.
export class Edge {
  public to: number;
  public cost: number;

  constructor(to: number, cost: number) {
    this.to = to;
    this.cost = cost;
  }
}
