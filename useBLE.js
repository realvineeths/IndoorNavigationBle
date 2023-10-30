/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
// import trilateration from './findCord';
// import MathTool from  './MathTool';
import {MathTool} from './MathTool';

const bleManager = new BleManager();
let beaconData = [];

var a = 4.8034392256422;
var b = 0.27667516330004;
var c = 1.0827771103723;


function cartesian(latitude, longitude) {
  const MAP_WIDTH = 360;
  const MAP_HEIGHT = 761.6666666666666;

  var x = (MAP_WIDTH / 360.0) * (180 + longitude);
  var y = (MAP_HEIGHT / 180.0) * (90 - latitude);

  return [x*Math.pow(10,4), y*Math.pow(10,4)];
}


function getcord(x, y) {
  x=x*Math.pow(10,-4);
  y=y*Math.pow(10,-4);
  const MAP_WIDTH = 360;
  const MAP_HEIGHT = 761.6666666666666;
  var longitude = (x * (360.0 / MAP_WIDTH)) - 180;
  var latitude = 90 - (y * (180.0 / MAP_HEIGHT));
  return [latitude, longitude]
}


function trilateration(beacons) {
  // beacons: array of { x, y, distance }

  const beacon1 = beacons[0];
  const beacon2 = beacons[1];
  const beacon3 = beacons[2];

  const A = 2 * (beacon2.x - beacon1.x);
  const B = 2 * (beacon2.y - beacon1.y);
  const C = Math.pow(beacon1.distance, 2) - Math.pow(beacon2.distance, 2) - Math.pow(beacon1.x, 2) + Math.pow(beacon2.x, 2) - Math.pow(beacon1.y, 2) + Math.pow(beacon2.y, 2);

  const D = 2 * (beacon3.x - beacon2.x);
  const E = 2 * (beacon3.y - beacon2.y);
  const F = Math.pow(beacon2.distance, 2) - Math.pow(beacon3.distance, 2) - Math.pow(beacon2.x, 2) + Math.pow(beacon3.x, 2) - Math.pow(beacon2.y, 2) + Math.pow(beacon3.y, 2);

  const x = (C - (F * B / E)) / (A - (D * B / E));
  const y = (F - (D * C / A)) / (E - (B * D / A));

  return { x, y };
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

          // if(beacon.id.includes('37')){
          //   a=beacon.distance;
          // }
          // if(beacon.id.includes('4B')){
          //   b=beacon.distance;
          // }
          // if(beacon.id.includes('48')){
          //   c=beacon.distance;
          // }
          // a = 4.8034392256422;
          // b = 0.27667516330004;
          // c = 1.0827771103723;

          const cart1 = cartesian(12.86137334, 77.66416349);
          const cart2 = cartesian(12.86148900, 77.66417709);
          const cart3 = cartesian(12.86147617, 77.66430172);

          var  arr=[];
          // console.log("in");
          if(a!=-1 && b!=-1 && c!=-1)
          {
            const beacons = [
              { x: cart1[0], y: cart1[1], distance: a },
              { x: cart2[0], y: cart2[1], distance: b },
              { x: cart3[0], y: cart3[1], distance: c },
            ];
            
            const userPosition = trilateration(beacons);    
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