import * as React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import requestLPAMB from '../axios/wrapperAxios';
import secureStorageManager from '../secure-storage-manager';
import { colors, styles } from '../universal';

const style = styles.sharedStyle;
const presstable = styles.sharedPresstable;

const emailFormatCheck = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const sendRegisterDetail = async(email, username, password) => {
    if (!email || !username || !password) {
        console.log('One of the field is missing, retunring...');
        return;
    }

    if (!emailFormatCheck(email)) {
        console.log('The entered Email is not the correct format.');
        return;
    }

    try {
        const data = { email, username, password };
        const response = await requestLPAMB('post', '/api/user/register', {data: data});

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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    return (
        <View style={style.container_account}>
            <View>
                <Text style={style.title_account}> L.P.A.M.B </Text>
                <Text style={style.subtitle_account}>Account register</Text>
            </View>
            <View>
                <Text style={style.helper_text}>Email</Text>
                <TextInput
                    style={style.input_account} 
                    placeholder="Enter email adress..."
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={style.helper_text}>Username</Text>
                <TextInput
                    style={style.input_account} 
                    placeholder="Enter username..."
                    value={username}
                    onChangeText={setUsername}
                />
                <Text style={style.helper_text}>Password</Text>
                <TextInput
                    style={style.input_account} 
                    secureTextEntry={true}
                    placeholder="Enter password..."
                    value={password}
                    onChangeText={setPassword}
                />                
                <View style={style.container_account}>
                    <Pressable 
                      style={presstable.button_account}
                      onPress={()=> sendRegisterDetail(email, username, password)}
                    >
                      <Text style={presstable.text_account}>Register</Text>
                    </Pressable>
                    <Text style={style.helper_text}>Don't need an account?</Text>
                    <Pressable 
                      style={presstable.button_account}
                      onPress={()=> navigation.navigate('Home')}
                    >
                      <Text style={presstable.text_account}>Continue as guess</Text>
                    </Pressable>
                    <Text style={style.helper_text}>Already have an account?</Text>
                    <Pressable 
                      style={presstable.button_account}
                      onPress={()=> navigation.navigate('Login')}
                    >
                      <Text style={presstable.text_account}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default RegisterScr;
