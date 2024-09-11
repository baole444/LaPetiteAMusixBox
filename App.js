import * as React from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import { Image } from 'expo-image';

SplashScreen.preventAutoHideAsync();

// Temporary Code for placeholder

function Homescr({navigation}) {
  return (
    <View style = {styles.container_1}>
      <Text style = {styles.text_1}>This is Homescreen</Text>
      <Pressable 
        style={presstableStyle.button}
        onPress={() => navigation.navigate('First Page')}
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
        onPress={() => navigation.navigate('Second Page')}
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
        onPress={() => navigation.navigate('First Page')}
      >
        <Text style={presstableStyle.text}>Next Page</Text>

      </Pressable>
    </View>
  );
}

const Stack = createNativeStackNavigator();

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
      <Stack.Navigator>
        <Stack.Screen name = "Home" component={Homescr} />
        <Stack.Screen name = "First Page" component={Bodyscr_1} />
        <Stack.Screen name = "Second Page" component={Bodyscr_2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(1,1,1,0)',
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