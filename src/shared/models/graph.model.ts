export class Graph<T = any> {
  private _entryNode: Node<T>;
  private _nodes: Map<number, Node<T>> = new Map();
  private _edges: Map<number, EdgeWithNodeId[]> = new Map();
  private lastNodeId = 1;

  public get entryNode() {
    return this._entryNode;
  }

  constructor(firstNodeValue: T) {
    this._entryNode = this.initNode(firstNodeValue);
    this._nodes.set(this._entryNode.id, this._entryNode);
  }

  nodeIsInGraph(node: Node<T>) {
    return this._nodes.has(node.id);
  }

  addNode(value: T, source: Node<T>, weight: number): Node<T> {
    if (!this.nodeIsInGraph(source)) {
      throw new Error(
        "could not add node because source was not found in graph"
      );
    }

    const newNode = this.initNode(value);

    this._nodes.set(newNode.id, newNode);
    this.addEdgeToNode(source, {
      target: newNode,
      weight,
    });

    return newNode;
  }

  addEdgeToNode(node: Node<T>, edge: Edge<T>) {
    if (!this.getNodeById(node.id)) {
      throw new Error(
        "could not add edge to the node because it was not found in graph"
      );
    }

    const edges = this.getAllAdjacents(node);
    const edgesWithNodeId = this.mapEdgeToEdgeWithNodeId(edges);
    edgesWithNodeId.push({ nodeId: edge.target.id, weight: edge.weight });
    this._edges.set(node.id, edgesWithNodeId);
  }

  getAdjacentByWeight(node: Node<T>, weight: number) {
    if (!this.getNodeById(node.id)) {
      throw new Error("node not found in graph");
    }
    const edges = this.getAllAdjacents(node);
    return edges.find((e) => e.weight === weight)?.target;
  }

  getAllAdjacents(node: Node<T>): Edge<T>[] {
    if (!this.getNodeById(node.id)) {
      throw new Error("node not found");
    }

    const edges = this._edges.get(node.id) || [];

    return edges.map((edge) => ({
      target: this.getNodeById(edge.nodeId),
      weight: edge.weight,
    }));
  }

  getAllNodes() {
    return Array.from(this._nodes.values());
  }

  updateNodeValue(node: Node<T>, newValue: T) {
    const nodeInGraph = this.getNodeById(node.id);
    if (!nodeInGraph) {
      throw new Error("cannot find a node to update");
    }

    node.value = newValue;
  }

  private getNodeById(id: number): Node<T> {
    const node = this._nodes.get(id);
    if (!node) {
      throw new Error("node not found");
    }
    return node;
  }

  private mapEdgeToEdgeWithNodeId(edges: Edge[]): EdgeWithNodeId[] {
    return edges.map((edge) => ({
      nodeId: edge.target.id,
      weight: edge.weight,
    }));
  }

  private initNode(value: T): Node<T> {
    const newNode = new Node(this.lastNodeId, value);
    this.lastNodeId++;
    return newNode;
  }
}

type EdgeWithNodeId = { nodeId: number; weight: number };
type Edge<T = any> = { target: Node<T>; weight: number };

export class Node<T = any> {
  constructor(private _id: number, public value: T) {}

  public get id() {
    return this._id;
  }
}
