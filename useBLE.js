/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import trilateration from './findCord';
// import MathTool from  './MathTool';
import {MathTool} from './MathTool';

const bleManager = new BleManager();
let beaconData = [];

var a=-1;
var b=-1;
var c=-1;

// function disCalc(setCordinates){

//   // console.log(a,b,c);
//   if(a!=-1 && b!=-1 && c!=-1){
//     trilateration.setDistance(0, a);
//     trilateration.setDistance(1, b);
//     trilateration.setDistance(2, c);
//     var pos = trilateration.calculatePosition();
//     setCordinates(pos)
//     // console.log(a,b,c,pos);

//   }

// }


function calculate()
{

  let device1Point;
  let device2Point;
  let device3Point;
  const mt1=new MathTool();
  const mt2=new MathTool();
  const mt3=new MathTool();
  device1Point = mt1.Point(0, 0);
  device2Point = mt2.Point(3.1, 0);
  device3Point = mt3.Point(0,4.1);

  let distances=[];
  
  distances.push(a);
  distances.push(b);
  distances.push(c);

  let circle1 = new MathTool.Circle(
    new MathTool.Point(device1Point.x, device1Point.y),
    distances[0]);
  let circle2 = new MathTool.Circle(
    new MathTool.Point(device2Point.x, device2Point.y),
    distances[1]
  );
  let circle3 = new MathTool.Circle(
    new MathTool.Point(device3Point.x, device3Point.y),
    distances[2]
  );

while (true) {
  // First look at whether there are intersections between the three circles.
  // If 1、2 no intersection between the two circles
  if (!MathTool.isTwoCircleIntersect(circle1, circle2)) {
      // Try increasing the radius of a circle，Who is bigger and who increases
      if (circle1.r > circle2.r) {
          circle1.r += 0.01;
      } else {
          circle2.r += 0.01;
      }
      continue;
  }
  // If there is no intersection between the two circles of 1, 3
  if (!MathTool.isTwoCircleIntersect(circle1, circle3)) {
      // Try increasing the radius
      // If the radius of c3 is smaller than either of them
      if (circle3.r < circle1.r && circle3.r < circle2.r) {
          circle1.r += 0.01;
          circle2.r += 0.01;
      } else {
          circle3.r += 0.01;
      }
      continue;
  }
  // If there is no intersection between the two originals
  if (!MathTool.isTwoCircleIntersect(circle2, circle3)) {
      // Try increasing the radius
      // If the radius of c3 is smaller than either of them
      if (circle3.r < circle1.r && circle3.r < circle2.r) {
          circle1.r += 0.01;
          circle2.r += 0.01;
      } else {
          circle3.r += 0.01;
      }
      continue;
  }

  let temp1 = MathTool.getIntersectionPointsOfTwoIntersectCircle(circle1, circle2);
  let temp2 = MathTool.getIntersectionPointsOfTwoIntersectCircle(circle2, circle3);
  let temp3 = MathTool.getIntersectionPointsOfTwoIntersectCircle(circle3, circle1);
  // The point where the intersection of the two circles of 1 and 2 takes y > 0
  let resultPoint1 = temp1.p1.y > 0 ?
          new MathTool.Point(temp1.p1.x, temp1.p1.y):
          new MathTool.Point(temp1.p2.x, temp1.p2.y);
  // Log.d("resultPoint1", temp1.p1.toString() + "  " + temp1.p2.toString());
  // The intersection of 2, 3 and 2 circles takes the mean of the two
  let resultPoint2 = new MathTool.Point(
          max(temp2.p1.x, temp2.p2.x),
          max(temp2.p1.y, temp2.p2.y)
  );
  // 3, 1 the intersection of the two circles takes the point where x > 0
  let resultPoint3 = temp3.p1.x > 0 ?
          new MathTool.Point(temp3.p1.x, temp3.p1.y):
          new MathTool.Point(temp3.p2.x, temp3.p2.y);

  // Find the center point of three points
  let resultPoint = MathTool.getCenterOfThreePoint(
          resultPoint1,
          resultPoint2,
          resultPoint3
  );

  }

  return resultPoint;
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
          if (beaconData.length > 3) {
            beaconData.pop();
          }

          if(beacon.id.includes('37')){
            a=beacon.distance;
          }
          if(beacon.id.includes('4B')){
            b=beacon.distance;
          }
          if(beacon.id.includes('48')){
            c=beacon.distance;
          }


          // trilateration.addBeacon(0, trilateration.vector(-2.01, 2));
          // trilateration.addBeacon(1, trilateration.vector(2.1, 2.1));
          // trilateration.addBeacon(2, trilateration.vector(2, -2.04));
          var  arr=[];
          if(a!=-1 && b!=-1 && c!=-1)
          {
            var result=calculate();
            arr.push(result.x);
            arr.push(result.y);
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