import './gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import Image_reload from './Image_reload';
import PlayerScreen from './Sreens/playerAllscr';
import asyncQueueManager from './async-queue-manager';
import LoginScr from './Sreens/loginScreen';
import DevIpConfig from './Sreens/devIp';
import * as Linking from 'expo-linking';
import SearchScreen from './Sreens/search';
import * as Notifications from 'expo-notifications';

SplashScreen.preventAutoHideAsync();

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

    if (!loaded && !error) {
        return null;
    }

    return (
      <GestureHandlerRootView>
        <View style={styles.container}>
          <NavigationContainer linking={linking}>
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
              <Drawer.Screen name = "Post Test" component={SearchScreen} />
              <Drawer.Screen name = "Login screen" component={LoginScr} />
              <Drawer.Screen name = "Dev portal" component={DevIpConfig} />
            </Drawer.Navigator>
          </NavigationContainer>
          <PlayerScreen/>
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