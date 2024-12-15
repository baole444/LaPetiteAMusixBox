import asyncQueueManager from "../async-queue-manager";
import { useState, useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import requestLPAMB from "../axios/wrapperAxios";
import { File, Paths } from 'expo-file-system/next';

// Current goal: load a track successfully with expo-audio
const useMusicEngine = () => {
    // the main player and the only player/status tracker.
    // all logic should update these 2 hook.
    // DO NOT CALL IT IN A CONDITION
    const player = useAudioPlayer('', 1000);
    const status = useAudioPlayerStatus(player);

    // Logic group
    const [isLoading, setIsLoading] = useState(false);
    const [isHandling, setIsHandling] = useState(false);
    const [isIdReady, setIsIdReady] = useState(false);
    const [instTrackID, setInstTrackID] = useState(null);

    // Interface and control group
    const [trackName, setTrackName] = useState('');
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
        if (player) {
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

        console.log('Handling trackID: ', instTrackID);
        if (!instTrackID) {
            console.log("trackID is undefined. Aborting track load.");
            return;
        }

        setIsHandling(true);
        setIsLoading(true);
        
        console.log("Calling getSource with ID: ", instTrackID);
        
        // No await and success / source will be undefine.
        const { success, source } = await getSource(instTrackID, setInstTrackID);

        if (success) {
            console.log('Source obtained successfully.');

            const audioSource = { uri: source };
            console.log(`Source: ${source}`);
            // TODO: refactor this to return full track detail, update it for the now playing screen, this will reduce the amount of request made
            await getTrackData(instTrackID, setTrackName);
            console.log(`Proceeding to load player...`);

            player.replace(audioSource);

            if (playing && player.paused) {
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
        if (!isHandling && instTrackID) {
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
                    setProgress(player.currentTime / player.duration);
                    setDuration(player.duration);
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
                        setTrackName(null);
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
    
    const progressBar = (value) => {
        if (player.isLoaded && duration > 0) {
            const instPos = value * duration;
            player.seekTo(instPos);
        }
    };

    return { playing, setPlaying, looping, setLooping, trackSkipper, trackHandler, progress, progressBar, duration, isHandling, isLoading, isIdReady, instTrackID, trackName };
}

/**
 * Fetch music and store to cache.
 * 
 * @param {string} trackID track's id
 * @param {*} setInstTrackID setter for the current track'id (instant's track.)
 * @returns {[boolean, string]} Success state | Link to cached track.
 */
const getSource = async (trackID, setInstTrackID) => {
    if (!trackID) {
        console.log(`Post request received ${trackID === null ? 'null' : 'undefined'} ID, returning...`);
        return { success: false, source: '' }
    }
    try {
        // Note to self: make sure to also maintain the wrapper's interceptor to intercept the correct route.
        const response = await requestLPAMB('post', '/api/music/play', {data: trackID});
        if (response) {
            
            const fileName = `${trackID}.mp3`;

            const file = new File(Paths.cache, fileName);

            try {
                file.create();
                const responseArray = new Uint8Array(response);
                
                file.write(responseArray);
            } catch {
                console.log('Cached file already exist or no permission to write.');
            }
            const md5 = file.md5;

            console.log(`MD5 was: ${md5}`);

            const cachePath = file.uri;

            //player.replace(response); // cannot access on different thread

            // Set the instance's track ID
            setInstTrackID(trackID);
 
            return { success: true, source: cachePath }
        } else {
            console.warn('Response empty!');
            return { success: false, source: '' }
        }
    } catch (e) {
        console.warn('Cannot load track with error: ', e.message);
        return { success: false, source: '' }
    }
};


// TODO: refactor to get full track info, store that in queue to fetch locally.
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