let IS_PROD = false;
const BASE_URL = process.env.FRONTEND_URL;
const server = IS_PROD ?
    ""
     :
    BASE_URL


export default server;