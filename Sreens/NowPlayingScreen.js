import '../gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Dimensions  } from 'react-native';
import { colors } from '../Server/constants';
import * as SplashScreen from 'expo-splash-screen';
import PlayerScreen from './playerAllscr';
import Image_reload from '../Image_reload';
import asyncQueueManager from '../async-queue-manager';
import requestLPAMB from '../axios/wrapperAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
SplashScreen.preventAutoHideAsync();

function NowPlayingScreen({ navigation }) {
  const [trackList, setTrackData] = useState([]); // For fetched track details
  const [queue, setQueue] = useState([]); // For track IDs in the queue

  // Fetch detailed info for all tracks in the queue
  const fetchQueueInfo = async () => {
    try {
      const queueIds = await asyncQueueManager.readQueue();
      console.log('Queue IDs:', queueIds);

      if (!Array.isArray(queueIds) || queueIds.length === 0) {
          console.log('No tracks in the queue.');
          setTrackData([]);
          return;
      }

      const trackDataPromises = queueIds.map((id) => fetchInfo(id));
      const resolvedTracks = await Promise.all(trackDataPromises);
      const validTracks = resolvedTracks.filter((track) => track);
      setTrackData(validTracks);
  } catch (error) {
      console.error('Error in fetchQueueInfo:', error.message);
  }
  };

  // Fetch details for a single track
  const fetchInfo = async (track_id) => {
    try {
      console.log('Calling fetchInfo for ID:', track_id);
      const response = await requestLPAMB('post', '/api/music/fullinfo', { data: track_id });
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        return response; 
      }
    } catch (error) {
      console.error('Error fetching track info:', error.message);
    }
    return null; a
  };
  useFocusEffect(
    React.useCallback(() => {

      const initializeQueue = async () => {
        try {
          const savedQueue = await asyncQueueManager.readQueue();
          setQueue(savedQueue || []);
        } catch (error) {
          console.error('Error initializing queue:', error);
        }
      };
  
      initializeQueue();
  

      return () => {

      };
    }, []) 
  );

  useEffect(() => {
    fetchQueueInfo();
  }, []);
  
  useEffect(() => {
    if (queue.length > 0) {
      fetchQueueInfo(); // Fetch updated track info whenever queue changes
    }
  }, [queue]);

  // Remove a track from the queue
  const removeFromQueue = async (trackId) => {
    try {
      // Filter out the track to be removed
      const updatedQueue = queue.filter((item) => item !== trackId);
  
      // Update AsyncStorage
      await AsyncStorage.setItem('playerQueue', JSON.stringify(updatedQueue));
  
      // Update local state
      setQueue(updatedQueue);
  
      // Update track list
      const updatedTrackList = trackList.filter((track) => track.trackId !== trackId);
      setTrackData(updatedTrackList);
  
      console.log(`Track with ID ${trackId} removed successfully.`);
    } catch (error) {
      console.error("Error removing track from queue: ", error);
    }
  };

  useEffect(() => {
 
    navigation.setOptions({
      headerTitle: 'Enjoy!',
      headerStyle: { backgroundColor: colors.primary },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.albumContainer}>
        <Image_reload
          source={require('../assets/texture/file_broken.png')}
        />
        <Text style={styles.nextSongsTitle}>Thumbnail coming soon(tm)</Text>
      </View>

      <PlayerScreen />

      <Text style={styles.nextSongsTitle}>Next songs:</Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {Array.isArray(trackList) && trackList.length > 0 ? (
          trackList.map((item, index) => (
            <View key={index} style={styles.songCard}>
              <Text style={styles.nextSongsTitle}>{item.title}</Text>
                <Text style={styles.songCardArtist}>{item.artist}</Text>
              <Pressable
                style={presstableStyle.button}
                onPress={() => removeFromQueue(item.trackId)}
              >
                <Text style={presstableStyle.text}>Remove</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.cardText}>No upcoming tracks</Text>
        )}
      </ScrollView>
    </View>
  );
}

  const styles = StyleSheet.create({
    nextSongsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
    },
    nextSongsContainer: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'center',
    },
    songCard: {
      width: 120,
      padding: 10,
      marginRight: 10,
      backgroundColor: '#FBCB3C',
      borderRadius: 10,
      alignItems: 'center',
    },
    songCardImage: {
      width: 80,
      height: 80,
      borderRadius: 5,
      marginBottom: 5,
    },
    songCardTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    songCardArtist: {
      fontSize: 12,
      color: 'gray',
      textAlign: 'center',
    },
    songCardEmpty: {
      width: 120,
      height: 270,
      marginRight: 10,
      backgroundColor: '#FBCB3C',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }
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
  
export default NowPlayingScreen;
