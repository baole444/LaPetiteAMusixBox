import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text, TextInput } from "react-native";
import requestLPAMB from "../axios/wrapperAxios";
import asyncQueueManager from "../async-queue-manager";
import { ScrollView } from "react-native-gesture-handler";

const sendPlayRequest = async (track_id) => {
    asyncQueueManager.pushQueue(track_id);
    console.log(`Added ${track_id} to queue.`);
};
  
  
function SearchScreen() {
  const [trackList, setTrackData] = useState([]);
  const [keyword, setKeyword] = useState('');

  const sendData = async () => {
      const response = await requestLPAMB('post', '/search', {data: keyword});
      try {
          if (Array.isArray(response)) {
              setTrackData(response);
          } else {
              setTrackData([]);
          }
      } catch(error) {
          console.log('Error: ', error.message);
          setTrackData([]);
      };
  };

  return (
    <View style = {styles.container_2}>
      <Text style = {styles.text_2}>Test server post</Text>
      <TextInput
        style = {text_field.search}
        placeholder="Search for music"
        value={keyword}
        onChangeText={setKeyword}
      />
      <Pressable 
        style={presstableStyle.button}
        onPress={sendData}
      >
        <Text style={presstableStyle.text}>Send data</Text>

      </Pressable>

      <ScrollView style = {styles.scrollStyle}>
        {Array.isArray(trackList) && trackList.length > 0 ? (
          trackList.map((item, index) => (
            <View key = {index} style = {styles.list_container}>
              <Text style ={styles.text_scroll}>{item.title}</Text>
              <Text style ={styles.text_scroll}>by {item.artist} in {item.album}</Text>
              <Pressable
                style={presstableStyle.button_scroll}
                onPress={() => sendPlayRequest(item.trackId)}
              >
                <Text style={presstableStyle.text_scroll}>Add to queue</Text>
              </Pressable>
              <Text style ={styles.seperator}>------------------------------</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text_scroll}>No track found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    container_2: {
      flex: 1,
      backgroundColor: 'rgba(66,120,245,100)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text_2: {
      textAlign: 'center',
      fontFamily: 'Consola',
      fontSize: 24,
      margin: 32,
      color: 'yellow',
    },
    scrollStyle: {
      marginTop: 20,
      width: '100%',
      height: 150,
      borderColor: 'white',
      borderWidth: 1,
      padding: 10,
    },
    text_scroll: {
      fontSize: 14,
      fontFamily: 'Consola',
      color: 'yellow',
    },
    seperator: {
      fontSize: 14,
      fontFamily: 'Consola',
      color: 'gray',
    },
    list_container: {
      marginBottom: 10,
    },
  });
  
  const presstableStyle = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      paddingHorizontal: 32,
      borderRadius:4,
      elevation: 0,
      backgroundColor: 'transparent',
    },
    text: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: 'bold',
      color: 'orange',
    },
    button_scroll: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      paddingHorizontal: 24,
      borderRadius:4,
      elevation: 0,
      backgroundColor: 'transparent',
    },
    text_scroll: {
      fontSize: 12,
      lineHeight: 18,
      color: 'orange',
    },
  
  });
  
  const text_field = StyleSheet.create({
    search: {
      marginVertical: 8,
      marginHorizontal: 12,
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: 'white',
      width: 300,
    }
  })

  export default SearchScreen;