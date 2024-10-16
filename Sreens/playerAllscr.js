import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import PlayController from '../musicPlayer/playerButton';
import musicPlayerHook from '../musicPlayer/music-player';

function PlayerScreen() {

    return (
        <View style={styles.container}>
            <PlayController/>
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