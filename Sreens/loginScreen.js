
import * as React from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

function LoginScr () {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    return (
        <View>
            <View>
                <Text>Login to your LPAMB Account</Text>
            </View>
            <View>
                <Text>Email</Text>
                <TextInput
                    placeholder="Enter email adress..."
                    value={email}
                    onChangeText={setEmail}
                />
                <Text>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    placeholder="Enter password..."
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
        </View>

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

  export default LoginScr;
  