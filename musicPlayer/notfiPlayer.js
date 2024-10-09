import * as Notifications from 'expo-notifications'
import { AppState } from "react-native";

const NotifiPlayer = async (playing, setPlaying, looping, setLooping, trackSkipper, trackName) => {

    
    await Notifications.setNotificationCategoryAsync('music-control', [
        {
            identifier: 'loop', 
            buttonTitle: looping ? "Stop loop" : "Loop",
            options: {isDestructive: false, isAuthenticationRequired: false},
        },
        {
            identifier: 'play',
            buttonTitle: playing ? "Pause" : "Play",
            options: {isDestructive: false, isAuthenticationRequired: false},
        },
        {
            identifier: 'skip',
            buttonTitle: 'Skip',
            options: {isDestructive: false, isAuthenticationRequired: false},
        },
    ]);

    const makeNotifiPlayer = async () => {
        const schedulResult = await Notifications.scheduleNotificationAsync({
            content: {
                title: playing ? "Playing Music" : "Pause",
                body: `Current song: ${trackName}`,
                data: { action: "none"},
                categoryIdentifier: 'music-control',
            },
            trigger: null,
        });
        console.log('Notification scheduled: ', schedulResult);
    }

    const endNotifiPlayer = async () => {
        await Notifications.dismissAllNotificationsAsync();
    }

    AppState.addEventListener('change', (nextAppState) => {
        console.log('App state changed to:', nextAppState);
        if (nextAppState === 'active' || nextAppState === 'background') {
            makeNotifiPlayer();
        } else if (nextAppState === 'inactive') {
            endNotifiPlayer();
        }
    });

    Notifications.addNotificationResponseReceivedListener(response => {
        const action = response.actionIdentifier;

        switch (action) {
            case 'play':
                setPlaying(!playing);
                break;
            case 'loop':
                setLooping(!looping);
                break;
            case 'skip':
                trackSkipper();
                break;
            default:
                break;
        }
    });

    await makeNotifiPlayer();
}

export default NotifiPlayer;