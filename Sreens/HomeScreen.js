import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { colors, styles } from '../universal';
import requestLPAMB from "../axios/wrapperAxios";
import asyncQueueManager from "../async-queue-manager";

const style = styles.homescrStyle;
const shared = styles.sharedStyle;
const presstable = styles.sharedPresstable;

const sendPlayRequest = async (track_info) => {
  asyncQueueManager.pushQueue(track_info);
  console.log(`Added ${track_info.trackId} to queue...`);
};

const saveToPlayList = async (track_info) => {
  asyncQueueManager.pushPlaylist(track_info);
  console.log(`Pushing ${track_info.trackId} to playlist...`);
}

function HomeScreen({ navigation }) {
  const [trackList, setTrackData] = useState([]);
  const [keyword, setKeyword] = useState('');

  const sendData = async () => {
      const response = await requestLPAMB('post', '/api/music/search', {data: keyword});
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
      <View style={style.search_container}>
        <TextInput
          style={style.search_input}
          placeholder="What do you want to hear sweetheart?"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={sendData}
          returnKeyType='search'
        />
      </View>
      
      <View style={style.genre_container}>
        {['Jazz', 'Bass', 'Lo-fi', 'Pop', 'Rock'].map((genre, index) => (
          <Pressable key={index} style={style.genre_button}>
            <Text style={style.genre_text}>{genre}</Text>
          </Pressable>
        ))}
      </View>

      <View style={style.card_container}>
        {Array.isArray(trackList) && trackList.length > 0 ? (trackList.map((item, index) => (
          <View key={index} style={style.card}>
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
                onPress={() => sendPlayRequest(item)}
              >
                <Text style={presstable.button_text}>Add to queue</Text>
              </Pressable>
              <Pressable
              style={presstable.button}
              onPress={() => saveToPlayList(item)}
              >
                <Text style={presstable.button_text}>Save to playlist</Text>
              </Pressable>
            </View>
          </View>
          ))
        ) : (
          <Text style={style.card_text}>No track found</Text>
        )
      } 
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
