let IS_PROD = true;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const server = IS_PROD ?
    import.meta.env.VITE_API_URL
     :
    BASE_URL


export default server;

