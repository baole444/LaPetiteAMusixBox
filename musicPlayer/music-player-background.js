import React, { useState, useEffect, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import BackgroundActions from 'react-native-background-actions';
import asyncQueueManager from "../async-queue-manager";
import requestLPAMB from "../axios/wrapperAxios";
import { AppState } from 'react-native';

// This is an effort to refactor music-player logic side to background service run as foreground service

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const backgroundPlayerHook = () => {
    const [sound, setSound] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [instTrackID, setInstTrackID] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHandling, setIsHandling] = useState(false);
    const [currentTrackID, setCurrentTrackID] = useState(null);
    const [isIdReady, setIsIdReady] = useState(false);
    const [trackName, setTrackName] = useState(null);
    const [looping, setLooping] = useState(false);
    const [isOn, setIsOn] = useState('Not activated.');
    const appState = useRef(AppState.currentState);
    const [loadState, setLoadState] = useState(false);

    const currentIDRef = useRef(currentTrackID);
    const isIdReadyRef = useRef(isIdReady);
    const isHandlingRef = useRef(isHandling);
    const soundRef = useRef(sound);

    useEffect(() => {
        currentIDRef.current = currentTrackID;
        isIdReadyRef.current = isIdReady;
        isHandlingRef.current = isHandling;
        soundRef.current = sound;
    }, [currentTrackID, isIdReady, isHandling, sound])

    const musicPlayerManager = async () => {
        while (BackgroundActions.isRunning()) {
            setIsOn("Task is executing...");
            if (!isHandlingRef.current) {
                const fetchedID = await asyncQueueManager.currentTrack();
                if (fetchedID && fetchedID !== currentIDRef.current) {
                    setCurrentTrackID(fetchedID);
                    setIsIdReady(true);
                }
            }

            // Fetch the next track
            if (!isHandlingRef.current) {
                if(currentIDRef.current && instTrackID === null) {
                    if (isIdReadyRef.current) {
                        await trackHandler(currentIDRef.current);
                    }
                }

            }            

            if (sound) {
                if (playing) {
                    sound.playAsync();
                } else if(!playing) {
                    sound.pauseAsync();
                }
                if (looping) {
                    sound.setIsLoopingAsync(true);
                } else if (!looping) {
                    sound.setIsLoopingAsync(false);
                }
            }

            if (sound) {
                if (playing) {
                    sound.getStatusAsync().then((status) => {
                        if (status.isLoaded) {
                            setProgress(status.positionMillis / status.durationMillis);
                            setDuration(status.durationMillis);
                            //console.log(`Progress: ${status.positionMillis}`);
                        }
                    });
                }

                sound.setOnPlaybackStatusUpdate(async (status) => {
                    const nextTrackLookUp = await asyncQueueManager.seekTrack(1);
                    if (status.positionMillis >= status.durationMillis && instTrackID) {
                        if(!status.isLooping) {
                            console.log('Track finished playing.');
                            setProgress(0);
                            if (nextTrackLookUp === currentIDRef.current) {
                                console.log('Next track contained same ID, rewinding and skip loading...')
                                sound.setPositionAsync(0);
                                await asyncQueueManager.upNext();
                                console.log('Queue was pushed up.');
                            } else {
                                await asyncQueueManager.upNext();
                                console.log('Queue was pushed up.');            
                                setInstTrackID(null);
                            }
                        }
                    }
                })
            }

            await sleep(1000); // Update
        }
    };
    const trackSkipper = () => {
        if (sound) {
            sound.setPositionAsync(duration);
            console.log('Skipping the track...');
        }
    }

    const progressBar = async (value) => {
        if (sound && duration > 0) {
            const instPos = value * duration;
            await sound.setPositionAsync(instPos);
        }
    };

    const starMusicPlayerManager = async () => {
        setIsOn('Background task loaded.');
        const options = {
            taskName: 'lpamb_background_music_queue_manager',
            taskTitle: 'La Petite A Musix Box',
            taskDesc: 'Your musix enqueuing...',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            parameters: {
                delay: 1000,
            },
        };

        try {
            await BackgroundActions.start(musicPlayerManager, options);
            console.log('Background task started');
        } catch (e) {
            console.log('Failed to start background task:', e);
        }
    };

    const stopMusicPlayerManager = async () => {
        try {
            await BackgroundActions.stop();
            console.log('Background task stopped');
            setIsOn('Background task stopped');
        } catch (e) {
            console.log('Failed to stop background task:', e);
        }
    };

    // Handle the track ID, call name fetch and fetch song
    const trackHandler = async (id) => {

        console.log('Handling trackID: ', id); // Log to verify trackID passed in
        if (!id) {
            console.log("trackID is undefined. Aborting track load.");
            return;
        }

        setIsHandling(true);
        setIsLoading(true);
        
        console.log("Calling loadTrack with ID: ", id);

        const { newTrack, trackId: loadedID } = await loadTrack(id, setInstTrackID, sound, setSound);
        await loadName(id, setTrackName);
        if (newTrack) {
            console.log('Track loaded successfully.');
            setSound(newTrack);
            if (sound) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                    playThroughEarpieceAndroid: false,
                    shouldDuckAndroid: false,
                    staysActiveInBackground: true,
                })
            }

            if (playing) {
                console.log('Starting playback...');
                newTrack.playAsync();
            }

            newTrack.setOnPlaybackStatusUpdate(async (status) => {
                if(status.isLoaded) {
                    setProgress(status.positionMillis / status.durationMillis);
                    setDuration(status.durationMillis);
                }
            });
        } else {
            console.warn('Failed to load the track. TrackID:', id);
            setIsHandling(false);
        }
        console.log('Reseting flow control flags...');
        setIsIdReady(false);
        setIsLoading(false);
        setIsHandling(false);
    }

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
                setSound(null);
            }
        };
    }, [sound]);

    useEffect(() => {
        const event = AppState.addEventListener('change', (nexAppState) => {

            if (nexAppState === 'active' && !loadState) {
                setIsOn('Background task condition triggered.');
                starMusicPlayerManager();
                setLoadState(true);
            }
        });

        return () => {
            console.log('Queuing task ended.');
            stopMusicPlayerManager();
            event.remove();
            setLoadState(false);
        }
    }, []);

    return { playing, setPlaying, looping, setLooping, trackSkipper, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, currentTrackID, instTrackID, trackName, isOn };
};

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const loadTrack = async (trackID, setInstTrackID, sound, setSound) => {
    if (!trackID) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        return { newTrack: null, trackId: null };
    }
    try {
        const response = await requestLPAMB('post', '/api/music/play', {data: trackID});
        if (response) {
            const base64String = arrayBufferToBase64(response);
            const trackUrl = `data:audio/mpeg;base64,${base64String}`;

            // Unload current sound if request to play another track
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            // Create new sound instance
            const { sound: newTrack } = await Audio.Sound.createAsync(
                { uri: trackUrl },
                { shouldPlay: false }
            );
            setInstTrackID(trackID);
 
            //console.log('New track generated: ', newTrack);
            return { newTrack, trackId: trackID }

        } else {
            console.warn('Response empty!');
            return { newTrack: null, trackId: null };
        }
    } catch (e) {
        console.warn('Cannot load track with error: ', e.message);
        return { newTrack: null, trackId: null };
    }
};

const loadName = async (id, setTrackName) => {
    if (!id) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        setTrackName('Error: Failed to query for title')
    }
    try {
        const response = await requestLPAMB('post', '/api/music/title', {data: id});
        if (response) {
            console.log(`Title is: ${response}`)
            setTrackName(response);
        } else {
            console.warn('Response empty!');
            setTrackName('Error: Failed to query for title')
        }

    } catch (e) {
        console.warn('Cannot get title: ', e.message);
        setTrackName('Error: Failed to query for title')
    }
};
