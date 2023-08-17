/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import findSolution from './findCord';


const bleManager = new BleManager();
let beaconData = [];


function useBLE() {
  const [distance, setDistance] = useState([]);

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

  var a=-1;
  var b=-1;
  var c=-1;
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

          // console.log(a,b,c);
          // let r1 = [
          //   [2.0, 2.0, 1.0, beaconData[0].distance],
          //   [-2.0, 2.0, 1.0,beaconData[1].distance],
          //   [2.0, -2.0, 1.0, beaconData[2].distance]
          // ];
          let r1 = [
            [2.0, 2.0, 1.0, a],
            [-2.0, 2.0, 1.0,b],
            [2.0, -2.0, 1.0,c]
          ];
          // console.log(beaconData[0].distance);
          // var result=findSolution(r1);

          // console.log(beacon);
          // for (let x = 0; x < beaconData.length; x++) {
          //   console.log(beaconData[x]);
          // }


          setDistance([...beaconData]);
          findSolution(r1);

        }
        if (error) {
          console.log(error, 'error');
        }
      },
    );


  return {
    scanForPeripherals,
    requestPermissions,
    distance
  };
}

export default useBLE;