import '../gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { colors, styles } from '../universal';
import PlayerScreen from './PlayerAllscr';
import Image_reload from '../Image_reload';
import asyncQueueManager from '../async-queue-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const style = styles.nowPlayingStyle;
const presstable = styles.sharedPresstable

function NowPlayingScreen({ navigation }) {
  const [trackList, setTrackData] = useState([]);

  // Fetch detailed info for all tracks in the queue
  const fetchQueueInfo = async () => {
      try {
          const queue = await asyncQueueManager.readQueue();

          if (!Array.isArray(queue) || queue.length === 0) {
              console.log('No tracks in the queue.');
              setTrackData([]);
              return;
          }

          setTrackData(queue);
      } catch (error) {
          console.error('Error in fetchQueueInfo:', error.message);
      }
  };

  useFocusEffect(
      React.useCallback(() => {

      const initializeQueue = async () => {
          try {
              const queue = await asyncQueueManager.readQueue();
              setTrackData(queue || []);
          } catch (error) {
              console.error('Error initializing queue:', error);
          }
      };
  
          initializeQueue();
  
          return () => {};
      }, []) 
  );

  // Remove a track from the queue
  const removeFromQueue = async (index) => {
      try {
          const updatedQueue = [...trackList];

          updatedQueue.splice(index, 1);
  
          await AsyncStorage.setItem('queue', JSON.stringify(updatedQueue));
  
          setTrackData(updatedQueue);

          fetchQueueInfo();
          console.log(`Track at index ${index} removed successfully.`);
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
                {(index > 0) ? (
                  <Pressable
                    style={presstable.button}
                    onPress={() => removeFromQueue(index)}
                    >
                    <Text style={presstable.button_text}>Remove</Text>
                  </Pressable>
                ) : (
                  <Text style={style.song_card_artist}>Current track</Text>
                )}
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
