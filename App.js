/* eslint-disable prettier/prettier */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LogBox,
} from 'react-native';
import useBLE from './useBLE';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const App = () => {
  const { requestPermissions, scanForPeripherals, distance,cordinates } = useBLE();
  // console.log(cordinates);
  const scanForDevices = () => {
    requestPermissions(isGranted => {
      console.log(isGranted, 'grant');
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        <Text style={{ fontSize: 50, color: 'black' }}>Position:</Text>
        {/* {distance.map((beacon, index) => (
          <View key={index}>
            <Text style={{ fontSize: 50, color: 'black' }}>{beacon.distance}</Text>
            <Text style={{ fontSize: 50, color: 'black' }}>ID: {beacon.id}</Text>
            <Text style={{ fontSize: 50, color: 'black' }}>RSSI: {beacon.rssi}</Text>
          </View>
        ))} */}
        <View>
        <Text style={{ fontSize: 50, color: 'black' }}>x:{cordinates.x}</Text>
        <Text style={{ fontSize: 50, color: 'black' }}>y:{cordinates.y}</Text>
        {/* <Text style={{ fontSize: 50, color: 'black' }}>z:{cordinates[2]}</Text> */}
        </View>
      </View>
      <TouchableOpacity onPress={scanForDevices} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
