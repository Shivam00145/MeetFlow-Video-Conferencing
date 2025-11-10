import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { newTokensGenerator, verifyToken } from "../services/auth.service.js";



export const verifyAuthentication = async(req, res, next) => {

    const accessToken=req.cookies?.access_token || null;
    const refreshToken=req.cookies?.refresh_token || null;


    req.user = null;

    if(!accessToken && !refreshToken){
        return res
            .status(401)
            .json({ error: "Unauthorized HTTP, Tokens not provided" });
    }

    if(accessToken){
        try{
            const decodedToken = verifyToken(accessToken);

            req.user = decodedToken;


            return next();
        }catch(error){
            return res.status(401).json({error: "accessToken is invalid"});
        }
    }

    if(refreshToken){
        try{
            const {newAccessToken, newRefreshToken, user} = await newTokensGenerator(refreshToken);

            req.user=user;

            const AccessBaseConfig = { httpOnly: false, withCredentials: true, sameSite: "Lax",  };
            const RefreshBaseConfig = { httpOnly: true, withCredentials:true, sameSite: "Strict" };
            
            
            res.cookie("access_token", newAccessToken, {
                ...AccessBaseConfig,
                maxAge: ACCESS_TOKEN_EXPIRY,
            });
            
            res.cookie("refresh_token", newRefreshToken, {
                ...RefreshBaseConfig,
                maxAge: REFRESH_TOKEN_EXPIRY,
            });
        
            next();

        }catch(error){
            return res.status(400).json({error:error.message});
        }
    }

    next();
}