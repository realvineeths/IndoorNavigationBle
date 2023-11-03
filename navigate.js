//a)210->[77.6641701097674,12.861404983734475]
//b)hod->[77.66418179357876,12.861485076841905]
//c)213->[77.66426310442918,12.861471742806769]
//d)206->[77.66430485247479,12.861416014131246]
//e)equipment->[ 77.66429140971361,12.86134306181686]
//f)209->[77.66420908805728,12.86135262904988]
//214->[77.66429275926333,12.861467014260677] (not necessary)

//Dab=8.995561954835
//Daf=7.193411128153742
//Dbc=8.938345841728559
//Dcd=7.673438676356329
//Dde=8.241782929785831
//Def=8.987282330312102

//a->b,f
//b->a,c
//c->b,d
//d->c,e
//e->d,f
//f->e,a

import haversine from "./haversine";
import dijkstraWithPredecessors from "./dijkstra";


function navigate(inputCord,destinationNode)
{
    const graph = {
        1: [{ 2: 8.995561954835}, { 6: 7.193411128153742 }],
        2: [{ 1: 8.995561954835 }, { 3: 8.938345841728559 }],
        3: [{2: 8.938345841728559 }, { 4: 7.673438676356329 }],
        4: [{ 3: 7.673438676356329 }, { 5: 8.241782929785831 }],
        5: [{ 4: 8.241782929785831 }, { 6: 8.987282330312102 }],
        6: [{5:8.987282330312102},{1:7.193411128153742}]
    };
    
    
    const cordgraph = {
        1: [77.6641701097674,12.861404983734475],
        2: [77.66418179357876,12.861485076841905],
        3: [77.66426310442918,12.861471742806769],
        4: [77.66430485247479,12.861416014131246],
        5: [77.66429140971361,12.86134306181686],
        6: [77.66420908805728,12.86135262904988] 
        // { id: 1, cord:[77.6641701097674,12.861404983734475] },
        // { id: 2, cord:[77.66418179357876,12.861485076841905] },
        // { id: 3, cord:[77.66426310442918,12.861471742806769] },
        // { id: 4, cord:[77.66430485247479,12.861416014131246] },
        // { id: 5, cord:[77.66429140971361,12.86134306181686] },
        // { id: 6, cord:[77.66420908805728,12.86135262904988] },
    };
    
    // const inputCord=[12.861308676018128, 77.66420813812186];
    
    
    var nearestNode = null;
    var minDistance = Infinity;
    
    for (const i in Object.keys(cordgraph)) {
        const distance = haversine(inputCord[1],inputCord[0], cordgraph[i-'0'+1][1], cordgraph[i-'0'+1][0]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestNode = i-'0'+1;
        }
        // console.log(cordgraph[i-'0'+1]);
    }
    // console.log(nearestNode);
    
    
    // const destinationNode = '3'; // Example destination node
    
    var shortestPath;
    
    if(nearestNode)
    {
        // console.log(nearestNode);
        shortestPath=dijkstraWithPredecessors(graph,nearestNode,destinationNode);
        // console.log(shortestPath);
    }
    
    var routeArr=[];
    
    for(let i in shortestPath)
    {    
        routeArr.push(cordgraph[shortestPath[i]]);
    }
    
    console.log(nearestNode,shortestPath);

    return routeArr
}

// console.log(shortestPath);
// console.log(routeArr);


export default navigate;
