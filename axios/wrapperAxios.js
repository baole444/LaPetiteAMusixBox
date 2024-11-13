import instClientGen from './instanceAxios';

const requestLPAMB = async (method, url, data = {}, headers = {}) => {
    try {
        // fetch instance
        const client = await instClientGen();

        const res = await client({
            method: method,
            url: url,
            data: data,
            headers: headers,
        });

        return res.data;
    } catch (e) {
        throw e.res ? e.res.data : e.message;
    }
};

export default requestLPAMB;

