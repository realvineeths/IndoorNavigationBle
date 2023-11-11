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
  Dimensions,
  Keyboard
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
  const [destinationId, setDestinationId] = useState("1");
  const [clickedListItem, setClickedListItem] = useState(null);
  const [showRoute,setShowRoute]=useState(false);
  const [Data, setData] = useState([
    {
        "id": "1",
        "name": "210",
        "details": "Prajwala Ma'am Cabin"
    },
    {
        "id": "2",
        "name": "HOD(CSE)",
        "details": "Sandhesh Sir Cabin"
    },
    {
      "id": "3",
      "name": "213",
      "details": "Rohit Sir Cabin"
    },  
    {
      "id": "4",
      "name": "206",
      "details": "Nivedita Ma'am Cabin"
    },      
    {
      "id": "5",
      "name": "Equipment Room",
      "details": ""
    },
    {
      "id": "6",
      "name": "209",
      "details": "Ruby Ma'am Cabin"
    }    
  ]);


  // const handleSearchPhrase=(searchPhrase)=>{
  //   setSearchPhrase(searchPhrase);
  // }

  const handleItemClick = (item) => {
    // console.log("itemm",item);
    setClickedListItem(item);
    item && setSearchPhrase(item.name);
    // setDestinationId(clickedListItem.id);
  };
  const handleSearchBarClick = () => {
    setClicked(true);
  };
  const toggleClicked = () => {
    setClicked(false);
    Keyboard.dismiss();
    // setClicked(!clicked); // Toggle the clicked state
  };

  // clickedListItem && setDestinationId(clickedListItem.id);
  if(clickedListItem)
  {
    console.log(clickedListItem.id,clicked);
  }
  // console.log(destinationId,clicked);
  const scanForDevices = () => {

    requestPermissions(isGranted => {
      console.log(isGranted, 'grant');
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };  
  // const coordinates = [77.66431108610999, 12.861412619615328];  
  const startNavigation=()=>{
    const inputCord=[77.66429275926333,12.861467014260677];//214
    // const destinationNode = '6'; // Example destination node
    const destinationNode = clickedListItem?clickedListItem.id:'1'; // Example destination node
    let newRoute=navigate(inputCord,destinationNode);
    newRoute.unshift(inputCord);
    setRouteArr(newRoute);   
    setShowRoute(true);
    console.log(routeArr); 
  }
  // console.log(cordinates[0],cordinates[1]);
  // console.log(showRoute);

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
            {/* <MapboxGL.MarkerView id={"marker"} coordinate={[ 77.67569307888573,12.86147281303252]}> */}
            <MapboxGL.MarkerView id={"marker"} coordinate={[ 77.66460484969053,12.86113345667043]}>
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
            {showRoute && <MapboxGL.ShapeSource id="line-source" shape={{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":routeArr}}]}}>
              <MapboxGL.LineLayer
                id="line-layer"
                style={{ lineColor: "black", lineWidth: 6 }}
              />
            </MapboxGL.ShapeSource>
            }
            {routeArr.length>0 && showRoute && <MapboxGL.MarkerView id={"marker2"} coordinate={routeArr[routeArr.length-1]}>
              <View>
                <View style={styles.markerContainer}>
                  <Image
                    source={require("./location2.png")}
                    style={{
                      width: 20,
                      height: 30,
                      resizeMode: "cover",
                    }}
                  />
                </View>
              </View>
            </MapboxGL.MarkerView>      
            }      
          </MapboxGL.MapView>
          <View style={styles.ctaButton1}>
            <Button title="Locate" onPress={scanForDevices}></Button>
          </View>

          <View style={styles.ctaButton2}>
            <Button title="Route" onPress={startNavigation}></Button>
          </View>

          {showRoute && <View style={styles.ctaButton3}>
            <Button title="Cancel Route" onPress={()=>{
              setShowRoute(false)
            }} color="red" ></Button>
          </View>
          }
          

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
  ctaButton1: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10,
    position: 'absolute',
    top: "85%",
    left: "20%"
  },
  ctaButton2: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10,
    position: 'absolute',
    top: "85%",
    left: "60%"
  },
  ctaButton3: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10,
    position: 'absolute',
    top: "91%",
    left: "30%"
  }  
});

export default App;

