/* eslint-disable no-bitwise */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

const bleManager = new BleManager();

const distanceBuffer = [-1, -1, -1];
let numOfSamples = 0;



function useBLE() {
  const [distance, setDistance] = useState(-1);

  const requestPermissions = async (cb) => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();
      // console.log(apiLevel)
      // if (apiLevel < 31) {
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


  const scanForPeripherals = () =>
    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: true,
        scanMode: ScanMode.LowLatency,
      },      
      (error, device) => {
          if (device && device.name && device.name.includes("FSC")) {
          // console.log(device.id);
          // console.log(device.rssi);

          const currentDistance = Math.pow(10, (-55 - device.rssi) / (10 * 3));

          distanceBuffer[numOfSamples % 3] = currentDistance;

          if (distanceBuffer.includes(-1)) {
            setDistance(-1);
          } else {
            const sum = distanceBuffer.reduce((a, b) => a + b);
            setDistance(Math.round(sum / distanceBuffer.length));
          }
          numOfSamples++;
        }
        if(error)
        {
          console.log(error,"error");
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