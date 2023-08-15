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
          // console.log(device);
          const currentDistance = Math.pow(10, (-55 - device.rssi) / (10 * 3));

          const beacon = {
            id: device.id,
            rssi: device.rssi,
            distance: currentDistance,
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
          for(let x=0;x<beaconData.length;x++){
            console.log(beaconData[x].id);
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


// {"_manager": {"_activePromises": {}, "_activeSubscriptions": {}, "_errorCodesToMessagesMapping": {"0": "Unknown error occurred. This is probably a bug! Check reason property.", "1": "BleManager was destroyed", "100": "BluetoothLE is unsupported on this device", "101": "Device is not authorized to use BluetoothLE", "102": "BluetoothLE is powered off", "103": "BluetoothLE is in unknown state", "104": "BluetoothLE is resetting", "105": "Bluetooth state change failed", "2": "Operation was cancelled", "200": "Device {deviceID} connection failed", "201": "Device {deviceID} was disconnected", "202": "RSSI read failed for device {deviceID}", "203": "Device {deviceID} is already connected", "204": "Device {deviceID} not found", "205": "Device {deviceID} is not connected", "206": "Device {deviceID} could not change MTU size", "3": "Operation timed out", "300": "Services discovery failed for device {deviceID}", "301": "Included services discovery failed for device {deviceID} and service: {serviceUUID}", "302": "Service {serviceUUID} for device {deviceID} not found", "303": "Services not discovered for device {deviceID}", "4": "Operation was rejected", "400": "Characteristic discovery failed for device {deviceID} and service {serviceUUID}", "401": "Characteristic {characteristicUUID} write failed for device {deviceID} and service {serviceUUID}", "402": "Characteristic {characteristicUUID} read failed for device {deviceID} and service {serviceUUID}", "403": "Characteristic {characteristicUUID} notify change failed for device {deviceID} and service {serviceUUID}", "404": "Characteristic {characteristicUUID} not found", "405": "Characteristics not discovered for device {deviceID} and service {serviceUUID}", "406": "Cannot write to characteristic {characteristicUUID} with invalid data format: {internalMessage}", "5": "Invalid UUIDs or IDs were passed: {internalMessage}", "500": "Descriptor {descriptorUUID} discovery failed for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "501": "Descriptor {descriptorUUID} write failed for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "502": "Descriptor {descriptorUUID} read failed for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "503": "Descriptor {descriptorUUID} not found", "504": "Descriptors not discovered for device {deviceID}, service {serviceUUID} and characteristic {characteristicUUID}", "505": "Cannot write to descriptor {descriptorUUID} with invalid data format: {internalMessage}", "506": "Cannot write to descriptor {descriptorUUID}. It's not allowed by iOS and therefore forbidden on Android as well.", "600": "Cannot start scanning operation", "601": "Location services are disabled"}, "_eventEmitter": {}, "_scanEventSubscription": {"remove": [Function remove]}, "_uniqueId": 0}, "id": "DC:0D:30:AF:04:3C", "isConnectable": null, "localName": "FSC-BP104D", "manufacturerData": null, "mtu": 23, "name": "FSC-BP104D", "overflowServiceUUIDs": null, "rssi": -59, "serviceData": {"0000feaa-0000-1000-8000-00805f9b34fb": "IAAMsIAAAAAA2QAABUE=", "0000fff0-0000-1000-8000-00805f9b34fb": "LgIXktwNMK8EPGQ="}, "serviceUUIDs": ["0000feaa-0000-1000-8000-00805f9b34fb", "0000fef5-0000-1000-8000-00805f9b34fb"], "solicitedServiceUUIDs": null, "txPowerLevel": null}