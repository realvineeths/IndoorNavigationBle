/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import trilateration from './findCord';


const bleManager = new BleManager();
let beaconData = [];

var a=-1;
var b=-1;
var c=-1;

function disCalc(setCordinates){

  // console.log(a,b,c);
  if(a!=-1 && b!=-1 && c!=-1){
    trilateration.setDistance(0, a);
    trilateration.setDistance(1, b);
    trilateration.setDistance(2, c);
    var pos = trilateration.calculatePosition();
    setCordinates(pos)
    // console.log(a,b,c,pos);
  }

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


          // console.log(beacon);
          // for (let x = 0; x < beaconData.length; x++) {
          //   console.log(beaconData[x]);
          // }
          trilateration.addBeacon(0, trilateration.vector(-2.01, 2));
          trilateration.addBeacon(1, trilateration.vector(2.1, 2.1));
          trilateration.addBeacon(2, trilateration.vector(2, -2.04));
          disCalc(setCordinates);
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