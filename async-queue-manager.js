import AsyncStorage from "@react-native-async-storage/async-storage";

const pushQueue = async (track_id) => {
    const queue = await AsyncStorage.getItem('playerQueue');
    const update = queue ? [...JSON.parse(queue), track_id] : [track_id];
    await AsyncStorage.setItem('playerQueue', JSON.stringify(update)); 
};

const readQueue = async () => {
    const queue = await AsyncStorage.getItem('playerQueue');
    return queue ? JSON.parse(queue) : [];
};

const readIp = async () => {
    const queue = await AsyncStorage.getItem('serverIp');
    return queue ? JSON.parse(queue) : [];
};

const currentTrack = async () => {
    const queue = await readQueue ();
    if (queue.length > 0) {
        const next = queue[0];
        return next;
    }
    return null;
}

const seekTrack = async (position) => {
    const queue = await readQueue();
    if (queue.length > 0) {
        const result = queue[position];
        return result;
    }
    return null;
}
const upNext = async () => {
    const queue = await readQueue();
    if (queue.length > 0) {
        const nextQueue = queue.slice(1);
        await AsyncStorage.setItem('playerQueue', JSON.stringify(nextQueue));
    }
};

const dumpQueueData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('playerQueue'); // Retrieve the stored queue data
        if (jsonValue != null) {
            const queueData = JSON.parse(jsonValue); // Parse the JSON string back to an array
            console.log('Queue Data:', queueData); // Log the queue data
        } else {
            console.log('No queue data found.'); // Log if no data is found
        }
    } catch (e) {
        console.error('Error retrieving queue data:', e); // Handle errors
    }
};

const clearQueue = async () => {
    try {
        await AsyncStorage.removeItem('playerQueue');
        console.log('Queue cleared successfully!');
    } catch (error) {
        console.error('Error clearing the queue:', error);
    }
};

const pushIp = async (ip) => {
    try {
        await AsyncStorage.removeItem('serverIp');
        console.log('Cleared IP data...');

        await AsyncStorage.setItem('serverIp', JSON.stringify([ip])); 
    } catch (error) {
        console.log('Error clearing ip:', error.message);
    }

};

const seekIp = async () => {
    const ip = await readIp();
    if (ip.length > 0) {
        const result = ip[0];
        return result;
    }
    return null;
}

const dumpIpData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('serverIp'); // Retrieve the stored queue data
        if (jsonValue != null) {
            const queueData = JSON.parse(jsonValue); // Parse the JSON string back to an array
            console.log('Ip Data:', queueData); // Log the queue data
        } else {
            console.log('No Ip found.'); // Log if no data is found
        }
    } catch (e) {
        console.error('Error retrieving Ip data:', e.message); // Handle errors
    }
};

const readPlaylist = async () => {
    const playlist = await AsyncStorage.getItem('playlist');
    return playlist ? JSON.parse(playlist) : [];
};

const pushPlaylist = async (trackInfo) => {
    try {
        const playlist = await readPlaylist();

        const index = playlist.findIndex((item) => item.trackId === trackInfo.trackId);
    
        if (index !== -1) {
            const existedTrack = playlist[index];
            const isSimilar = JSON.stringify(existedTrack) === JSON.stringify(trackInfo);
        
            if (isSimilar) {
                console.log('Skipping existed track in database.');
                return;
            } else {
                playlist[index] = trackInfo;
                console.log('Updating existing track info.');
            } 
        } else {
            playlist.push(trackInfo);
            console.log('Track added to playlist');
        }

        await AsyncStorage.setItem('playlist', JSON.stringify(playlist));
    } catch (e) {
        console.error("Encountered problem(s) while saving playlist: ", e.message);
    }
};

const deletePlaylistItem = async (trackId) => {
    try {
        const playlist = await readPlaylist();
    
        const newPlaylist = playlist.filter((item) => item.trackId !== trackId);
    
        await AsyncStorage.setItem('playlist', JSON.stringify(newPlaylist));

        return await readPlaylist();
    } catch (e) {
        console.error("Encountered problem(s) while removing item from playlist: ", e.message);
        return await readPlaylist();
    }
};


export default {
    readQueue,
    pushQueue,
    currentTrack,
    seekTrack,
    upNext,
    dumpQueueData,
    clearQueue,
    pushIp,
    seekIp,
    dumpIpData,
    readPlaylist,
    pushPlaylist,
    deletePlaylistItem
};