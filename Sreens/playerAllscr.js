import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import musicPlayerHook from '../musicPlayer/music-player';
import PlayController from '../musicPlayer/playerButton';


/*
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

              

*/

function PlayerScreen() {
    const { playing, setPlaying } = musicPlayerHook();

    return (
        <View style={styles.container}>
            <PlayController playing={playing} setPlaying={setPlaying} />

        </View>
    );

};

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
});

export default PlayerScreen;