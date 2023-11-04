import React from "react";
import { StyleSheet, Text,TextInput, View, Keyboard, Button ,TouchableWithoutFeedback} from "react-native";

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked,onSearchBarClick  }) => {
  return (
    <TouchableWithoutFeedback onPress={onSearchBarClick}>
    <View>
      <View style={clicked ? styles.searchBarClicked : styles.searchBarUnclicked}>
        {/* Search Icon */}
        <Text style={styles.searchIcon}>&#128269;</Text>
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search Destination"
          placeholderTextColor="grey" 
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* Cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Text
            style={styles.crossIcon}
            onPress={() => {
              setSearchPhrase("");
            }}
          >
            &#10006;
          </Text>
        )
        }
      </View>
      {clicked && (
        // <View>
        //   <Button
        //     title="Cancel"
        //     onPress={() => {
        //       Keyboard.dismiss();
        //       setClicked(false);
        //     }}
        //   />
        // </View>
        <View style={styles.cancelButtonContainer}>
            <Button
              title="Cancel"
              color="red" // Change the text color to red
              onPress={() => {
                Keyboard.dismiss();
                setClicked(false);
              }}
            />
          </View>
      )
      }
    </View>
  </TouchableWithoutFeedback>
  );
};

export default SearchBar;

// Styles
const styles = StyleSheet.create({
  container: {
    margin: 10,
    // padding:10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBarUnclicked: {
    // padding: 5,    
    flexDirection: "row",
    width: "95%",
    backgroundColor: "white",
    borderRadius: 15,    
    alignItems: "center",
    borderColor: "black", // Add black border color
    borderWidth: 2, // Add border width
  },
  searchBarClicked: {
    // padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  searchIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  crossIcon: {
    fontSize: 20,
    padding: 1,
  },
  cancelButtonContainer: {
    margin: 5,
    width: "40%",
    marginLeft:"30%"

  },
});
