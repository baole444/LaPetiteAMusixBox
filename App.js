import './gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions  } from 'react-native';
import { NavigationContainer, useNavigationState, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import WelcomeScreen from './Sreens/WelcomeScreen';
import RegisterScreen from './Sreens/RegisterScreen';
import HomeScreen from './Sreens/HomeScreen';
import PlayerScreen from './Sreens/PlayerAllscr';
import NowPlayingScreen from './Sreens/NowPlayingScreen';
import LoginScr from './Sreens/LoginScreen';
import DevIpConfig from './Sreens/DevIP';
import LibraryScreen from './Sreens/LibraryScreen';
import { MusicControllerProvider } from './musicPlayer/playerContext';

SplashScreen.preventAutoHideAsync();

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

    //const [loaded, error] = useFonts({
    //    'Caudex': require('./assets/fonts/Caudex.ttf'),
    //    'Consola': require("./assets/fonts/Consola.ttf"),
    //}); 

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

    //useEffect(() => {
    //    if (loaded || error) {
    //        SplashScreen.hideAsync();
    //    }
    //}, [loaded, error]);

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

    //if (!loaded && !error) {
    //    return null;
    //}

    return (
      <GestureHandlerRootView>
        <MusicControllerProvider>
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
                <Drawer.Screen name= "Home" component={HomeScreen} />
                <Drawer.Screen name= "Account" component={WelcomeScreen} />
                <Drawer.Screen name = "Login" component={LoginScr} />
                <Drawer.Screen name= "Register" component={RegisterScreen} />
                <Drawer.Screen name= "Library" component={LibraryScreen} />
                <Drawer.Screen name= "Now Playing" component={NowPlayingScreen} /> 
                <Drawer.Screen name = "Music Service" component={DevIpConfig} />
              </Drawer.Navigator>
              {currentRouteName && !["Login", "Now Playing", "Register", "Music Service"].includes(currentRouteName) && (
                <PlayerScreen />
              )}       
            </View>
          </NavigationContainer>
        </MusicControllerProvider>   
    </GestureHandlerRootView>
    );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
 export default App;