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
  var [cordinates, setCordinates] = useState([0,0,0]);

  function determinantOfMatrix(mat) {

    var ans = 0;
    ans = mat[0][0] * (mat[1][1] * mat[2][2] - mat[2][1] * mat[1][2])
      - mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0])
      + mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
    return ans;
  }


  function findSolution(coeff) {

    // Matrix d using coeff as given in cramer's rule
    var d = [
      [coeff[0][0], coeff[0][1], coeff[0][2]],
      [coeff[1][0], coeff[1][1], coeff[1][2]],
      [coeff[2][0], coeff[2][1], coeff[2][2]],
    ];

    // Matrix d1 using coeff as given in cramer's rule
    var d1 = [
      [coeff[0][3], coeff[0][1], coeff[0][2]],
      [coeff[1][3], coeff[1][1], coeff[1][2]],
      [coeff[2][3], coeff[2][1], coeff[2][2]],
    ];
  
    // Matrix d2 using coeff as given in cramer's rule
    var d2 = [
      [coeff[0][0], coeff[0][3], coeff[0][2]],
      [coeff[1][0], coeff[1][3], coeff[1][2]],
      [coeff[2][0], coeff[2][3], coeff[2][2]],
    ];
  
    // Matrix d3 using coeff as given in cramer's rule
    var d3 = [
      [coeff[0][0], coeff[0][1], coeff[0][3]],
      [coeff[1][0], coeff[1][1], coeff[1][3]],
      [coeff[2][0], coeff[2][1], coeff[2][3]],
    ];
  
    // Calculating Determinant of Matrices d, d1, d2, d3
    var D = determinantOfMatrix(d);
    var D1 = determinantOfMatrix(d1);
    var D2 = determinantOfMatrix(d2);
    var D3 = determinantOfMatrix(d3);
    // console.log('D: ', D);
    // console.log('D1: ', D1);
    // console.log('D2: ', D2);
    // console.log('D3: ', D3);

    // Case 1
    if (D !== 0) {
      // Coeff have a unique solution. Apply Cramer's Rule
      var x = D1 / D;
      var y = D2 / D;
      var z = D3 / D; // calculating z using cramer's rule

      console.log('x: ', x);
      console.log('y: ', y);
      // console.log('z: ', z);
      setCordinates([x,y,z]);
  
      // System.out.printf("Value of x is : %.6f\n", x);
      // System.out.printf("Value of y is : %.6f\n", y);
      // System.out.printf("Value of z is : %.6f\n", z);
  
      // answer.setText(String.format("\nX: %.2f", x));
      // answer.append(String.format("\nY: %.2f", y));
      // answer.append("\nZ: 0");
    }
  
    // Case 2
    else {
      if (D1 === 0 && D2 === 0 && D3 === 0) {
        console.log('Infinite solutions');
      }
      else if (D1 !== 0 || D2 !== 0 || D3 !== 0) {
        console.log('No solutions');
      }
      // answer.setText("Location not found!");
    }
    // console.log(cordinates);
  }

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
            [2.0, 2.0, 1.0, 1.3],
            [-2.0, 2.0, 1.0,3.6],
            [2.0, -2.0, 1.0,2.3]
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
    distance,
    cordinates
  };
}

export default useBLE;