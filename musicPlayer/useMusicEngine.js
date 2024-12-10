import asyncQueueManager from "../async-queue-manager";
import { useState, useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import requestLPAMB from "../axios/wrapperAxios";
//import * as WebAssembly from 'react-native-webassembly';
//import AB2Base64 from '../scr/wasm/pkg/arraybuffer_2_base64_bg.wasm';


const useMusicEngine = () => {
    // the main player and the only player/status tracker.
    // all logic should update these 2 hook.
    // DO NOT CALL IT IN A CONDITION
    const player = useAudioPlayer(null, 1000);
    const status = useAudioPlayerStatus(player);

    // Logic group
    const [source, setSource] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHandling, setIsHandling] = useState(false);
    const [isIdReady, setIsIdReady] = useState(false);
    const [instTrackID, setInstTrackID] = useState(null);

    // Interface and control group
    const [trackName, setTrackName] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [looping, setLooping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

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
                if (fetchedID !== instTrackID) {
                    setInstTrackID(fetchedID);
                    console.log(`Current track ID updated with ${fetchedID}`);
                    setIsIdReady(true);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isLoading, instTrackID]);


    // Play button effect, update on playing state, also allow auto play on next track.
    // TODO: need to trigger these on new track load
    useEffect(() => {
        if (player.isLoaded) {
            if (playing) {
                player.play();
            } else {
                player.pause();
            }
        }
    }, [playing]);

    useEffect(() => {
        if (player.isLoaded) {
            if (looping) {
                player.loop = true;
            } else {
                player.loop = false;
            }
        }
    }, [looping]);

    const trackSkipper = () => {
        if (player.duration > 0) {
            player.seekTo(player.duration);
            console.log('Skipping the track...');
        }
    }

    const trackHandler = async () => {
        await setAudioModeAsync({
            shouldPlayInBackground: true,
            interruptionMode: 'doNotMix',
        });

        console.log('Handling trackID: ', instTrackID);
        if (!instTrackID) {
            console.log("trackID is undefined. Aborting track load.");
            return;
        }

        setIsHandling(true);
        setIsLoading(true);
        
        console.log("Calling loadTrack with ID: ", instTrackID);

        const success = await loadTrack(instTrackID, setInstTrackID, setSource);
        await getTrackData(instTrackID, setTrackName);

        if (success) {
            console.log('Track loaded successfully.');
            player.replace(source);

            if (playing) {
                console.log('Starting playback...');
                player.play();
            }

            if (player.isLoaded) {
                setProgress(player.currentTime / player.duration);
                setDuration(player.duration);
            }

        } else {
            console.warn('Failed to load the track. TrackID:', instTrackID);
            setIsHandling(false);
        }
        console.log('Reseting flow control flags...');
        setIsIdReady(false);
        setIsLoading(false);
        setIsHandling(false);
    }


    useEffect(() => {
        if (!isHandling && instTrackID === null) {
            console.log('Checking if ID is ready... current state:', isIdReady);
            if (isIdReady) {
                trackHandler();
            }
        }
    }, [instTrackID, isIdReady]);


    useEffect(() => {
        if (player.isLoaded) {
            const intervalId = setInterval(() => {
            if (playing) {    
                if (player.isLoaded) {
                    setProgress(status.currentTime / status.duration);
                    setDuration(status.duration);
                }

            }
            }, 1000); // The lower delay, the smoother the progress bar will update, but will consume more resource.

            // Logic function when a song ended
            const trackEndLogic = async () => {
                const nextTrackLookUp = await asyncQueueManager.seekTrack(1);
                if (player.currentTime >= player.duration && instTrackID) {
                    if(player.loop == false) {
                        console.log('Track finished playing.');
                        setProgress(0);
                        setDuration(0);
                        if (nextTrackLookUp === instTrackID) {
                            console.log('Next track contained same ID, rewinding and skip loading...')
                            player.seekTo(0);
                            await asyncQueueManager.upNext();
                            console.log('Queue was pushed up.');
                        } else {
                            await asyncQueueManager.upNext();
                            console.log('Queue was pushed up.');
        
                            clearInterval(intervalId);        
                            setInstTrackID(null);
                        }
                    }
                }
            }

            const endLogicInterval = setInterval(() => {
                if (playing && player.currentTime >= PlayerScreen.duration) {
                    trackEndLogic();
                }
            }, 1000);
            
            // clear interval when this is demounted
            return () => {
                  clearInterval(intervalId);
                  clearInterval(endLogicInterval);
            } 
        }
      }, [player, playing]);
    
    const progressBar = async (value) => {
        if (sound && duration > 0) {
            const instPos = value * duration;
            await sound.setPositionAsync(instPos);
        }
    };


    useEffect(() => {
        return () => {
            if (player) {
                player.remove();
                setSource(null);
            }
        }
    }, [player]);

    return { playing, setPlaying, looping, setLooping, trackSkipper, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, instTrackID, trackName };

}

//async function arrayBufferToBase64(arrayBuffer) {
//    const wasmModule = await WebAssembly.instantiate<{
//        encode2base64: (buffer) => string
//    }>(AB2Base64);
//
//    const array = new Uint8Array(arrayBuffer);
//
//    const out = wasmModule.exports.encode2base64(array);
//
//    return out;
//}

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary)
};

const loadTrack = async (trackID, setInstTrackID, setSource) => {
    if (!trackID) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        return false;
    }
    try {
        const response = await requestLPAMB('post', '/api/music/play', {data: trackID});
        if (response) {
            const base64String = arrayBufferToBase64(response);
            const trackUrl = `data:audio/mpeg;base64,${base64String}`;
            
            setSource(trackUrl);

            // Create new sound instance
            setInstTrackID(trackID);
 
            return true;

        } else {
            console.warn('Response empty!');
            return false;
        }
    } catch (e) {
        console.warn('Cannot load track with error: ', e.message);
        return false;
    }
};

const getTrackData = async (id, setTrackName) => {
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

export default useMusicEngine;