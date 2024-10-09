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

export default {
    pushQueue,
    currentTrack,
    seekTrack,
    upNext,
    dumpQueueData,
    clearQueue,
    pushIp,
    seekIp,
    dumpIpData
};