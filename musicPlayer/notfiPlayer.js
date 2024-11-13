import * as Notifications from 'expo-notifications'
import { useState, useEffect } from 'react';

const NotifiPlayer = (playing, setPlaying, looping, setLooping, trackSkipper, trackName) => {

    const setNotifiCat= async() => {
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
    }
    
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

    const notifiListener = async() => {
        Notifications.addNotificationResponseReceivedListener(response => {
            const action = response.actionIdentifier;
            console.log('setting listener...');
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
    } 

    useEffect(() => {
        setNotifiCat();
        notifiListener();        
    }, [playing, looping])

    return { makeNotifiPlayer, endNotifiPlayer };
}

export default NotifiPlayer;