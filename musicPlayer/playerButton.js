import React, { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from "react-native";
import { Easing } from "react-native-reanimated";
import musicPlayerHook from "./music-player";
import Slider from '@react-native-community/slider';
import Carousel from "react-native-reanimated-carousel";
import Image_reload from "../Image_reload";

const pageWidth = Dimensions.get('window').width;

const timeStampFormatter = (millis) => {
    const minute = Math.floor(millis / 60000);
    const second = Math.floor((millis % 60000) / 1000);
    return `${minute}:${second < 10 ? '0' : ''}${second}`;
}

const TitleCarousel = (props) => {
    const [width, setWidth] = useState();
    const [layout, setLayout] = useState();
    useEffect(() => {
        if (typeof width === "number") setLayout({ width });
    }, [width]);

    useEffect(() => {
        setLayout(undefined);
    }, [props.text]);

    const text =  (
        <Animated.View
            style={
                [{
                    flexWrap: 'wrap',
                    width: layout?.width,
                },]
            }
        >
            <Text
                style={{ color: "white" }}
                onLayout={({ nativeEvent}) => {
                    if (typeof layout === "undefined") setWidth(nativeEvent.layout.width);
                }}
            >
                {props.text}
            </Text>
        </Animated.View>
    );

    return React.cloneElement(props.children(text, layout), {
        key: props.text,
    });
}

function TitleDisplay({trackName}) {
    return (
        <View>
            <TitleCarousel text="This is a test string">
                {(text, layout) =>{
                    return(
                        <View
                            style={{
                                alignItems: 'center',
                                flex: 1,
                                marginTop: 3
                            }}
                        >
                            <Carousel
                                width={layout?.width ?? pageWidth * 0.5}
                                height={20}
                                style={[
                                    {
                                        width: 100,
                                    }
                                ]}
                                snapEnabled={false}
                                pagingEnable={false}
                                loop
                                autoPlay
                                withAnimation={{
                                    type: 'timing',
                                    config: {
                                        duration: 1000,
                                        easing: Easing.linear,
                                    },
                                }}
                                autoPlayInterval={0}
                                data={[...new Array(6).keys()]}
                                renderItem={() => text}
                            />
                        </View>
                    );
                }}
            </TitleCarousel>
        </View>
    );
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
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    slider: {
        paddingHorizontal: 10,
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
    container: {
        flexDirection: 'row',
        padding: 4,
        backgroundColor: '#fff',
    },
    progress_container: {
        width: pageWidth * 0.5,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        paddingLeft: 16,
    },
    duration_container: {
        width: pageWidth * 0.5,
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
    },
    item: {
        padding: 4,
        width: pageWidth / 3,
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
        width: pageWidth * 0.3,
        alignContent: 'flex-end'
    },
    title_container: {
        backgroundColor: '#fff',
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