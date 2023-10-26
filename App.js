/* eslint-disable prettier/prettier */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LogBox,
  Image,
  Button,
  Dimensions
} from 'react-native';
import useBLE from './useBLE';
import MapboxGL from '@rnmapbox/maps';
import { statesData } from './data';

MapboxGL.setAccessToken('sk.eyJ1IjoiYWRpdHlhLWxhd2Fua2FyIiwiYSI6ImNsbm4xcHYzaTAxc28ydnBmamJkbndsanUifQ.sglI_YCbc3WMaZNNM_va7A');
MapboxGL.setConnected(true);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const MAP_WIDTH = Dimensions.get('window').width;
const MAP_HEIGHT = Dimensions.get('window').height;

// console.log(MAP_HEIGHT,MAP_WIDTH);


const App = () => {
  // const coordinates = [77.6649683,12.8619337];
  const { requestPermissions, scanForPeripherals, distance,cordinates } = useBLE();
  const scanForDevices = () => {
    requestPermissions(isGranted => {
      console.log(isGranted, 'grant');
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };  
  // console.log(cordinates.x,cordinates.y);
  const coordinates = [77.66431108610999, 12.861412619615328];  
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={20}
           centerCoordinate={coordinates} />          
            {
            statesData.features.map((feature, index) => (
              
              <MapboxGL.ShapeSource key={`source${index}`} id={`source${index}`} shape={feature}>
                <MapboxGL.FillLayer id={`fill${index}`} style={{ fillColor: "white" }}  />
                <MapboxGL.LineLayer
                  id={`line${index}`}
                  style={{ lineColor: "red", lineWidth: 2 }} 
                />
                <MapboxGL.SymbolLayer
                  id={`label${index}`}
                  style={{
                    textField: feature.properties.name,
                    textSize: 12,
                    textColor: 'black',
                    textAnchor: 'center',
                    textAllowOverlap: true,
                  }}
                />
              </MapboxGL.ShapeSource>
            ))
            }
            {/* <MapboxGL.PointAnnotation id="marker" coordinate={coordinates}  /> */}
          <MapboxGL.MarkerView id={"marker"} coordinate={[cordinates[0],cordinates[1]]}>
                      <View>
                        <View style={styles.markerContainer}>
                          <Image
                            source={require("./images3.png")}
                            style={{
                              width: 20,
                              height: 30,                              
                              resizeMode: "cover",
                            }}
                          />
                        </View>
                      </View>
            </MapboxGL.MarkerView>
           {/* <TouchableOpacity onPress={scanForDevices} style={styles.ctaButton}>
           <Text style={styles.ctaButtonText}>Start</Text>
           </TouchableOpacity> */}

          {/* <Button
            onPress={scanForDevices}
            title="Your Location"
            color="#841584"
            
          /> */}
         </MapboxGL.MapView>
         <View style={styles.ctaButton}>
              <Button title="Start" onPress={scanForDevices}></Button>
          </View>         
         </View>
       </View>
  );
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    width: 60,
    backgroundColor: "transparent",
    height: 70,
  },
  textContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    paddingHorizontal: 5,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    // height: 50,
    // marginHorizontal: 20,
    // marginBottom: 5,
    borderRadius: 8,
    zIndex:10,
    position:'absolute',
    backgroundColor:"transparent",
    top:"90%",
    left:"40%"
  }
});


export default App;




// const App = () => {
//   const { requestPermissions, scanForPeripherals, distance,cordinates } = useBLE();
//   // console.log(cordinates);
//   const scanForDevices = () => {
//     requestPermissions(isGranted => {
//       console.log(isGranted, 'grant');
//       if (isGranted) {
//         scanForPeripherals();
//       }
//     });
//   };


//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.heartRateTitleWrapper}>
//         <Text style={{ fontSize: 50, color: 'black' }}>Position:</Text>
//         <View>
//         <Text style={{ fontSize: 50, color: 'black' }}>x:{cordinates.x}</Text>
//         <Text style={{ fontSize: 50, color: 'black' }}>y:{cordinates.y}</Text>        
//         </View>
//       </View>
//       <TouchableOpacity onPress={scanForDevices} style={styles.ctaButton}>
//         <Text style={styles.ctaButtonText}>Start</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   heartRateTitleWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heartRateTitleText: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginHorizontal: 20,
//     color: 'black',
//   },
//   heartRateText: {
//     fontSize: 25,
//     marginTop: 15,
//   },
//   ctaButton: {
//     backgroundColor: 'purple',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//     marginHorizontal: 20,
//     marginBottom: 5,
//     borderRadius: 8,
//   },
//   ctaButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });

// export default App;
