/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

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

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: true,
        scanMode: ScanMode.LowLatency,
      },
      (error, device) => {
        if (device && device.name && device.name.includes('FSC')) {
          const currentDistance = Math.pow(10, (-55 - device.rssi) / (10 * 3));

          const beacon = {
            id: device.id,
            rssi: device.rssi,
            distance: currentDistance,
          };

          beaconData.push(beacon);

          // Sort the beaconData array based on distance in ascending order
          beaconData.sort((a, b) => a.distance - b.distance);

          // Keep only the 3 closest beacons
          if (beaconData.length > 3) {
            beaconData.pop();
          }

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
  };
}

export default useBLE;



//  LOG   "_uniqueId": 0}, "id": "DC:0D:30:AF:04:3C", "isConnectable": null, "localName": "FSC-BP104D", "manufacturerData": null, "mtu": 23, "name": "FSC-BP104D", "overflowServiceUUIDs": null, "rssi": -62, "serviceData": {"0000feaa-0000-1000-8000-00805f9b34fb": "IAAMs4AAAAAGQgAAKCg=", "0000fff0-0000-1000-8000-00805f9b34fb": "LgIXktwNMK8EPGQ="}, "serviceUUIDs": ["0000feaa-0000-1000-8000-00805f9b34fb", "0000fef5-0000-1000-8000-00805f9b34fb"], "solicitedServiceUUIDs": null, "txPowerLevel": null}
// LOG "_eventEmitter": {}, "_scanEventSubscription": {"remove": [Function remove]}, "_uniqueId": 0}, "id": "DC:0D:30:AF:04:48", "isConnectable": null, "localName": "FSC-BP104D", "manufacturerData": null, "mtu": 23, "name": "FSC-BP104D", "overflowServiceUUIDs": null, "rssi": -53, "serviceData": {"0000feaa-0000-1000-8000-00805f9b34fb": "IAAMooAAAAAATAAAAjQ=", "0000fff0-0000-1000-8000-00805f9b34fb": "LgIXktwNMK8ESGQ="}, "serviceUUIDs": ["0000feaa-0000-1000-8000-00805f9b34fb", "0000fef5-0000-1000-8000-00805f9b34fb"], "solicitedServiceUUIDs": null, "txPowerLevel": null}
