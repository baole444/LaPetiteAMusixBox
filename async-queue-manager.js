import AsyncStorage from "@react-native-async-storage/async-storage";

const pushQueue = async (trackInfo) => {
    const queue = await readQueue();

    queue.push(trackInfo);

    await AsyncStorage.setItem('queue', JSON.stringify(queue)); 
}

const readQueue = async () => {
    const queue = await AsyncStorage.getItem('queue');
    return queue ? JSON.parse(queue) : [];
}

const readIp = async () => {
    const queue = await AsyncStorage.getItem('serverIp');
    return queue ? JSON.parse(queue) : [];
}

const seekQueue = async (position) => {
    const queue = await readQueue();
    if (queue.length > 0) {
        const result = queue[position];

        if (!result) {
            return null;
        }

        return result;
    }
    return null;
}

const upNext = async () => {
    const queue = await readQueue();
    if (queue.length > 0) {
        queue.splice(0, 1);
        await AsyncStorage.setItem('queue', JSON.stringify(queue));
    }
}

const dumpQueueData = async () => {
    try {
        const jsonValue = await readQueue();
        if (jsonValue != null) {
            const queueData = JSON.parse(jsonValue);
            console.log('Queue Data:', queueData);
        } else {
            console.log('No queue data found.');
        }
    } catch (e) {
        console.error('Error retrieving queue data:', e); 
    }
}

const clearQueue = async () => {
    try {
        await AsyncStorage.removeItem('queue');
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
    seekQueue,
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