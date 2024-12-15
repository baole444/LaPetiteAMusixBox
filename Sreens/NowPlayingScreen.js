import '../gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { colors, styles } from '../universal';
import PlayerScreen from './PlayerAllscr';
import Image_reload from '../Image_reload';
import asyncQueueManager from '../async-queue-manager';
import requestLPAMB from '../axios/wrapperAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const style = styles.nowPlayingStyle;
const presstable = styles.sharedPresstable

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
  
      return () => {};
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
    <View>
      <View>
        <Image_reload
          source={require('../assets/texture/file_broken.png')}
        />
        <Text style={style.next_song_title}>Thumbnail coming soon(tm)</Text>
      </View>
      <PlayerScreen />
      <Text style={style.next_song_title}>Next songs:</Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {Array.isArray(trackList) && trackList.length > 0 ? (
          trackList.map((item, index) => (
            <View key={index} style={style.song_card}>
              <Text style={style.next_song_title}>{item.title}</Text>
                <Text style={style.song_card_artist}>{item.artist}</Text>
              <Pressable
                style={presstable.button}
                onPress={() => removeFromQueue(item.trackId)}
              >
                <Text style={presstable.button_text}>Remove</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={style.next_song_title}>No upcoming track</Text>
        )}
      </ScrollView>
    </View>
  );
}
  
export default NowPlayingScreen;
