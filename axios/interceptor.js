// adding interceptor for the sake of industry standard

const requestInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            if (config.url.includes('/api/response/play')) {
                console.log(`Response type need to be Arraybuffer.`)
                config.responseType = 'arraybuffer';
            }

            return config;
        },
        (error) => Promise.reject(error)
    );
}

export default requestInterceptor;