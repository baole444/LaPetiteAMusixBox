import { View, StyleSheet } from 'react-native';
import PlayController from '../musicPlayer/playerController';

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
      alignItems: 'center'
    }
});

export default PlayerScreen;