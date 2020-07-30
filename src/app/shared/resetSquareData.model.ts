export interface ResetSquareData {
  fullReset: boolean;
  nodesIndexToBeReseted: number;
  optionToBeAdjusted?: SquareNodesOptionProperties[];
}

export enum SquareNodesOptionProperties {
  Start = "START",
  End = "END",
  Wall = "WALL",
  Visited = "VISITED",
  ShortestPath = "SHORTESTPATH"
}
