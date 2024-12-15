import asyncQueueManager from "../async-queue-manager";
import { useState, useEffect } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import requestLPAMB from "../axios/wrapperAxios";
import { File, Paths } from 'expo-file-system/next';

async function pushQueue() {
    await asyncQueueManager.upNext();
    console.log('Queue was pushed up.');
}

/**
 * The queue logic of the app.
 * Using expo-av.
 * @deprecated superceeded by useMusicEngine.
 * 
 * @since 0.0.5 Last update for this function. 
 */
const musicPlayerHook = () => {
    const [requestSkipLoop, setRequestSkipLoop] = useState(false);
    const [sound, setSound] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trackName, setTrackName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHandling, setIsHandling] = useState(false);
    const [isIdReady, setIsIdReady] = useState(false);
    const [instTrackID, setInstTrackID] = useState(null);
    const [looping, setLooping] = useState(false);

    // Fetching track ID from queue
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isHandling) {
                return;
            }

            const fetchedID= await asyncQueueManager.currentTrack();
            if (!fetchedID) {
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
    

    useEffect(() => {
        if (sound) {
            if (requestSkipLoop == false) {
                if (looping) {
                    sound.setIsLoopingAsync(true);
                } else {
                    sound.setIsLoopingAsync(false);
                }
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
            if (looping) {
                setRequestSkipLoop(true);
            }
            sound.setPositionAsync(duration);
            console.log('Skipping the track...');
        }
    }
    
    const trackHandler = async () => {

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playThroughEarpieceAndroid: false,
            shouldDuckAndroid: false,
            staysActiveInBackground: true,
        })


        console.log('Handling trackID: ', instTrackID);
        if (!instTrackID) {
            console.log("trackID is undefined. Aborting track load.");
            return;
        }

        setIsHandling(true);
        setIsLoading(true);
        
        console.log("Calling loadTrack with ID: ", instTrackID);

        const { success, newSound } = await loadTrack(instTrackID, setInstTrackID, sound, setSound);

        if (success) {
            await loadName(instTrackID, setTrackName);

            console.log('Track loaded successfully.');
            setSound(newSound);

            if (playing) {
                console.log('Starting playback...');
                newSound.playAsync();
            }

            newSound.setOnPlaybackStatusUpdate(async (status) => {
                if(status.isLoaded) {
                    setProgress(status.positionMillis / status.durationMillis);
                    setDuration(status.durationMillis);
                }
            });
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
        if (sound) {
            const intervalId = setInterval(() => {
            if (playing) {
                sound.getStatusAsync().then((status) => {
                    if (status.isLoaded) {
                        setProgress(status.positionMillis / status.durationMillis);
                        setDuration(status.durationMillis);
                        
                    }
                });
            }
            }, 1000);

            sound.setOnPlaybackStatusUpdate(async (status) => {
                const nextTrackLookUp = await asyncQueueManager.seekTrack(1);
                if (status.positionMillis >= status.durationMillis && instTrackID) {
                    if(!status.isLooping) {
                        console.log('Track finished playing.');
                        setProgress(0);
                        setDuration(0);
                        setTrackName(null);
                        if (nextTrackLookUp === instTrackID) {
                            console.log('Next track contained same ID, rewinding and skip loading...')
                            sound.setPositionAsync(0);
                            await pushQueue();
                        } else {
                            await pushQueue();
        
                            clearInterval(intervalId);
                            setInstTrackID(null);
                        }
                    } else if (status.isLooping && requestSkipLoop == true) {
                        console.log(`Skipping current track and loop next track.`);
                        if (nextTrackLookUp === instTrackID) {
                            console.log('Next track contained same ID, skip loading...');
                            await pushQueue();
                        } else {
                            sound.setIsLoopingAsync(false);
                            setSound(null);
                            setProgress(0);
                            setDuration(0);
                            setTrackName(null);
                            
                            await pushQueue();

                            clearInterval(intervalId);
                            setInstTrackID(null);

                            setRequestSkipLoop(false);
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
        if (!isHandling && instTrackID) {
            console.log('Checking if ID is ready... current state:', isIdReady);
            if (isIdReady) {
                trackHandler();
            }
        }
    }, [instTrackID, isIdReady]);


    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
                setSound(null);
            }
        }
    }, [sound])

    return { playing, setPlaying, looping, setLooping, trackSkipper, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, instTrackID, trackName };
}


const checkFile = async (trackID) => {
    try {
        const fileName = `${trackID}.mp3`;
        const file = new File(Paths.cache, fileName);

        if (file.exists) {
            const md5 = file.md5;

            const data = {trackID, md5};

            const response = await requestLPAMB('post', '/api/music/check', { data: data });
            if (response.isMatch = true) {
                return { isSameFile: false, file: file};
            }

        }
    } catch (e) {

    }
}


const loadTrack = async (trackID, setInstTrackID, sound, setSound) => {
    if (!trackID) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        return { success: false , newSound: null };
    }
    try {

        const { isSameFile, file } = await checkFile(trackID);

        const response = await requestLPAMB('post', '/api/music/play', {data: trackID});
        if (response) {



            try {
                file.create();
                const responseArray = new Uint8Array(response);
                
                file.write(responseArray);
            } catch {
                console.log('Cached file already exist or no permission to write.');
            }

            const cachePath = file.uri;
            // Unload current sound if request to play another track
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            // Create new sound instance
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: cachePath },
                { shouldPlay: false }
            );
            setInstTrackID(trackID);
 
            return { success: true , newSound: newSound }

        } else {
            console.warn('Response empty!');
            return { success: false , newSound: null };
        }
    } catch (e) {
        console.warn('Cannot load track with error: ', e.message);
        return { success: false , newSound: null };
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

export default musicPlayerHook;

