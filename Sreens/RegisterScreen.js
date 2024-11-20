import * as React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import requestLPAMB from '../axios/wrapperAxios';
import secureStorageManager from '../secure-storage-manager';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../Server/constants';

const sendRegisterDetail = async(email, username, password) => {
    if (!email || !password) {
        console.log('Password or Email missing, retunring...');
        return;
    }
    try {
        const data = JSON.parse(`{"email":"${email}", "username":"${username}", "password":"${password}"}`)
        const response = await requestLPAMB('post', '/api/user/register', data);
        
        if (response) {
          console.log(response);
        }

    } catch (e) {
        console.log(`There was problem while register: ${e.message}`);
    }
}

function RegisterScr ({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}> L.P.A.M.B </Text>
                <Text style={styles.subtitle}>Account register</Text>
            </View>
            <View>
                <Text style={styles.helperText}>Email</Text>
                <TextInput
                    style={styles.input} 
                    placeholder="Enter email adress..."
                    value={email}
                    onEndEditing={setEmail}
                />
                <Text style={styles.helperText}>Username</Text>
                <TextInput
                    style={styles.input} 
                    placeholder="Enter username..."
                    value={username}
                    onEndEditing={setUsername}
                />
                <Text style={styles.helperText}>Password</Text>
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
                      onPress={()=> sendRegisterDetail(email, username, password)}
                    >
                      <Text style={presstableStyle.text}>Register</Text>
                    </Pressable>
                    <Text style={styles.helperText}>Don't need an account?</Text>
                    <Pressable 
                      style={presstableStyle.button}
                      onPress={()=> navigation.navigate('Home')}
                    >
                      <Text style={presstableStyle.text}>Continue as guess</Text>
                    </Pressable>
                    <Text style={styles.helperText}>Already have an account?</Text>
                    <Pressable 
                      style={presstableStyle.button}
                      onPress={()=> navigation.navigate('Login')}
                    >
                      <Text style={presstableStyle.text}>Login</Text>
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
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      padding: 20,
    },
    subtitle: {
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 20,
    },
    title: {
      textAlign: 'center',
      fontSize: 32,
      margin: 10,
      fontWeight: 'bold',
    },
    helperText: {
      textAlign: 'left',
      fontSize: 18,
      marginTop: 5,
    },
    input: {
      backgroundColor: '#fff',
      width: 250,
      backgroundColor: 'white',
      height: 40,
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      borderColor: 'gray',
      borderWidth: 1,
    },
  });
  
  const presstableStyle = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 10,
      elevation: 1,
      backgroundColor: colors.primary,
      width: 200,
      borderCurve: 'circular',
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: 'bold',
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
export default RegisterScr;
