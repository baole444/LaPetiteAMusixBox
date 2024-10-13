import './gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as React from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Pressable, TextInput, Dimensions, AppState, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import Image_reload from './Image_reload';
import { ScrollView } from 'react-native-gesture-handler';
import PlayerScreen from './Sreens/playerAllscr';
import asyncQueueManager from './async-queue-manager';
import LoginScr from './Sreens/loginScreen';
import musicPlayerHook from './musicPlayer/music-player';
import NotifiPlayer from './musicPlayer/notfiPlayer';
import * as Notifications from 'expo-notifications';
import DevIpConfig from './Sreens/devIp';
import requestLPAMB from './axios/wrapperAxios';
import BackgroundService from 'react-native-background-actions';

SplashScreen.preventAutoHideAsync();

// Temporary Code for placeholder

function Homescr({navigation}) {
  return (
    <View style = {styles.container_1}>
      <Text style = {styles.text_1}>LPAMB Test App</Text>
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('Detail')}
      >
        <Text style={presstableStyle.text}>Next Page</Text>

      </Pressable>
    </View>
  );
}

// Do somthing
function Bodyscr_1({navigation}) {
  return (
    <View style = {styles.container_2}>
      <Text style = {styles.text_2}>This is A detail screen</Text>
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={presstableStyle.text}>Home</Text>

      </Pressable>
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('Picture')}
      >
        <Text style={presstableStyle.text}>View Image</Text>

      </Pressable>

      <Pressable 
        style={presstableStyle.button}
        onPress={() => asyncQueueManager.dumpQueueData()}
      >
        <Text style={presstableStyle.text}>Dump async storage queue to log</Text>

      </Pressable>

      <Pressable 
        style={presstableStyle.button}
        onPress={() => asyncQueueManager.clearQueue()}
      >
        <Text style={presstableStyle.text}>Clear queue</Text>

      </Pressable>
    </View>
  );
}

function Bodyscr_2({navigation}) {
  return (
    <View style = {styles.container_2}>
      <Text style = {styles.text_2}>Expo Image library test</Text>
      <Image 
        style = {styles.image}
        placeholder={require('./assets/texture/TCB icon.png')}
        placeholderContentFit='contain'
        source={require('./assets/texture/Arsky flag.png')}
        contentFit='contain'
        transition={1000}
      />
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={presstableStyle.text}>Home</Text>

      </Pressable>
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('LPAMB')}
      >
        <Text style={presstableStyle.text}>LPAMB</Text>

      </Pressable>
    </View>
  );
}

function Bodyscr_4({navigation}) {
  return (
    <View style = {styles.container_2}>
      <Text style = {styles.text_2}>Image Reload via skia canvas test</Text>
      <Image_reload
        src={require('./assets/texture/LPAMB.png')}
        scale={2}
      />
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={presstableStyle.text}>Home</Text>

      </Pressable>
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('Post Test')}
      >
        <Text style={presstableStyle.text}>To Post test</Text>

      </Pressable>
    </View>
  );
}

const sendPlayRequest = async (track_id) => {
  asyncQueueManager.pushQueue(track_id);
  console.log(`Added ${track_id} to queue.`);
};


function Bodyscr_3() {
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

const Drawer = createDrawerNavigator();
const windowsDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

axios.defaults.validateStatus = () => true;

const requestPerm = async () => {
  const { perm } = await Notifications.getPermissionsAsync();
  if (perm !== 'granted') {
      await Notifications.requestPermissionsAsync();
  }
  console.log('Notification permission: ', perm);
}

function App() {
  const [count, setCount] = useState(0);
  const appState = useRef(AppState.currentState);

  const veryIntensiveTask = async (taskData) => {
    const { delay } = taskData;
    while (BackgroundService.isRunning()) {
      // Update state
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        console.log('Count:', newCount); // Log the count to the console
        return newCount;
      });
      // Sleep for the given delay (in milliseconds)
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const options = {
    taskName: 'ForegroundService',
    taskTitle: 'Foreground Task Running',
    taskDesc: 'This task runs in the background as a foreground service.',
    taskIcon: {
      name: 'ic_launcher', // Icon name for the notification
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourapp://home', // Deep link to open the app when the notification is clicked
    parameters: {
      delay: 1000, // Run the task every 1 second
    },
  };

  const startBackgroundTask = async () => {
    try {
      await BackgroundService.start(veryIntensiveTask, options);
    } catch (error) {
      console.error(error);
    }
  };

  const stopBackgroundTask = async () => {
    await BackgroundService.stop();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);


    const [loaded, error] = useFonts({
        'Caudex': require('./assets/fonts/Caudex.ttf'),
        'Consola': require("./assets/fonts/Consola.ttf"),
    }); 

    const [dimensions, setDimensions] = useState({
        window: windowsDimensions,
        screen: screenDimensions,
    });

    const { playing, setPlaying, looping, setLooping, trackSkipper, trackName } = musicPlayerHook();

    useEffect(() => {
      const listener = Dimensions.addEventListener(
        'change', ({window, screen}) => {
          setDimensions({window, screen});
        },
      );
      return () => listener?.remove();
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
      requestPerm();
      NotifiPlayer(playing, setPlaying, looping, setLooping, trackSkipper, trackName);
    }, [playing, looping, trackName]);

    if (!loaded && !error) {
        return null;
    }


    return (
      <GestureHandlerRootView>
        <View>
          <Text>Test background task, watch number rise.</Text>
          <Button title="Start Foreground Task" onPress={startBackgroundTask} />
          <Button title="Stop Foreground Task" onPress={stopBackgroundTask} />
          <Text>Count: {count}</Text>
        </View>
        <View style={styles.container}>
          <NavigationContainer>
            <Drawer.Navigator 
              initialRouteName = "Home"
              screenOptions={
                {
                  drawerStyle: {
                    width: windowsDimensions.width * 0.5
                  },
                }
              }
            >
              <Drawer.Screen name = "Home" component={Homescr} />
              <Drawer.Screen name = "Detail" component={Bodyscr_1} />
              <Drawer.Screen name = "Picture" component={Bodyscr_2} />
              <Drawer.Screen name = "LPAMB" component={Bodyscr_4} />
              <Drawer.Screen name = "Post Test" component={Bodyscr_3} />
              <Drawer.Screen name = "Login screen" component={LoginScr} />
              <Drawer.Screen name = "Dev portal" component={DevIpConfig} />
            </Drawer.Navigator>
          </NavigationContainer>
          <PlayerScreen/>
          <View>
            <Text style={styles.text_dev_warn}>This is an experimental build and is not the final product. The build may be sujected to bugs or unexpected behaviours</Text>
            <Text style={styles.text_dev_warn}>Tester is informed and advised.</Text>
          </View>
        </View>
      </GestureHandlerRootView> 
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(1,1,1,0)',
    resizeMode: 'contain',
    imageRendering: 'pixelated',
  },
  container_1: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_2: {
    flex: 1,
    backgroundColor: 'rgba(66,120,245,100)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_1: {
    textAlign: 'center',
    fontFamily: 'Caudex',
    fontSize: 32,
    margin: 32,
    color: 'blue',
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
  text_dev_warn: {
    fontSize: 12,
    fontFamily: 'Consola',
    color: 'orange',
    textAlign: 'left',
    padding: 4,
  },
  text_dev_issue: {
    fontSize: 14,
    fontFamily: 'Consola',
    color: 'red',
    textAlign: 'left',
    padding: 4,
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

export default App;