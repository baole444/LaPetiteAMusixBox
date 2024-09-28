import './gesture-handler';

import * as React from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import Image_reload from './Image_reload';

SplashScreen.preventAutoHideAsync();

// Temporary Code for placeholder

function Homescr({navigation}) {
  return (
    <View style = {styles.container_1}>
      <Text style = {styles.text_1}>This is Homescreen</Text>
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
    </View>
  );
}

function Bodyscr_2({navigation}) {
  return (
    <View style = {styles.container_2}>
      <Text style = {styles.text_2}>Behold, image</Text>
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
      <Text style = {styles.text_2}>Behold, image</Text>
      <Image_reload
        src={'./assets/texture/LPAMB.png'}
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

function Bodyscr_3({navigation}) {
  const sendData = () => {
    const data = {
      message: "Test message send from application."
    };

    axios.post('http://192.168.114.221:25565/test', {data}).then(response => {
      console.log('Recieve response from server:', response.data);
      Alert.alert('Server Response', JSON.stringify(response.data));
    }).catch(error => {
      console.error('Error: ', error);
      Alert.alert('Error', 'Unexpected error!');
    });
  };
  return (
    <View style = {styles.container_2}>
      <Text style = {styles.text_2}>Test server post</Text>
      <Pressable 
        style={presstableStyle.button}
        onPress={sendData}
      >
        <Text style={presstableStyle.text}>Send data</Text>

      </Pressable>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function App() {
  const [loaded, error] = useFonts({
      'Caudex': require('./assets/fonts/Caudex.ttf'),
      'Consola': require("./assets/fonts/Consola.ttf"),
  }); 
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName = "Home">
        <Drawer.Screen name = "Home" component={Homescr} />
        <Drawer.Screen name = "Detail" component={Bodyscr_1} />
        <Drawer.Screen name = "Picture" component={Bodyscr_2} />
        <Drawer.Screen name = "LPAMB" component={Bodyscr_4} />
        <Drawer.Screen name = "Post Test" component={Bodyscr_3} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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

})

export default App;