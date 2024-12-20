import { StyleSheet } from "react-native";
import colors from './colors';

/**
 * Styles that reappeared multiple time.
 */
const sharedStyle = StyleSheet.create({
    card_title: {
        textAlign: 'center',
        fontSize: 16,
        padding: 4,
        color: '#3f2b77',
        fontWeight: 'bold',
    },    
    card_text: {
        textAlign: 'center',
        fontSize: 12,
        padding: 4,
        fontWeight: '400',
        color: '#5b6ee1',
    },
    card_sub_title: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        padding: 4,
    },
    card_sub_container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    container_account: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        padding: 20,
    },
    subtitle_account: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
    },
    title_account: {
        textAlign: 'center',
        fontSize: 32,
        margin: 10,
        fontWeight: 'bold',
    },
    helper_text: {
        textAlign: 'left',
        fontSize: 18,
        marginTop: 5,
    },
    input_account: {
        backgroundColor: '#fff',
        width: 250,
        backgroundColor: 'white',
        height: 40,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
});

/**
 * Pressable universal style.
 */
const sharedPresstable = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: colors.primary,
        borderCurve: 'circular',
        marginBottom: 20,
    },
    button_text: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
        color: '#222034',
    },
    presstable_sub_container: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-evenly'
    },
    button_account: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: colors.primary,
        width: 200,
        borderCurve: 'circular',
        marginBottom: 20,
    },
    text_account: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'bold',
    },
})

/**
 * Style specific to home screen.
 */
const homescrStyle = StyleSheet.create({
    search_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
    },
    search_input: {
        flex: 1,
        width: '95%',
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 40,
        backgroundColor: '#f5f5f5',
    },
    genre_container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    genre_button: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
    },
    genre_text: {
        fontSize: 14,
        color: '#fff',
    },
    card_container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    card: {
        width: '86%',
        backgroundColor: colors.yellow,
        borderRadius: 10,
        marginBottom: 15,
    },
});

/**
 * Style specific to library screen.
 */
const libraryStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    no_track_text: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        backgroundColor: colors.yellow,
        borderRadius: 10,
        marginBottom: 15,
    },
    song_container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.yellow,
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        width: '90%',
        height: 100,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 20,
    },
    song_image: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    song_info: {
        flexDirection: 'column',
    },
    song_title: {
      fontSize: 16,
        fontWeight: 'bold',
    },
    song_artist: {
        fontSize: 14,
        color: '#6D6D6D',
    },
});

/**
 * Style specific to now playing screen.
 */
const nowPlayingStyle = StyleSheet.create({
    next_song_title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    next_song_container: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },
    song_card: {
        width: 120,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#FBCB3C',
        borderRadius: 10,
        alignItems: 'center',
    },
    song_card_title: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    song_card_artist: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'center',
    },
});

/**
 * Style specific to welcome screen
 */
const welcome = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        marginBottom: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        width: 200,
        alignItems: 'center',
    },
    button_text: {
        fontSize: 16,
        color: 'black',
    },
});

const devip = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        width: "350",
        backgroundColor: 'white',
        height: 40,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
})

export default {
    sharedStyle,
    sharedPresstable,
    homescrStyle,
    libraryStyle,
    nowPlayingStyle,
    welcome,
    devip,
}