import { Directions } from "../enums/directions.enum";

export default class Graph<T = any> {
  private nodes: Map<string, T> = new Map();
  private edges: Map<string, Edge<T>[]> = new Map();

  addNode(node: T) {
    this.nodes.set(JSON.stringify(node), node);
  }

  addEdge(node: T, edge: Edge<T>) {
    if (!this.getNode(node)) {
      throw new Error("node not found in graph");
    }

    const edgesOfNode = this.edges.get(JSON.stringify(node)) || [];

    this.edges.set(JSON.stringify(node), [...edgesOfNode, edge]);
  }

  getNode(value: T) {
    const node = this.nodes.get(JSON.stringify(value));
    //if (!node) throw new Error("node not found in graph");
    return node;
  }

  getAdjacentbByWeight(node: T, weight: number) {
    const foundNode = this.getNode(node);
    if (!foundNode) throw new Error("node not found in graph");

    const edges = this.edges.get(JSON.stringify(node)) || [];
    return edges.find((e) => e.weight === weight)?.target;
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  updateNodeValue(node: T, newValue: T) {
    const key = JSON.stringify(node);
    if (key) {
      this.nodes.delete(key);

      this.nodes.set(JSON.stringify(newValue), newValue);
    }
  }
}

type Edge<T> = { target: T; weight: Directions };

class Node<T = any> {
  constructor(public value?: T) {}
}
