import asyncQueueManager from "../async-queue-manager";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

const musicPlayerHook = () => {
    const [sound, setSound] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [instTrackID, setInstTrackID] = useState(null);
    const [timer, setTimer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHandling, setIsHandling] = useState(false);
    const [currentTrackID, setCurrentTrackID] = useState(null);
    const [isIdReady, setIsIdReady] = useState(false);
    const [trackName, setTrackName] = useState(null);
    const [looping, setLooping] = useState(false);
    
    // Fetching track ID from queue
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isHandling) {
                return;
            }

            const fetchedID= await asyncQueueManager.currentTrack();
            if (!fetchedID) {
                //console.warn("Fetched an empty or null entry.");
                return;
            }
            
            if (fetchedID) {
                if (fetchedID !== currentTrackID) {
                    setCurrentTrackID(fetchedID);
                    console.log(`Current track ID updated with ${fetchedID}`);
                    setIsIdReady(true);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentTrackID, isLoading, instTrackID]);
    

    useEffect(() => {
        if (sound) {
            if (looping) {
                sound.setIsLoopingAsync(true);
            } else {
                sound.setIsLoopingAsync(false);
            }
        }
    }, [looping, sound]);

    // Playing state toggle
    useEffect(() => {
        if (sound) {
            if (playing) {
                sound.playAsync();
            } else {
                sound.pauseAsync();
            }
        }
    }, [playing, sound]);

    const trackSkipper = () => {
        if (sound) {
            sound.setPositionAsync(duration);
            console.log('Skipping the track...');
        }
    }
    
    const trackHandler = async () => {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            playThroughEarpieceAndroid: false,
        });

        console.log('Handling trackID: ',currentTrackID); // Log to verify trackID passed in
        if (!currentTrackID) {
            console.log("trackID is undefined. Aborting track load.");
            return;
        }

        setIsHandling(true);
        setIsLoading(true);
        
        console.log("Calling loadTrack with ID: ", currentTrackID);

        const { newTrack, trackId: loadedID } = await loadTrack(currentTrackID, setInstTrackID, sound, setSound);
        await loadName(currentTrackID, setTrackName);
        if (newTrack) {
            console.log('Track loaded successfully.');
            setSound(newTrack);


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
            console.warn('Failed to load the track. TrackID:', currentTrackID);
            setIsHandling(false);
        }
        console.log('Reseting flow control flags...');
        setIsIdReady(false);
        setIsLoading(false);
        setIsHandling(false);
    }

    useEffect(() => {
        if (sound) {
            const intervalId = setInterval(() => {
            if (playing) {
                sound.getStatusAsync().then((status) => {
                    if (status.isLoaded) {
                        setProgress(status.positionMillis / status.durationMillis);
                        setDuration(status.durationMillis);
                        //console.log(`Progress: ${status.positionMillis}`);
                    }
                });
            }
            }, 1000); // Adjust the interval as needed

            sound.setOnPlaybackStatusUpdate(async (status) => {
                const nextTrackLookUp = await asyncQueueManager.seekTrack(1);
                if (status.positionMillis >= status.durationMillis && instTrackID) {
                    if(!status.isLooping) {
                        console.log('Track finished playing.');
                        setProgress(0);
                        if (nextTrackLookUp === currentTrackID) {
                            console.log('Next track contained same ID, rewinding and skip loading...')
                            sound.setPositionAsync(0);
                            await asyncQueueManager.upNext();
                            console.log('Queue was pushed up.');
                        } else {
                            await asyncQueueManager.upNext();
                            console.log('Queue was pushed up.');
        
                            clearInterval(timer);
                            clearInterval(intervalId);
        
                            setInstTrackID(null);
                        }
                    }
                }
            })
 
          return () => clearInterval(intervalId);
        }
      }, [sound, playing]);
    
    const progressBar = async (value) => {
        if (sound && duration > 0) {
            const instPos = value * duration;
            await sound.setPositionAsync(instPos);
        }
    };


    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
                setSound(null);
            }
            clearInterval(timer);
        }
    }, [sound])

    return { playing, setPlaying, looping, setLooping, trackSkipper, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, currentTrackID, instTrackID, trackName };
}


const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary); // Note: In React Native, use a different approach to encode if necessary.
};

const loadTrack = async (trackID, setInstTrackID, sound, setSound) => {
    if (!trackID) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        return { newTrack: null, trackId: null };
    }
    try {
        const ip = await asyncQueueManager.seekIp();
        if (ip) {
            const response = await axios.post(ip + '/api/response/play', {data: trackID}, {responseType: 'arraybuffer'});
            if (response && response.data) {
                const base64String = arrayBufferToBase64(response.data);
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
        const ip = await asyncQueueManager.seekIp();
        if (ip) {
            const response = await axios.post(ip + '/api/response/title', {data: id});
            
            if (response && response.data) {
                console.log(`Title is: ${response.data}`)
                setTrackName(response.data);
            } else {
                console.warn('Response empty!');
                setTrackName('Error: Failed to query for title')
            }
        }

    } catch (e) {
        console.warn('Cannot get title: ', e.message);
        setTrackName('Error: Failed to query for title')
    }
};

export default musicPlayerHook;

