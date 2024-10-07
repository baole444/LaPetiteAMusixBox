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

export default {
    pushQueue,
    readQueue,
    currentTrack,
    seekTrack,
    upNext,
    dumpQueueData,
    clearQueue,
};