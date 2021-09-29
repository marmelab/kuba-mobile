import { Graph } from '../interface';

export const getMarblesCoordinateToAnimate = (
  marbleCoordinate: any,
  graph: Graph | null | undefined,
  direction: string,
) => {
  if (!marbleCoordinate || !graph || !direction) {
    return [];
  }

  let currentNode = graph.nodes[`${marbleCoordinate.x},${marbleCoordinate.y}`];

  const nodes = [currentNode];
  while (true) {
    const edge = graph.edges.find((edge) => {
      return (
        edge.direction === direction &&
        edge.from === `${currentNode.x},${currentNode.y}`
      );
    });

    if (!edge || !graph.nodes[edge.to]) {
      break;
    }

    currentNode = graph.nodes[edge.to];
    if (currentNode.value == 0) {
      break;
    }
    nodes.push(currentNode);
  }

  return nodes;
};
