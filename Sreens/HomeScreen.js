import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { colors } from '../Server/constants';
import requestLPAMB from "../axios/wrapperAxios";
import asyncQueueManager from "../async-queue-manager";

const sendPlayRequest = async (track_id) => {
  asyncQueueManager.pushQueue(track_id);
  console.log(`Added ${track_id} to queue.`);
};

const saveToPlayList = async (track_info) => {
  asyncQueueManager.pushPlaylist(track_info);
  console.log(`Pushing ${track_info.trackId} to playlist...`);
}

function HomeScreen({ navigation }) {
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Welcome Home!',
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A4A4A',
      },
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="What do you want to hear sweetheart?"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={sendData}
          returnKeyType='search'
        />
      </View>
      
      <View style={styles.genreContainer}>
        {['Jazz', 'Bass', 'Lo-fi', 'Pop', 'Rock'].map((genre, index) => (
          <Pressable key={index} style={styles.genreButton}>
            <Text style={styles.genreText}>{genre}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.cardContainer}>
        {Array.isArray(trackList) && trackList.length > 0 ? (trackList.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardSubContainer}>
              <Text style={styles.cardSubTitle}>Artist: </Text>
              <Text style={styles.cardText}>{item.artist}</Text>
            </View>
            <View style={styles.cardSubContainer}>
              <Text style={styles.cardSubTitle}>Album: </Text>
              <Text style={styles.cardText}>{item.album}</Text>
            </View>
            <View style={presstableStyle.presstableSubContainer}>
              <Pressable
                style={presstableStyle.button}
                onPress={() => sendPlayRequest(item.trackId)}
              >
                <Text style={presstableStyle.text}>Add to queue</Text>
              </Pressable>
              <Pressable
              style={presstableStyle.button}
              onPress={() => saveToPlayList(item)}
              >
                <Text style={presstableStyle.text}>Save to playlist</Text>
              </Pressable>
            </View>
          </View>
          ))
        ) : (
          <Text style={styles.cardText}>No track found</Text>
        )
      } 
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    width: '95%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 40,
    backgroundColor: '#f5f5f5',
  },
  genreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genreButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  genreText: {
    fontSize: 14,
    color: '#fff',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '86%',
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 16,
    padding: 4,
    color: '#3f2b77',
    fontWeight: 'bold',
  },
  cardText: {
    textAlign: 'center',
    fontSize: 12,
    padding: 4,
    fontWeight: '400',
    color: '#5b6ee1',
  },
  cardSubTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    padding: 4,
  },
  cardSubContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

const presstableStyle = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: colors.primary,
    borderCurve: 'circular',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
    color: '#222034',
  },
  presstableSubContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly'
  },
});

export default HomeScreen;
