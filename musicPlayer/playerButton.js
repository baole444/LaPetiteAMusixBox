import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import musicPlayerHook from "./music-player";

const PlayController = () => {
    const { playing, setPlaying, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, currentTrackID, instTrackID, trackName } = musicPlayerHook();


    useEffect(() => {
        if (!isHandling && currentTrackID && instTrackID === null) {
            console.log('Checking if ID is ready... current state:', isIdReady);
            if (isIdReady) {
                trackHandler();
            }
        }

    }, [currentTrackID, instTrackID, isIdReady]);
    return (
        <View style={styles.container}>
        <Pressable
            onPress={() => setPlaying(!playing)}
        >
            <Text style = {styles.text}>{playing ? "Pause" : "Play"}</Text>
        </Pressable>

        <Text style={styles.text_2}>Progress of track: {Math.round((progress + Number.EPSILON) * 10000) / 100}%</Text>
        <Text style={styles.text_2}>Handling: {isHandling ? "Busy" : "Free"} | Loading: {isLoading ? "Busy" : "Free"} | Is ID Ready: {isIdReady ? "Yes" : "No"}</Text>
        <Text style={styles.text_2}>Current track: {instTrackID === null ? 'None' : trackName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
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
    text_2: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
    },    


});

export default PlayController;