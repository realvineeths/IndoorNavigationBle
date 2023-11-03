function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
  
    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI / 180) * lat1;
    const radLon1 = (Math.PI / 180) * lon1;
    const radLat2 = (Math.PI / 180) * lat2;
    const radLon2 = (Math.PI / 180) * lon2;
  
    // Haversine formula
    const dLon = radLon2 - radLon1;
    const dLat = radLat2 - radLat1;
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Calculate the distance
    const distance = R * c;
    
    const distanceMeters = distance * 1000;

    return distanceMeters;
  }


// const c1= [ 77.66429140971361,12.86134306181686]
// const c2= [77.66420908805728,12.86135262904988]
// const distance = haversine(c1[1], c1[0], c2[1], c2[0]);
// console.log(`Distance: ${distance} metres`);

export default haversine;
