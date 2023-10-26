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

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}


function getCartesian(lat,lon)
{
  const la1=degreesToRadians(lat);
  const lo1=degreesToRadians(lon);
  const R=6371 ;
  var x = R * Math.cos(la1) * Math.cos(lo1)
  var y = R * Math.cos(la1) * Math.sin(lo1)
  return [x,y];
}


function disCalc(setCordinates){

  // console.log(a,b,c);
  // console.log(a,b,c);
  if(a!=-1 && b!=-1 && c!=-1){
    trilateration.setDistance(0, a);
    trilateration.setDistance(1, b);
    trilateration.setDistance(2, c);
    var pos = trilateration.calculatePosition();
    const lat = Math.asin(z / R)
    const lon = Math.atan2(y, x)
    console.log("cc",pos.x,pos.y);
    setCordinates([pos.x,pos.y])
    // console.log(a,b,c,pos);
  }

}


function useBLE() {
  const [distance, setDistance] = useState([]);
  var [cordinates, setCordinates] = useState([77.6649683,12.8619337]);


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

          // RIGHT SIDE - 12.86147617,77.66430172
          // CHAIRMAN - 12.86148900,77.66417709
          // CONF ROOM - 12.86137334,77.66416349
          // EQUIP ROOM - 12.86133558,77.66429186
          // STAIRCASE - 12.86140970,77.66431894
          
          // const la1=degreesToRadians(77.66416349);
          // const lo1=degreesToRadians(12.86137334);
          // const la2=degreesToRadians(77.66417709);
          // const lo2=degreesToRadians(12.86148900);
          // const la3=degreesToRadians(77.66430172);
          // const lo3=degreesToRadians(12.86147617);
          
          const cart1=getCartesian(77.66416349,12.86137334);
          const cart2=getCartesian(77.66417709,12.86148900);
          const cart3=getCartesian(77.66430172,12.86147617);

          trilateration.addBeacon(0, trilateration.vector(cart1[0],cart1[1]));
          // trilateration.addBeacon(1, trilateration.vector(5,2.334344));
          trilateration.addBeacon(1, trilateration.vector(cart2[0],cart2[1]));
          // trilateration.addBeacon(2, trilateration.vector(6,-2.334));
          trilateration.addBeacon(2, trilateration.vector(cart3[0],cart3[1]));
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