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

function getcartesian(longitude,latitude)
{
    const MAP_WIDTH=360;
    const MAP_HEIGHT=761.6666666666666;
    
    var x = (MAP_WIDTH/360.0) * (180 + longitude);
    var y = (MAP_HEIGHT/180.0) * (90 - latitude);

    return [x,y];
}

function getcord(x,y)
{
    const MAP_WIDTH=360;
    const MAP_HEIGHT=761.6666666666666;    
    var longitude = (x * (360.0 / MAP_WIDTH)) - 180;
    var latitude = 90 - (y * (180.0 / MAP_HEIGHT));
    return [longitude,latitude]
}



function disCalc(setCordinates){

  // console.log(a,b,c);
  // console.log(a,b,c);
  if(a!=-1 && b!=-1 && c!=-1){
    trilateration.setDistance(0, a);
    trilateration.setDistance(1, b);
    trilateration.setDistance(2, c);
    var pos = trilateration.calculatePosition();
    var res=getcord(pos.x,pos.y);

    console.log(pos,a,b,c);
    pos.x=res[0];
    pos.y=res[1];    
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
          const cart1=getcartesian(12.86137334,77.66416349);
          const cart2=getcartesian(12.86148900,77.66417709);
          const cart3=getcartesian(12.86147617,77.66430172);          

          // trilateration.addBeacon(0, trilateration.vector(cart1[0], cart1[1]));
          // trilateration.addBeacon(1, trilateration.vector(cart2[0], cart2[1]));
          // trilateration.addBeacon(2, trilateration.vector(cart3[0], cart3[1]));
          trilateration.addBeacon(0, trilateration.vector(500, 200.11));
          trilateration.addBeacon(1, trilateration.vector(500.432, 200.34));
          trilateration.addBeacon(2, trilateration.vector(500.132, -200.54));          
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