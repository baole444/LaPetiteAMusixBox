import asyncQueueManager from "../async-queue-manager";
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, Alert} from 'react-native';
import { colors, styles } from '../universal';
import versionfile from "../universal/versionfile";
import requestLPAMB from "../axios/wrapperAxios";
import { openReleasePage } from "../universal/github";

const pressable = styles.sharedPresstable;
const style = styles.sharedStyle;
const devip = styles.devip;

function makeAleart(code, setConnCode) {
    switch (code) {
        case -5:
            Alert.alert(
              'Error',
              'Cannot connect to the service. Please double check the address.',
              [
                {
                  text: 'Retry',
                  onPress: () => testConn(setConnCode),
                },
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: true,
              }
            );
            break;
        case -4:
            Alert.alert(
              'Invalid response',
              'The service connected to did not response or it\'s response was empty.',
              [
                {
                  text: 'Retry',
                  onPress: () => testConn(setConnCode),
                },
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: true,
              }
            );
            break;
        case -2:
            Alert.alert(
              'Outdated Application',
              'Your LPAMB App is outdated according to the connected service. Some function might not work correctly.',
              [
                {
                  text: 'Retry',
                  onPress: () => testConn(setConnCode),
                },
                {
                  text: 'Check release',
                  onPress: () => openReleasePage(),
                },
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: true,
              }
            );
            break;
        case -1:
            Alert.alert(
              'Outdated Service',
              'The connected service might be outdated for your application. Some function might not work correctly.',
              [
                {
                  text: 'Retry',
                  onPress: () => testConn(setConnCode),
                },
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: true,
              }
            );
            break;
        case 0:
            Alert.alert(
              'Test passed',
              'Connected to service successfully.',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: true,
              }
            );
            break;
        default:
            Alert.alert(
              'Unknown Error',
              'Application encountered an unknown error. Please try again later.',
              [
                {
                  text: 'OK',
                }
              ],
              {
                cancelable: true,
              }
            );  
            break;
    }
}

async function testConn(setConnCode) {
    const data = { version: versionfile.version };
    try {
        const response = await requestLPAMB('post', '/connect', {data: data});
        const result = response ? response.code : -4; // no response , throw -4 for empty response
        setConnCode(result);
        makeAleart(result, setConnCode);
    } catch(e) {
        console.log(`Error getting status code: ${e.message}`);
        setConnCode(-5); // no connection / error checking version
        makeAleart(-5, setConnCode);
    }
}

const findIp = async () => {
    try {
        const result = await asyncQueueManager.seekIp();
        return result ? result : "No IP set yet."
    } catch (e) {
        console.log(`Error getting Ip: ${e.message}`);
        return "Error fetching IP";
    }
}

function DevIpConfig({ navigation }) {
    const [ip, setIp] = useState(null);
    const [currIp, setCurrIp] = useState("No service connected");
    const [connCode, setConnCode] = useState(-3); // -3 for untested connection

    useEffect(() => {
        console.log('Updating display IP...');
        const fetch = async () => {
            const result = await findIp();
            setCurrIp(result);
        };
        fetch();
    }, [ip])

    const updateIp = async () => {
        if (!ip) return;

        let formater = ip.trim();

        if (/^http:\/\//i.test(ip)) {
            formater = ip.replace(/^http:\/\//i, 'https://');
        }

        if (!/^https?:\/\//i.test(ip)) {
            formater = `https://${ip}`;
        }

        if (formater.endsWith('/')) {
            formater = formater.slice(0, -1);
        }

        outIp = await asyncQueueManager.pushIp(formater);
        console.log(`Setting the Ip as ${formater}`);

        const rst = await findIp();
        setCurrIp(rst);
    }

    useEffect(() => {
      navigation.setOptions({
        headerTitle: 'Music Service',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#4A4A4A',
        },
      });
    }, [navigation]);

    return (
      <View style = {style.container_account}>
        <View>
          <Text style = {style.title_account}>L.P.A.M.B Service</Text>
          <Text style = {style.subtitle_account}>Connect to a music service</Text>
        </View>
        <View>
          <Text style={style.helper_text}>Domain</Text>
          <TextInput
            style = {devip.input}
            placeholder="Enter ip address or domain name..."
            value={ip}
            onChangeText={setIp}
          />
        </View>
        <View style = {style.container_account}>
          <Pressable 
            style={pressable.button_account}
            onPress={() => updateIp()}
          >
            <Text style={pressable.text_account}>Set Service Address</Text>
          </Pressable>
          <Text> </Text>
          <Pressable 
            style={pressable.button_account}
            onPress={() => testConn(setConnCode)}
          >
            <Text style={pressable.text_account}>Test Service</Text>
          </Pressable>
        </View>
        <View>
        <Text style={style.helper_text}>Current IP: {currIp}</Text>
        </View>

      </View>
    );
}

export default DevIpConfig;