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
  Keyboard,
  Alert
} from 'react-native';
import useBLE from './useBLE';
import MapboxGL from '@rnmapbox/maps';
import { statesData } from './data';
import { routeData } from './route';
import navigate from './navigate';
import { useState } from 'react';
import SearchBar from './SearchBar';
import List from './List';
import cordgraph from './cordList';


MapboxGL.setAccessToken('sk.eyJ1IjoiYWRpdHlhLWxhd2Fua2FyIiwiYSI6ImNsbm4xcHYzaTAxc28ydnBmamJkbndsanUifQ.sglI_YCbc3WMaZNNM_va7A');
MapboxGL.setConnected(true);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');

LogBox.ignoreLogs(['new NativeEventEmitter()']);



const App = () => {
  const [searchPhraseSource, setSearchPhraseSource] = useState("");
  const [searchPhraseDestination, setSearchPhraseDestination] = useState("");
  const [clickedSource, setClickedSource] = useState(false);
  const [clickedDestination, setClickedDestination] = useState(false);
  const { requestPermissions, scanForPeripherals, distance,cordinates,setCordinates } = useBLE();
  const [routeArr, setRouteArr] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [clickedSourceListItem, setClickedSourceListItem] = useState(null);
  const [clickedDestListItem, setClickedDestListItem] = useState(null);
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

// Function to handle Source item click
  const handleSourceItemClick = (item) => {
    console.log('Selected source item:', item);
    setClickedSourceListItem(item);
    item && setSearchPhraseSource(item.name);
  };

  // Function to handle destination item click
  const handleDestItemClick = (item) => {
    console.log('Selected Destination item:', item);
    setClickedDestListItem(item);
    item && setSearchPhraseDestination(item.name);
  };


  const handleSearchBarClick = (searchBar) => {
      if (searchBar === 'source') {
        setClickedSource(true);
        setClickedDestination(false); // Reset the clicked state for the destination search bar
      } else if (searchBar === 'destination') {
        setClickedDestination(true);
        setClickedSource(false); // Reset the clicked state for the source search bar
      }
    };

  const toggleClicked = (searchBar) => {
    if (searchBar === 'source') {
      setClickedSource(false);
    } else if (searchBar === 'destination') {
      setClickedDestination(false);
    }
    Keyboard.dismiss();
  };

  const scanForDevices = () => {
    requestPermissions(isGranted => {
      console.log(isGranted, 'grant');
      if (isGranted) {
        scanForPeripherals();
      }
      else
      {
        Alert.alert(
          'Permissions Needed!',
          'Make Sure You Have Bluetooth and Location Turned ON.',
          [
            {
              text: 'OK',
              // onPress: () => console.log('OK Pressed'),
            },
          ],
          { cancelable: false }
        );
      }
    });
    };  

  const startNavigation=()=>{
    const inputCord=clickedSourceListItem?cordgraph[clickedSourceListItem.id]:cordinates;
    const destinationNode = clickedDestListItem?clickedDestListItem.id:null; // Example destination node
    // console.log("innn",inputCord,destinationNode,"->",searchPhraseDestination);
    if(destinationNode)
    {
      let newRoute=navigate(inputCord,destinationNode);
      setCordinates(inputCord)
      newRoute.unshift(inputCord);
      setRouteArr(newRoute);   
      setShowRoute(true);
    }
    else
    {
      Alert.alert(
        'Incomplete Data!',
        'Fill in the Destination You Need to Visit.',
        [
          {
            text: 'OK',
            // onPress: () => console.log('OK Pressed'),
          },
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {!clickedDestination &&<SearchBar
          searchPhrase={searchPhraseSource}
          setSearchPhrase={setSearchPhraseSource}
          clicked={clickedSource}
          setClicked={() => setClickedSource(!clickedSource)}
          onSearchBarClick={() => handleSearchBarClick('source')}
          placeholderText="Search Source"
        />
        }
        {(clickedSource) && (
          <List
            searchPhrase={searchPhrase}
            data={Data}
            setClicked={setClicked}
            onItemClick={handleSourceItemClick}
            toggleClicked={toggleClicked}    
            searchBar="source"        
          />
        )}
        {/* Search bar for Destination */}
        {!clickedSource && <SearchBar
          searchPhrase={searchPhraseDestination}
          setSearchPhrase={setSearchPhraseDestination}
          clicked={clickedDestination}
          setClicked={() => setClickedDestination(!clickedDestination)}
          onSearchBarClick={() => handleSearchBarClick('destination')}
          placeholderText="Search Destination"
        />
        }
        {(clickedDestination) && (
          <List
            searchPhrase={searchPhrase}
            data={Data}
            setClicked={setClicked}
            onItemClick={handleDestItemClick}
            toggleClicked={toggleClicked}    
            searchBar="destination"        
          />
        )}

        {!(clickedSource || clickedDestination) && ( // Only show the map and other components if both of clicked is false
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
              setSearchPhraseSource("")
              setSearchPhraseDestination("")
              setClickedDestListItem(null)
              setClickedSourceListItem(null)
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

