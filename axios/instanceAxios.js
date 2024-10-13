import axios from 'axios';
import asyncQueueManager from '../async-queue-manager';
import requestInterceptor from './interceptor';

const instClientGen = async () => {
    // IP in async storage, because I'm poor and don't have a dedicated vps with trusted ssl certificate.
    const lpambIP = await asyncQueueManager.seekIp();

    const instClient = axios.create({
        baseURL: lpambIP,
        timeout: 10000,
        //headers: {
        //    'Content-Type': 'application/json'
        //}
    });

    requestInterceptor(instClient);

    return instClient;
}

export default instClientGen;

