let IS_PROD = true;
const BASE_URL = process.env.FRONTEND_URL;
const server = IS_PROD ?
    process.env.PROD_URL
     :
    BASE_URL


export default server;