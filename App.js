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
import { routeData } from './route';
import navigate from './navigate';
import { useState } from 'react';
import SearchBar from './SearchBar';
import List from './List';


MapboxGL.setAccessToken('sk.eyJ1IjoiYWRpdHlhLWxhd2Fua2FyIiwiYSI6ImNsbm4xcHYzaTAxc28ydnBmamJkbndsanUifQ.sglI_YCbc3WMaZNNM_va7A');
MapboxGL.setConnected(true);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const MAP_WIDTH = Dimensions.get('window').width;
const MAP_HEIGHT = Dimensions.get('window').height;




const App = () => {
  // const coordinates = [77.6649683,12.8619337];
  const { requestPermissions, scanForPeripherals, distance,cordinates } = useBLE();
  const [routeArr, setRouteArr] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [clickedListItem, setClickedListItem] = useState(null);
  const [Data, setData] = useState([
    {
        "id": "1",
        "name": "JavaScript",
        "details": "Web Dev, Game Dev, Mobile Apps"
    },
    {
        "id": "2",
        "name": "Python",
        "details": "BackEnd, Data Science"
    }
  ]);

  const handleItemClick = (item) => {
    setClickedListItem(item);
  };
  const handleSearchBarClick = () => {
    setClicked(true);
  };
  const toggleClicked = () => {
    setClicked(!clicked); // Toggle the clicked state
  };

  console.log(clickedListItem,clicked);
  const scanForDevices = () => {
    requestPermissions(isGranted => {
      console.log(isGranted, 'grant');
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };  
  const coordinates = [77.66431108610999, 12.861412619615328];  
  const startNavigation=()=>{
    const inputCord=[77.66429275926333,12.861467014260677];//214
    const destinationNode = '6'; // Example destination node
    let newRoute=navigate(inputCord,destinationNode);
    newRoute.unshift(inputCord);
    setRouteArr(newRoute);   
    console.log(routeArr); 
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
          onSearchBarClick={handleSearchBarClick}
        />
        {clicked && (
          <List
            searchPhrase={searchPhrase}
            data={Data}
            setClicked={setClicked}
            onItemClick={handleItemClick}
            toggleClicked={toggleClicked}
          />
        )}
        {!clicked && ( // Only show the map and other components if 'clicked' is false
          <>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera zoomLevel={20} centerCoordinate={[77.66431108610999, 12.861412619615328]} />
            {statesData.features.map((feature, index) => (
              <MapboxGL.ShapeSource key={`source${index}`} id={`source${index}`} shape={feature}>
                <MapboxGL.FillLayer id={`fill${index}`} style={{ fillColor: "white" }} />
                <MapboxGL.LineLayer id={`line${index}`} style={{ lineColor: "red", lineWidth: 2 }} />
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
            ))}
            <MapboxGL.MarkerView id={"marker"} coordinate={[77.66429275926333, 12.861467014260677]}>
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
            <MapboxGL.ShapeSource id="line-source" shape={{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":routeArr}}]}}>
              <MapboxGL.LineLayer
                id="line-layer"
                style={{ lineColor: "blue", lineWidth: 6 }}
              />
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
          <View style={styles.ctaButton}>
            <Button title="Route" onPress={startNavigation}></Button>
          </View>
          
          
          </>
        )}
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
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10,
    position: 'absolute',
    top: "90%",
    left: "40%"
  }
});

export default App;

