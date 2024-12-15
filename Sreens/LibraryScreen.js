import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, styles } from '../universal';
import asyncQueueManager from '../async-queue-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const style = styles.libraryStyle;
const shared = styles.sharedStyle
const presstable = styles.sharedPresstable;

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

  useFocusEffect(
    React.useCallback(() => {

      const initializePlaylist = async () => {
        try {
          const data = await asyncQueueManager.readPlaylist();
          setPlaylist(data || []);
        } catch (error) {
          console.error('Error initializing queue:', error);
        }
      };
  
      initializePlaylist();

      return () => {

      };
    }, []) 
  );

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
      <View style={style.card}>
      <Text style={shared.card_title}>{item.title}</Text>
      <View style={shared.card_sub_container}>
        <Text style={shared.card_sub_title}>Artist: </Text>
        <Text style={shared.card_text}>{item.artist}</Text>
      </View>
      <View style={shared.card_sub_container}>
        <Text style={shared.card_sub_title}>Album: </Text>
        <Text style={shared.card_text}>{item.album}</Text>
      </View>
      <View style={presstable.presstable_sub_container}>
        <Pressable
          style={presstable.button}
          onPress={() => sendPlayRequest(item.trackId)}
        >
          <Text style={presstable.button_text}>Add to queue</Text>
        </Pressable>
        <Pressable
          style={presstable.button}
          onPress={() => deleteTrackItem(item.trackId)}
        >
          <Text style={presstable.button_text}>Remove from playlist</Text>
        </Pressable>
      </View>

    </View>
    );
  }

  return (
    <View style={style.container}>
      {playlist && playlist.length > 0 ? (
        <FlatList
            data ={playlist}
            renderItem ={trackItems}
            keyExtractor ={(item) => item.trackId.toString()}
        />
      ) : (
        <Text style={style.song_title}>No tracks in playlist</Text>
      )}
    </View>
  );
}

export default LibraryScreen;
