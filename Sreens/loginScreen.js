import * as React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import requestLPAMB from '../axios/wrapperAxios';
import secureStorageManager from '../secure-storage-manager';
import { colors, styles } from '../universal';

const style = styles.sharedStyle;
const presstable = styles.sharedPresstable;

const emailFormatCheck = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const sendLoginDetail = async(email, password) => {
    if (!email || !password) {
        console.log('Password or Email missing, retunring...');
        return;
    }

    if (!emailFormatCheck(email)) {
      console.log('The entered Email is not the correct format.');
      return;
  }

    try {
        const data = { email, password };
        const response = await requestLPAMB('post', '/api/user/login', {data: data});
        
        if (response) {
          console.log(response);
        }

    } catch (e) {
        console.log(`There was problem while login: ${e.message}`);
    }
}

function LoginScr ({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Login',
      headerStyle: {
        backgroundColor: colors.primary,
      }
    });
  }, [navigation]);

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    return (
        <View style={style.container_account}>
            <View>
                <Text style={style.title_account}> L.P.A.M.B </Text>
                <Text style={style.subtitle_account}>Account login</Text>
            </View>
            <View>
                <Text style={style.helper_text}>Email</Text>
                <TextInput
                    style={style.input_account} 
                    placeholder="Enter email adress..."
                    value={email}
                    onEndEditing={setEmail}
                />
                <Text style={style.helper_text}>Password</Text>
                <TextInput
                    style={style.input_account} 
                    secureTextEntry={true}
                    placeholder="Enter password..."
                    value={password}
                    onEndEditing={setPassword}
                />
                <View style={style.container_account}>
                    <Pressable 
                      style={presstable.button_account}
                      onPress={()=> sendLoginDetail(email, password)}
                    >
                      <Text style={presstable.text_account}>Login</Text>
                    </Pressable>
                    <Text style={style.helper_text}>Don't have an account?</Text>
                    <Text> </Text>
                    <Pressable 
                      style={presstable.button_account}
                      onPress={()=> navigation.navigate('Home')}
                    >
                      <Text style={presstable.text_account}>Continue as guess</Text>
                    </Pressable>
                    <Pressable 
                      style={presstable.button_account}
                      onPress={()=> navigation.navigate('Register')}
                    >
                      <Text style={presstable.text_account}>Register</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}


export default LoginScr;
  