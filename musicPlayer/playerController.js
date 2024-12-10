import React, { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from "react-native";
import Slider from '@react-native-community/slider';
import Image_reload from "../Image_reload";
import useNotifiPlayer from "./notfiPlayer";
import { AppState } from "react-native";
import { renderPlayerController } from "./playerContext";

const pageWidth = Dimensions.get('window').width;

const timeStampFormatter = (time) => {
    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60);
    return `${minute}:${second < 10 ? '0' : ''}${second}`;
}

const PlayController = () => {
    const { playing, setPlaying, looping, setLooping, trackSkipper, progress, progressBar, duration, instTrackID, trackName } = renderPlayerController();
    
    const [ loadState, setLoadState ] = useState(false);

    const { makeNotifiPlayer, endNotifiPlayer } = useNotifiPlayer(playing, setPlaying, looping, setLooping, trackSkipper, trackName);

    useEffect(() => {
        const event = AppState.addEventListener('change', (nexAppState) => {

            if (nexAppState === 'active' && !loadState) {
                console.log('Starting notification embeded player.');
                makeNotifiPlayer();
                setLoadState(true);
            }
        });

        return () => {
            console.log('Ending notification embeded player');
            endNotifiPlayer();
            event.remove();
            setLoadState(false);
        }
    }, []);

    return (
        <View>
            <View style={playControlButton.container}>
                <View style={playControlButton.item}>
                    <Pressable
                    onPress={() => setLooping(!looping)}
                    >
                        {looping ? (
                            <Image_reload
                                src={require('../assets/texture/loop.png')}
                                scale={1}
                            />
                        ) : (
                            <Image_reload
                                src={require('../assets/texture/loop_no.png')}
                                scale={1}
                            />
                        )}
                    </Pressable>
                </View>
                <View style={playControlButton.item}>
                    <Pressable
                    onPress={() => setPlaying(!playing)}
                    >
                        {playing ? (
                            <Image_reload
                                src={require('../assets/texture/pause.png')}
                                scale={0.5}
                            />
                        ) : (
                            <Image_reload
                                src={require('../assets/texture/play.png')}
                                scale={0.5}
                            />
                        )}
                    </Pressable>
                </View>
                <View style={playControlButton.item}>
                    <Pressable
                    onPress={() => trackSkipper()}
                    >
                            <Image_reload
                                src={require('../assets/texture/skip.png')}
                                scale={0.5}
                            />
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
            <View style={timerFormat.container}>
                <View style={timerFormat.progress_container}>
                    <Text style={timerFormat.text}>{`${timeStampFormatter(progress * duration)}`}</Text>
                </View>
                <View style={timerFormat.duration_container}>
                    <Text style={timerFormat.text}>{`${timeStampFormatter(duration)}`}</Text>
                </View>
            </View>
            <View style={title.container}>
                <View style={title.current_container}>
                    <Text style={title.current_text}>Current track:</Text>
                </View>
                <View style={title.title_container}>
                    <Text style={title.title_text}>{instTrackID === null ? "None" : trackName}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 4,
        alignItems: 'center',
    },
    slider: {
        paddingHorizontal: 10,
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
    container: {
        flexDirection: 'row',
        padding: 4,
    },
    progress_container: {
        width: pageWidth * 0.5,
        alignItems: 'flex-start',
        paddingLeft: 16,
    },
    duration_container: {
        width: pageWidth * 0.5,
        alignItems: 'flex-end',
        paddingRight: 16,
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
    },
    item: {
        padding: 4,
        width: pageWidth / 3,
        alignItems: 'center'
    },
});

const title = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        alignItems: 'center',
    },
    current_container: {
        width: pageWidth * 0.3,
        alignContent: 'flex-end'
    },
    title_container: {
        width: pageWidth * 0.7,
        alignContent: 'flex-start'
    },
    current_text: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    title_text: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
})

export default PlayController;