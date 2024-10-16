
import * as React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import requestLPAMB from '../axios/wrapperAxios';
import secureStorageManager from '../secure-storage-manager';
import { NavigationContainer } from '@react-navigation/native';

const sendLoginDetail = async(email, password) => {
    if (!email || !password) {
        console.log('Password or Email missing, retunring...');
        return;
    }
    try {
        const data = JSON.parse(`{"email":"${email}", "password":"${password}"}`)
        const response = await requestLPAMB('post', '/api/user/login', data);
        
        if (response) {
          console.log(response);
        }

    } catch (e) {
        console.log(`There was problem while login: ${e.message}`);
    }
}

function LoginScr ({navigation}) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text_1}>Login to your LPAMB Account</Text>
            </View>
            <View>
                <Text style={styles.text_2}>Email</Text>
                <TextInput
                    style={styles.input} 
                    placeholder="Enter email adress..."
                    value={email}
                    onEndEditing={setEmail}
                />
                <Text style={styles.text_2}>Password</Text>
                <TextInput
                    style={styles.input} 
                    secureTextEntry={true}
                    placeholder="Enter password..."
                    value={password}
                    onEndEditing={setPassword}
                />
                <View style={styles.container}>
                    <Pressable 
                      style={presstableStyle.button}
                      onPress={()=> sendLoginDetail(email, password)}
                    >
                      <Text style={presstableStyle.text}>Login</Text>
                    </Pressable>
                    <Text> </Text>
                    <Pressable 
                      style={presstableStyle.button}
                      onPress={()=> navigation.navigate('Home')}
                    >
                      <Text style={presstableStyle.text}>Continue as guess</Text>
                    </Pressable>
                    <Text style={styles.text_2}>Don't have an account?</Text>
                    <Pressable 
                      style={presstableStyle.button}
                      onPress={()=> navigation.navigate('Register')}
                    >
                      <Text style={presstableStyle.text}>Register</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

function UserInfo({navigation}) {
    const [ isSessionValid, setIsSessionValid] = useState(false);
    const [ status, setStatus] = useState(0);

    const sessionValidator = async () => {
        const shortToken = await secureStorageManager.loadValue('shortToken');

        if (shortToken) {
            try {
                const shortResponse = await requestLPAMB('post', '/api/user/session');

            } catch (e) {
                console.log(`Session under construction, ${e.message}`);
            }
        }
    }

    return (
      <View style={styles.container}>
          <View>
              <Text style={styles.text_1}>Account info</Text>
          </View>
          <View>
              <Text style={styles.text_2}>WIP account info page</Text>
              <View style={styles.container}>
                  <Text> </Text>
                  <Text style={styles.text_2}>Don't have an account?</Text>
                  <Pressable 
                    style={presstableStyle.button}
                    onPress={()=> navigation.navigate('Register')}
                  >
                    <Text style={presstableStyle.text}>Register</Text>
                  </Pressable>
              </View>
          </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container_1: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(66,120,245,100)',
      alignItems: 'center',
      padding: 20,
    },
    text_1: {
      textAlign: 'center',
      fontFamily: 'Caudex',
      fontSize: 24,
      margin: 20,
      color: 'orange',
    },
    text_2: {
      textAlign: 'left',
      fontSize: 20,
      color: 'yellow',
      marginTop: 20,
    },
    input: {
      width: 250,
      backgroundColor: 'white',
      height: 40,
      padding: 10,
    },
  });
  
  const presstableStyle = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 1,
      elevation: 0,
      backgroundColor: 'orange',
      width: 200,
    },
    text: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: 'bold',
      color: 'white',
    },
    button_scroll: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      paddingHorizontal: 24,
      borderRadius:4,
      elevation: 0,
      backgroundColor: 'orange',
    },  
  });

  export default LoginScr;
  