import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, styles } from '../universal';
import Image_reload from '../Image_reload';

const style = styles.welcome;

function WelcomeScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

  return (
    <View style={style.container}>
      <View style={style.content}>
        <Image_reload
          src={require('../assets/texture/LPAMB.png')}
          scale={1}
        />
        <Text style={style.title}>L.P.A.M.B</Text>
        <Text style={style.subtitle}>La Petite A Musix Box</Text>
        <Pressable 
          style={style.button} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={style.button_text}>Continue as a Guest</Text>
        </Pressable>
        <Pressable 
          style={style.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={style.button_text}>Login</Text>
        </Pressable>
        <Pressable 
          style={style.button} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={style.button_text}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default WelcomeScreen;
