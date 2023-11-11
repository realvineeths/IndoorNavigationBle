/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
// import trilateration from './findCord';
// import MathTool from  './MathTool';
import {MathTool} from './MathTool';
import KalmanFilter from 'kalmanjs';

const bleManager = new BleManager();
let beaconData = [];

var a=1000;
var b=1000;
var c=1000;
var d=1000;
var e=1000;


// function cartesian(latitude, longitude) {
//   const MAP_WIDTH = 360;
//   const MAP_HEIGHT = 761.6666666666666;

//   var x = (MAP_WIDTH / 360.0) * (180 + longitude);
//   var y = (MAP_HEIGHT / 180.0) * (90 - latitude);

//   return [x*Math.pow(10,4), y*Math.pow(10,4)];
// }

// function getcord(x, y) {
//   x=x*Math.pow(10,-4);
//   y=y*Math.pow(10,-4);
//   const MAP_WIDTH = 360;
//   const MAP_HEIGHT = 761.6666666666666;
//   var longitude = (x * (360.0 / MAP_WIDTH)) - 180;
//   var latitude = 90 - (y * (180.0 / MAP_HEIGHT));
//   return [latitude, longitude]
// }


// function trilateration(beacons) {
//   // beacons: array of { x, y, distance }

//   const beacon1 = beacons[0];
//   const beacon2 = beacons[1];
//   const beacon3 = beacons[2];

//   const A = 2 * (beacon2.x - beacon1.x);
//   const B = 2 * (beacon2.y - beacon1.y);
//   const C = Math.pow(beacon1.distance, 2) - Math.pow(beacon2.distance, 2) - Math.pow(beacon1.x, 2) + Math.pow(beacon2.x, 2) - Math.pow(beacon1.y, 2) + Math.pow(beacon2.y, 2);

//   const D = 2 * (beacon3.x - beacon2.x);
//   const E = 2 * (beacon3.y - beacon2.y);
//   const F = Math.pow(beacon2.distance, 2) - Math.pow(beacon3.distance, 2) - Math.pow(beacon2.x, 2) + Math.pow(beacon3.x, 2) - Math.pow(beacon2.y, 2) + Math.pow(beacon3.y, 2);

//   const x = (C - (F * B / E)) / (A - (D * B / E));
//   const y = (F - (D * C / A)) / (E - (B * D / A));

//   return { x, y };
// }

function trilateration(beacons) {
  // Ensure there are exactly three beacons
  if (beacons.length !== 3) {
      throw new Error('Trilateration requires exactly three beacons.');
  }

  // Sort beacons by distance in ascending order
  const sortedBeacons = beacons.sort((a, b) => a.distance - b.distance);

  const beacon1 = sortedBeacons[0];
  const beacon2 = sortedBeacons[1];
  const beacon3 = sortedBeacons[2];

  if (!isIntersection(beacon1, beacon2, beacon1.distance, beacon2.distance)) {
      return calculateMidpoint(beacon1, beacon2);
  }

  // Calculate the intersection points of the circles formed by the two nearest beacons
  const intersectionPoints = calculateCircleIntersection(beacon1, beacon2);
  // console.log(intersectionPoints);
  // Choose the intersection point closest to the third beacon
  const closestIntersection = intersectionPoints.sort((p1, p2) => {
      return getDistance(p1, beacon3) - getDistance(p2, beacon3);
  })[0];



  return closestIntersection;
}

function isIntersection(beacon1, beacon2, r1, r2) {
  const distanceBetweenCenters = getDistance(beacon1, beacon2);
  const sumOfRadii = r1 + r2;
  const differenceOfRadii = Math.abs(r1 - r2);

  // Circles intersect if the distance between their centers is less than the sum of their radii
  // and greater than the absolute difference of their radii
  return distanceBetweenCenters < sumOfRadii && distanceBetweenCenters > differenceOfRadii;
}

function calculateMidpoint(point1, point2) {
  const x = (point1.x + point2.x) / 2;
  const y = (point1.y + point2.y) / 2;
  return { x, y };
}

// Helper function to calculate the intersection points of two circles
function calculateCircleIntersection(beacon1, beacon2) {
  const d = getDistance(beacon1, beacon2);
  const a = (Math.pow(beacon1.distance, 2) - Math.pow(beacon2.distance, 2) + Math.pow(d, 2)) / (2 * d);
  const h = Math.sqrt(Math.pow(beacon1.distance, 2) - Math.pow(a, 2));

  const x2 = beacon1.x + (a / d) * (beacon2.x - beacon1.x);
  const y2 = beacon1.y + (a / d) * (beacon2.y - beacon1.y);

  const x3_1 = x2 + (h / d) * (beacon2.y - beacon1.y);
  const y3_1 = y2 - (h / d) * (beacon2.x - beacon1.x);

  const x3_2 = x2 - (h / d) * (beacon2.y - beacon1.y);
  const y3_2 = y2 + (h / d) * (beacon2.x - beacon1.x);

  return [{ x: x3_1, y: y3_1 }, { x: x3_2, y: y3_2 }];
}

// Helper function to calculate the distance between two points
function getDistance(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function cartesian(latitude, longitude) {
  const MAP_WIDTH = 3800;
  const MAP_HEIGHT = 2000.6666666666666;

  var x = (MAP_WIDTH / 360.0) * (180 + longitude);
  var y = (MAP_HEIGHT / 180.0) * (90 - latitude);

  return [x*Math.pow(10,4), y*Math.pow(10,4)];
}


function getcord(x, y) {
  x=x*Math.pow(10,-4);
  y=y*Math.pow(10,-4);
  const MAP_WIDTH = 3800;
  const MAP_HEIGHT = 2000.6666666666666;
  // const MAP_WIDTH = 360;
  // const MAP_HEIGHT = 761.6666666666666;
  var longitude = (x * (360.0 / MAP_WIDTH)) - 180;
  var latitude = 90 - (y * (180.0 / MAP_HEIGHT));
  return [latitude, longitude]
}





function useBLE() {
  const [distance, setDistance] = useState([]);
  var [cordinates, setCordinates] = useState([0,0,0]);


  const requestPermissions = async (cb) => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      cb(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      cb(true);
    }
  };

  function calculateDistance(rssi) {
    const currentDistance = Math.pow(10, (-55 - rssi) / (10 * 3));
    return currentDistance;
  }

  const kf1 = new KalmanFilter({R: 0.01, Q: 2});
  const kf2 = new KalmanFilter({R: 0.01, Q: 2});
  const kf3 = new KalmanFilter({R: 0.01, Q: 2});
  const kf4 = new KalmanFilter({R: 0.01, Q: 2});
  const kf5 = new KalmanFilter({R: 0.01, Q: 2});

  // var cordinates=[a,b,c];
  const scanForPeripherals = () =>
    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: true,
        scanMode: ScanMode.LowLatency,
      },
      (error, device) => {
        if (device && device.name && device.name.includes('FSC')) {
          // console.log(device);

          const beacon = {
            id: device.id,
            rssi: device.rssi,
            distance: calculateDistance(device.rssi),
          };

          // console.log(beacon);

          beaconData.push(beacon);

          // Sort the beaconData array based on distance in ascending order
          beaconData.sort((a, b) => a.distance - b.distance);

          // Keep only the 3 closest beacons
          // if (beaconData.length > 3) {
          //   beaconData.pop();
          // }

          // const top3Objects = beaconData.slice(0, 3);

          if(beacon.id.includes('37')){
            a=beacon.distance;
          }
          if(beacon.id.includes('4B')){
            b=beacon.distance;
          }
          if(beacon.id.includes('48')){
            c=beacon.distance;
          }
          if(beacon.id.includes('47')){
            d=beacon.distance;
          }
          if(beacon.id.includes('3C')){
            e=beacon.distance;
          }   

          // const cart3 = [0,10];//c
          // const cart2 = [0,1];//b
          // const cart1 = [10,0];//a
          // const cart4 = [5,9];//d
          // const cart5 = [11,8];//e
          const cart1 = cartesian(12.86137334, 77.66416349);//conf
          const cart2 = cartesian(12.86148900, 77.66417709);//hod
          const cart3 = cartesian(12.86147617, 77.66430172);//entra
          const cart4 = cartesian(12.86140970,77.66431894);//stair
          const cart5 = cartesian(12.86133558,77.66429186);//equip



          var  arr=[];
          // console.log("in");

          // console.log(kf1,kf2,kf3,kf4,kf5);
          // console.log(a,b,c,d,e);
          let cnt=0;
          if(a!=1000)
          {
            cnt++;
          }
          if(b!=1000)
          {
            cnt++;
          }
          if(c!=1000)
          {
            cnt++;
          }
          if(d!=1000)
          {
            cnt++;
          }
          if(e!=1000)
          {
            cnt++;
          }          

          // top3Objects.length>=3
          if(cnt>=3)
          {
            a=kf1.filter(a);
            b=kf2.filter(b);
            c=kf3.filter(c);
            d=kf4.filter(d);
            e=kf5.filter(e);
            // console.log("Distance: ",a,b,c,d,e);
            // const beacons = [
            //   { x: cart1[0], y: cart1[1], distance: a },
            //   { x: cart2[0], y: cart2[1], distance: b },
            //   { x: cart3[0], y: cart3[1], distance: c },
            // ];
            const beaconArr=[
              {
                x: cart1[0], y: cart1[1],
                distance:a
              },
              {
                x: cart2[0], y: cart2[1],
                distance:b                
              },
              {
                x: cart3[0], y: cart3[1],
                distance:c
              },
              {
                x: cart4[0], y: cart4[1],
                distance:d
              },
              {
                x: cart5[0], y: cart5[1],
                distance:e
              }
            ]

            beaconArr.sort((a, b) => a.distance - b.distance);
            const top3Objects =beaconArr.slice(0, 3);
            // console.log(top3Objects);
            // console.log(beaconArr);
            // const beacons = [
            //   { x: cart1[0], y: cart1[1], distance: top3Objects[0] },
            //   { x: cart2[0], y: cart2[1], distance: b },
            //   { x: cart3[0], y: cart3[1], distance: c },
            // ];            

            const userPosition = trilateration(top3Objects);    
            arr=getcord(userPosition.x, userPosition.y);       
            // console.log(userPosition); 
            // arr.push(userPosition.x);
            // arr.push(userPosition.y);
          }

          setCordinates(arr);
          // disCalc(setCordinates);
          setDistance([...beaconData]);
        }
        if (error) {
          console.log(error, 'error');
        }
      },
  );


  return {
    scanForPeripherals,
    requestPermissions,
    distance,
    cordinates
  };
}

export default useBLE;