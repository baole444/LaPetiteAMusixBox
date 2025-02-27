import * as SecureStore from 'expo-secure-store';

const rsa = "rsaPublicKey";

const saveKey = async(key, value) => {
    await SecureStore.setItemAsync(key, value);
}

const removeKey = async(key) => {
    await SecureStore.deleteItemAsync(key);
}

const resetKey = async(key, value) => {
    await SecureStore.removeKey(key);
    console.log(`Clearing key...`);
    await SecureStore.saveKey(key, value);
    console.log(`Setting key's new value...`);
}

const loadValue = async(key) => {
    const value = await SecureStore.getItemAsync(key);

    if (value) {
        return value;
    } else {
        console.log(`No value found under ${key}.`);
        return null;
    }
}

const dumpValueToLog = async(key) => {
    const value = await SecureStore.getItemAsync(key);

    if (value) {
        console.log(`Value under ${key} is ${value}`);
    } else {
        console.log(`${key} is empty.`);
    }
}

async function saveRSAPublicKey(value) {
    if (!value) {
        console.warn(`No RSA key was passed in, value = ${value}`);
        return;
    }
    try {
        await saveKey(rsa, value);
    } catch (e) {
        console.log(`Failed to save rsa public key: ${e.message}`);
    }
}

async function deleteRSAPublicKey() {
    try {
        await removeKey(rsa);
    } catch (e) {
        console.log(`Failed to remove rsa public key: ${e.message}`);
    }
}

async function updateRSAPublicKey(value) {
    if (!value) {
        console.warn(`No RSA key was passed in, value = ${value}`);
        return;
    }

    try {
        await resetKey(rsa, value);
    } catch (e) {
        
    }
    
}

export default {
    saveKey,
    removeKey,
    resetKey,
    loadValue,
    dumpValueToLog
}