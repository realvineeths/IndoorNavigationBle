function dijkstraWithPredecessors(graph, startNode, endNode) {
    const distances = {};
    const predecessors = {};
    const unvisitedNodes = Object.keys(graph);
  
    for (const node of unvisitedNodes) {
      distances[node] = Infinity;
      predecessors[node] = null;
    }
  
    distances[startNode] = 0;
  
    while (unvisitedNodes.length > 0) {//relaxation of the edges of the graph
      let currentNode = null;
      for (const node of unvisitedNodes) {
        if (!currentNode || distances[node] < distances[currentNode]) {
          currentNode = node;
        }
      }
  
      if (currentNode === endNode) {
        break;
      }
  
      const neighbors = graph[currentNode];
      for (const neighbor of neighbors) {
        const neighborNode = Object.keys(neighbor)[0];
        const distance = neighbor[neighborNode];
        const potential = distances[currentNode] + distance;
        if (potential < distances[neighborNode]) {
          distances[neighborNode] = potential;
          predecessors[neighborNode] = currentNode;
        }
      }
  
      unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
    }
  
    if (distances[endNode] === Infinity) {
      return null;
    }
  
    const path = [];
    let currentNode = endNode;
    while (currentNode !== null) {//to get the array which consists of nodes travelled through to get destination node from source node.
      path.unshift(currentNode);
      currentNode = predecessors[currentNode];
    }
  
    return  path ;
}

const graph = {
    1: [{ 2: 8.995561954835}, { 6: 7.193411128153742 }],
    2: [{ 1: 8.995561954835 }, { 3: 8.938345841728559 }],
    3: [{2: 8.938345841728559 }, { 4: 7.673438676356329 }],
    4: [{ 3: 7.673438676356329 }, { 5: 8.241782929785831 }],
    5: [{ 4: 8.241782929785831 }, { 6: 8.987282330312102 }],
    6: [{5:8.987282330312102},{1:7.193411128153742}]
};

// console.log(dijkstraWithPredecessors(graph,'6','3'));

export default dijkstraWithPredecessors;