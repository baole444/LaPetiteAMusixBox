import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../Server/constants';
import asyncQueueManager from '../async-queue-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

const sendPlayRequest = async (track_id) => {
  asyncQueueManager.pushQueue(track_id);
  console.log(`Added ${track_id} to queue.`);
};

function LibraryScreen({ navigation }) {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const loadPlaylist = async () => {
      const data = await asyncQueueManager.readPlaylist();
      setPlaylist(data || []);
    }
    loadPlaylist();

  }, []);

  const deleteTrackItem =async (track_id) => {
    try {

      const newPlaylist = playlist.filter((item) => item.trackId !== track_id);

      await AsyncStorage.setItem('playlist', JSON.stringify(newPlaylist));

      setPlaylist(newPlaylist);
    } catch (e) {
      console.error("Error deleting track: ", e);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Your Library!',
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

  const trackItems = ({ item }) => {
    return (
      <View style={styles.card}>
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
          onPress={() => deleteTrackItem(item.trackId)}
        >
          <Text style={presstableStyle.text}>Remove from playlist</Text>
        </Pressable>
      </View>

    </View>
    );
  }

  return (
    <View style={styles.container}>
      {playlist && playlist.length > 0 ? (
        <FlatList
            data ={playlist}
            renderItem ={trackItems}
            keyExtractor ={(item) => item.trackId.toString()}
        />
      ) : (
        <Text style={styles.noTracksText}>No tracks in playlist</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noTracksText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
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

const libraryStyles = StyleSheet.create({
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    width: '90%',
    height: 100,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  songInfo: {
    flexDirection: 'column',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
    color: '#6D6D6D',
  },
});

export default LibraryScreen;
