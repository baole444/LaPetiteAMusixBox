import asyncQueueManager from "../async-queue-manager";
import { useState, useEffect } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import requestLPAMB from "../axios/wrapperAxios";
import { File, Paths } from 'expo-file-system/next';

/**
 * The queue logic of the app.
 * Using expo-av.
 * @deprecated superceeded by useMusicEngine.
 * 
 * @since 0.0.5 Last update for this function. 
 */
const musicPlayerHook = () => {
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

            const track = await asyncQueueManager.seekQueue(0);
            if (!track.trackId) {
                return;
            }
            
            if (track.trackId) {
                if (track.trackId !== instTrackID) {
                    setInstTrackID(track.trackId);
                    setIsIdReady(true);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isLoading, instTrackID]);
    
    // Loading track
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
            return;
        }

        setIsHandling(true);
        setIsLoading(true);

        const { success, newSound } = await loadTrack(instTrackID, setInstTrackID, sound, setSound);

        if (success) {
            await getTrackData(instTrackID, setTrackName);

            console.log('Track loaded successfully.');
            setSound(newSound);

            newSound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish && instTrackID) {
                    let id;
                    const nextTrack = await asyncQueueManager.seekQueue(1);
                    console.log('Next track fetched');
                    if (!nextTrack) {
                        console.log('Queue ended.');
                        id = '';
                    } else {
                        id = nextTrack.trackId;
                    }
                    console.log('Track ended.');
                    if (!status.isLooping) {
                        if (id === instTrackID) {
                            console.log('Same track, reset progress.');
                            sound.setPositionAsync(0);
                            await asyncQueueManager.upNext();
                            console.log('Pushed queue up');
                        } else {
                            setTrackName(null);
                            setInstTrackID(null);
                            console.log('Done clean up.');
                            await asyncQueueManager.upNext();
                            console.log('Pushed queue up');
                        }
                    }
                }
            });

        } else {
            console.warn('Failed to load the track. TrackID:', instTrackID);
            setIsHandling(false);
        }
        setIsIdReady(false);
        setIsLoading(false);
        setIsHandling(false);
    }

    useEffect(() => {
        if (sound) {
            const timer = setInterval(() => {
                sound.getStatusAsync().then((stats) => {
                    if (stats.isLoaded) {
                        setProgress(stats.positionMillis / stats.durationMillis);
                        setDuration(stats.durationMillis);
                    }

                    if (stats.positionMillis >= stats.durationMillis && instTrackID) {
                        setProgress(0);
                        setDuration(0);
                        clearInterval(timer);
                    }
                })
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [sound, playing]);

    // Skipping state toggle
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

    // Track skipping toggle
    const trackSkipper = () => {
        if (sound) {
            if (looping) {
                setLooping(false);
            }
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

    useEffect(() => {
        if (!isHandling && instTrackID) {
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
                return { isSameFile: true, file: file };
            } else {
                return { isSameFile: false, file: file };
            }
        } else {
            return { isSameFile: false, file: file };
        }
    } catch (e) {
        return { isSameFile: false, file: null };
    }
}

const loadTrack = async (trackID, setInstTrackID, sound, setSound) => {
    if (!trackID) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        return { success: false , newSound: null };
    }
    try {
        const { isSameFile, file } = await checkFile(trackID);

        if (file == null) {
            return { success: false , newSound: null };
        }

        if (isSameFile == false) {
            const response = await requestLPAMB('post', '/api/music/play', {data: trackID});
            if (response) { 
                try {
                    file.create();
                    const responseArray = new Uint8Array(response);
                    
                    file.write(responseArray);
                } catch (e) {
                    console.log('Cached file already exist or no permission to write.');
                    return { success: false , newSound: null };
                }    
            } else {
                console.warn('Response empty!');
                return { success: false , newSound: null };
            }
        }
        const cachePath = file.uri;
        // Unload current sound if request to play another track
        if (sound) {
            await sound.unloadAsync();
            sound.setOnPlaybackStatusUpdate(null);
            setSound(null);
        }

        // Create new sound instance
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: cachePath },
            { shouldPlay: false }
        );
        setInstTrackID(trackID);

        return { success: true , newSound: newSound }
    } catch (e) {
        console.warn('Cannot load track with error: ', e);
        return { success: false , newSound: null };
    }
};

const getTrackData = async (id, setTrackName) => {
    if (!id) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        setTrackName('Failed to get title.')
    }
    try {
        const trackData = await asyncQueueManager.seekQueue(0);

        const title = trackData.title;

        setTrackName(title);

    } catch (e) {
        console.warn('Cannot get title: ', e.message);
        setTrackName('Failed to get title.')
    }
};

export default musicPlayerHook;

