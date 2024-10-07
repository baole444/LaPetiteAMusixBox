import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import musicPlayerHook from "./music-player";
import Slider from '@react-native-community/slider';

const timeStampFormatter = (millis) => {
    const minute = Math.floor(millis / 60000);
    const second = Math.floor((millis % 60000) / 1000);
    return `${minute}:${second < 10 ? '0' : ''}${second}`;
}

const PlayController = () => {
    const { playing, setPlaying, looping, setLooping, trackSkipper, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, currentTrackID, instTrackID, trackName } = musicPlayerHook();


    useEffect(() => {
        if (!isHandling && currentTrackID && instTrackID === null) {
            console.log('Checking if ID is ready... current state:', isIdReady);
            if (isIdReady) {
                trackHandler();
            }
        }

    }, [currentTrackID, instTrackID, isIdReady]);
    return (
        <View>
            <View style={playControlButton.container}>
                <View style={playControlButton.item}>
                    <Pressable
                    onPress={() => setLooping(!looping)}
                    >
                        <Text style = {styles.text}>Loop: {looping ? "Yes" : "No"}</Text>
                    </Pressable>
                </View>
                <View style={playControlButton.item}>
                    <Pressable
                    onPress={() => setPlaying(!playing)}
                    >
                        <Text style = {styles.text}>{playing ? "Pause" : "Play"}</Text>
                    </Pressable>
                </View>
                <View style={playControlButton.item}>
                    <Pressable
                    onPress={() => trackSkipper()}
                    >
                        <Text style = {styles.text}>Skip</Text>
                    </Pressable>
                </View>
            </View>

            <View style ={styles.slider}>
                <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={progress}
                        onSlidingComplete={progressBar} // Seek when slider is changed
                        minimumTrackTintColor="#1EB1FC"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1EB1FC"
                />
            </View>
            <View style={styles.time_stamp_container}>
                <View style={timerFormat.progress_container}>
                    <Text style={timerFormat.text}>{`${timeStampFormatter(progress * duration)}`}</Text>
                </View>
                <View style={timerFormat.duration_container}>
                    <Text style={timerFormat.text}>{`${timeStampFormatter(duration)}`}</Text>
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.text_2}>Handling: {isHandling ? "Busy" : "Free"} | Loading: {isLoading ? "Busy" : "Free"} | Is ID Ready: {isIdReady ? "Yes" : "No"}</Text>
                <Text style={styles.text_2}>Current track: {instTrackID === null ? 'None' : trackName}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 6,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    slider: {
        padding: 5,
        backgroundColor: '#fff',
    },
    time_stamp_container: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#fff',
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
const timerFormat = StyleSheet.create({
    progress_container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        paddingLeft: 6,
    },
    duration_container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-end',
        paddingRight: 6,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
    },
});

const playControlButton = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    item: {
        padding: 6,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
});

export default PlayController;