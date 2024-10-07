import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import musicPlayerHook from '../musicPlayer/music-player';
import PlayController from '../musicPlayer/playerButton';

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