import './gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Dimensions  } from 'react-native';
import { NavigationContainer, useNavigationState, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome } from '@expo/vector-icons'; // For heart, play, pause, shuffle, repeat, etc.
import { colors } from './Server/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';
import PlayerScreen from './Sreens/playerAllscr';
import LoginScr from './Sreens/loginScreen';
import DevIpConfig from './Sreens/devIp';
import * as Linking from 'expo-linking';
import SearchScreen from './Sreens/search';
import * as Notifications from 'expo-notifications';

SplashScreen.preventAutoHideAsync();

function NowPlayingScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Enjoy!',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      

      {/* Album Art and Song Info */}
      <View style={styles.albumContainer}>
        <Image
          source={require('./assets/brenda-lee.png')}
          style={styles.albumArt}
        />
        <Text style={styles.songTitle}>If You Love Me (Really Love Me) <FontAwesome name="heart" size={24} color="gray" style={styles.heartIcon} /></Text>
        <Text style={styles.artistName}>Brenda Lee </Text>
        
      </View>

      {/* Progress Bar and Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        {/* Shuffle, Repeat and Playback Buttons */}
        <View style={styles.controlButtons}>
          <Pressable onPress={toggleShuffle}>
            <FontAwesome
              name="random"
              size={24}
              color={isShuffling ? colors.primary : 'gray'}
            />
          </Pressable>

          <FontAwesome name="backward" size={24} color="black" />

          <Pressable onPress={togglePlayPause}>
            {isPlaying ? (
              <FontAwesome name="pause" size={24} color="black" />
            ) : (
              <FontAwesome name="play" size={24} color="black" />
            )}
          </Pressable>

          <FontAwesome name="forward" size={24} color="black" />

          <Pressable onPress={toggleRepeat}>
            <FontAwesome
              name="repeat"
              size={24}
              color={isRepeating ? colors.primary : 'gray'}
            />
          </Pressable>
        </View>
      </View>

      {/* Next Songs */}
      <Text style={styles.nextSongsTitle}>Next songs:</Text>
      <ScrollView horizontal contentContainerStyle={styles.nextSongsContainer}>
        <View style={styles.songCard}>
          <Image
            source={require('./assets/camel.png')}
            style={styles.songCardImage}
          />
          <Text style={styles.songCardTitle}>I Don’t Want to See Tomorrow</Text>
          <Text style={styles.songCardArtist}>Nat King Cole</Text>
          <FontAwesome name="times" size={24} color="black" style={styles.removeIcon} />
        </View>

        {/* Add more song cards here */}
        <View style={styles.songCardEmpty} />
        <View style={styles.songCardEmpty} />
      </ScrollView>
    </View>
  );
}

function HomeScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('./assets/LPAMB.png')} 
          style={styles.image} 
        />
        <Text style={styles.title}>L.A.M.B</Text>
        <Text style={styles.subtitle}>La à Musix Box</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('GUESS')}>
          <Text style={styles.buttonText}>Continue as a Guest</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('LOGIN')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('REGISTER')}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

// LOGIN SCREEN
function LoginScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('./assets/LPAMB.png')} 
          style={styles.image} 
        />
        <Text style={styles.title}>L.A.M.B</Text>
        <Text style={styles.subtitle}>La à Musix Box</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        
        <Pressable style={styles.button} onPress={() => console.log('Login pressed')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MusicScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Welcome Home!',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

  const [searchText, setSearchText] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="What do you want to hear sweetheart?"
          value={searchText}
          onChangeText={setSearchText}
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
        {Array(9).fill().map((_, index) => (
          <View key={index} style={styles.card} />
        ))}
      </View>
    </ScrollView>
  );
}

// LIBRARY SCREEN
function LibraryScreen({ navigation }) {
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

  const songs = [
    { title: "I Don't Want to see tomorrow", artist: 'Nat King Cole', image: require('./assets/camel.png') },
    // add song
  ];

  return (
    <ScrollView contentContainerStyle={libraryStyles.container}>
      {songs.map((song, index) => (
        <View key={index} style={libraryStyles.songContainer}>
          <Image source={song.image} style={libraryStyles.songImage} />
          <View style={libraryStyles.songInfo}>
            <Text style={libraryStyles.songTitle}>{song.title}</Text>
            <Text style={libraryStyles.songArtist}>{song.artist}</Text>
          </View>
        </View>
      ))}

      {Array(10).fill().map((_, index) => (
        <View key={index} style={libraryStyles.songContainer} />
      ))}
    </ScrollView>
  );
}


function Bodyscr_1({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('./assets/LPAMB.png')} 
          style={styles.image} 
        />
        <Text style={styles.title}>L.A.M.B</Text>
        <Text style={styles.subtitle}>La à Musix Box</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('GUESS')}>
          <Text style={styles.buttonText}>Continue as a Guest</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('LOGIN')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('REGISTER')}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}


// REGISTER SCREEN
function RegisterScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('./assets/LPAMB.png')} 
          style={styles.image} 
        />
        <Text style={styles.title}>L.A.M.B</Text>
        <Text style={styles.subtitle}>La à Musix Box</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        
        <Pressable style={styles.button} onPress={() => console.log('Register pressed')}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator();
const windowsDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const prefix = Linking.createURL('/');

const requestPerm = async () => {
  const { perm } = await Notifications.getPermissionsAsync();
  if (perm !== 'granted') {
      await Notifications.requestPermissionsAsync();
  }
  console.log('Notification permission: ', perm);
}

const useCurrentRouteName = (isNavigationReady) => {
  const navigation = useNavigationContainerRef();
  return isNavigationReady ? useNavigationState(state => state.routes[state.index].name) : null;
};

function App() {
    const linking = {
      prefixes: [prefix],
    };

    const [loaded, error] = useFonts({
        'Caudex': require('./assets/fonts/Caudex.ttf'),
        'Consola': require("./assets/fonts/Consola.ttf"),
    }); 

    const [dimensions, setDimensions] = useState({
        window: windowsDimensions,
        screen: screenDimensions,
    });

    const [isNavigationReady, setIsNavigationReady] = useState(false);
    const [currentRouteName, setCurrentRouteName] = useState(null); // State to store route name

    // Initialize navigation ref
    const navigationRef = useNavigationContainerRef();

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
    }, []);

    useEffect(() => {
      if (isNavigationReady) {
          const routeName = navigationRef.getCurrentRoute().name;
          setCurrentRouteName(routeName);

          // Listen for navigation state changes
          const unsubscribe = navigationRef.addListener('state', () => {
              const newRouteName = navigationRef.getCurrentRoute().name;
              setCurrentRouteName(newRouteName);
          });
          return unsubscribe;
      }
  }, [isNavigationReady]);

    if (!loaded && !error) {
        return null;
    }


    return (
      <GestureHandlerRootView>
        <NavigationContainer ref={navigationRef} linking={linking} onReady={() => setIsNavigationReady(true)}>
          <View style={styles.container}>
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
              <Drawer.Screen name= "Home" component={MusicScreen} />
              <Drawer.Screen name= "Menu" component={HomeScreen} />
              <Drawer.Screen name = "Post Test" component={SearchScreen} />
              <Drawer.Screen name = "Login screen" component={LoginScr} />
              <Drawer.Screen name= "Login" component={LoginScreen} />
              <Drawer.Screen name= "Register" component={RegisterScreen} />
              <Drawer.Screen name= "Library" component={LibraryScreen} />
              <Drawer.Screen name= "Now Playing" component={NowPlayingScreen} /> 
              <Drawer.Screen name = "Dev Portal" component={DevIpConfig} />
            </Drawer.Navigator>
            {currentRouteName && !["Login", "Now Playing", "Login screen", "Register", "Dev Portal"].includes(currentRouteName) && (
              <PlayerScreen />
            )}       
          </View>
        </NavigationContainer> 
    </GestureHandlerRootView>
    );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '30%',
    height: 150,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
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
    height : 40,
    justifyContent : 'center',
    alignItems : 'center',
    marginLeft : 20
  },
  genreText: {
    fontSize: 14,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  content: {
    alignItems: 'center',
    marginBottom: 80,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
    
  },
  artistName: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  heartIcon: {
    marginTop: 10,
  },

  controlsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressBar: {
    width: '80%',
    height: 5,
    backgroundColor: 'gray',
    borderRadius: 2,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressFill: {
    width: '40%', // This can be dynamically adjusted based on progress
    height: '100%',
    backgroundColor: '#FBCB3C',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  nextSongsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  nextSongsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  songCard: {
    width: 120,
    padding: 10,
    height: 270,
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
    padding: 10,
    height: 270,
    marginRight: 10,
    backgroundColor: '#FBCB3C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
});

const libraryStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    flex: 1
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    width: '90%',
    height: 100,
    marginBottom : 10,
    marginTop : 10,
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
 export default App;