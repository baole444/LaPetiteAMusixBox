import asyncQueueManager from "../async-queue-manager";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TextInput} from 'react-native';

const findIp = async () => {
    try {
        const result = await asyncQueueManager.seekIp();
        return result ? result : "No IP set yet."
    } catch (e) {
        console.log(`Error getting Ip: ${e.message}`);
        return "Error fetching IP";
    }
}

function DevIpConfig() {
    const [ip, setIp] = useState(null);
    const [currIp, setCurrIp] = useState("Loading...");

    useEffect(() => {
        console.log('Updating display IP...');
        const fetch = async () => {
            const result = await findIp();
            setCurrIp(result);
        };
        fetch();
    }, [ip])

    const updateIp = async () => {
        if (ip) {
            let formater = ip;

            if (/^http:\/\//i.test(ip)) {
                formater = ip.replace(/^http:\/\//i, 'https://');
            }

            if (!/^https?:\/\//i.test(ip)) {
                formater = `https://${ip}`;
            }
            outIp = await asyncQueueManager.pushIp(formater);
            console.log(`Setting the Ip as ${formater}`);

            const rst = await findIp();
            setCurrIp(rst);
        }
    }

    return (
      <View style = {style.container}>
        <Text style = {style.title}>Update Server IP</Text>
        <TextInput
          style = {style.input}
          placeholder="Enter Sever Adress"
          value={ip}
          onChangeText={setIp}
        />
        <Text style={style.mini}>*"https://" is not needed</Text>
        <Pressable 
          style={presstableStyle.button}
          onPress={updateIp}
        >
          <Text style={presstableStyle.text}>Set Ip value</Text>
        </Pressable>
        <Text style={style.text}>Current IP: {currIp}</Text>
        <Pressable 
            style={presstableStyle.button}
            onPress={() => asyncQueueManager.dumpIpData()}
        >
        <Text style={presstableStyle.text}>Dump async Ip to log</Text>

      </Pressable>
      </View>
    );
}

const style = StyleSheet.create({
    container: {
        alignContent: 'center',
        padding: 4,
        flex: 1,
        backgroundColor: '#232324'
    },
    input: {
        marginVertical: 8,
        marginHorizontal: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: '#3c3c3d',
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
        color: '#69696b',
    },
    mini: {
        fontSize: 12,
        color: 'red',
        paddingHorizontal: 5,
    },
    title: {
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
});
export default DevIpConfig;