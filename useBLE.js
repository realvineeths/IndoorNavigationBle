/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

const bleManager = new BleManager();
let beaconData = [];

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
  console.log('D: ', D);
  console.log('D1: ', D1);
  console.log('D2: ', D2);
  console.log('D3: ', D3);


  // Case 1
  if (D !== 0) {
    // Coeff have a unique solution. Apply Cramer's Rule
    var x = D1 / D;
    var y = D2 / D;
    var z = D3 / D; // calculating z using cramer's rule

    console.log('x: ', x);
    console.log('y: ', y);
    console.log('z: ', z);
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
}





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

          // console.log(beacon);
          for (let x = 0; x < beaconData.length; x++) {
            console.log(beaconData[x]);
          }

          // var r1 = new double[3][];
          // r1[0] = new double[]{2.0d, 2.0d, 1.0d, ((Double) arrayList.get(0)).doubleValue()};
          // r1[1] = new double[]{-2.0d, 2.0d, 1.0d, ((Double) arrayList.get(1)).doubleValue()};
          // r1[2] = new double[]{2.0d, -2.0d, 1.0d, ((Double) arrayList.get(2)).doubleValue()};
          // new GFG().findSolution(r1);

          setDistance([...beaconData]);

          findSolution(beaconData);

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
  };
}

export default useBLE;



//  LOG   "_uniqueId": 0}, "id": "DC:0D:30:AF:04:3C", "isConnectable": null, "localName": "FSC-BP104D", "manufacturerData": null, "mtu": 23, "name": "FSC-BP104D", "overflowServiceUUIDs": null, "rssi": -62, "serviceData": {"0000feaa-0000-1000-8000-00805f9b34fb": "IAAMs4AAAAAGQgAAKCg=", "0000fff0-0000-1000-8000-00805f9b34fb": "LgIXktwNMK8EPGQ="}, "serviceUUIDs": ["0000feaa-0000-1000-8000-00805f9b34fb", "0000fef5-0000-1000-8000-00805f9b34fb"], "solicitedServiceUUIDs": null, "txPowerLevel": null}
// LOG "_eventEmitter": {}, "_scanEventSubscription": {"remove": [Function remove]}, "_uniqueId": 0}, "id": "DC:0D:30:AF:04:48", "isConnectable": null, "localName": "FSC-BP104D", "manufacturerData": null, "mtu": 23, "name": "FSC-BP104D", "overflowServiceUUIDs": null, "rssi": -53, "serviceData": {"0000feaa-0000-1000-8000-00805f9b34fb": "IAAMooAAAAAATAAAAjQ=", "0000fff0-0000-1000-8000-00805f9b34fb": "LgIXktwNMK8ESGQ="}, "serviceUUIDs": ["0000feaa-0000-1000-8000-00805f9b34fb", "0000fef5-0000-1000-8000-00805f9b34fb"], "solicitedServiceUUIDs": null, "txPowerLevel": null}


