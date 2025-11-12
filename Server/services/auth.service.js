import { and, eq } from "drizzle-orm";
import { db } from "../config/db.js"
import { ContactMessage, History, Sessions, Users } from "../drizzle/schema.js"

import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";


export const getUserByEmail = async(email) => {
    const [user] = await db
                    .select()
                    .from(Users)
                    .where(eq(Users.email,email));

    return user;
}


export const hashPassword = async(password) => {
    return await argon2.hash(password);
}


export const createUser = async({name, email, password}) => {
    console.log(name, email, password);
    return await db
                    .insert(Users)
                    .values({name, email, password})
                    .$returningId();
                    
}

export const comparePassword = async(password,hash) =>{
    return await argon2.verify(hash,password);
}


const createSession = async({userId, ip, userAgent}) => {
    await db
            .delete(Sessions)
            .where(eq(Sessions.userId, userId));

            
    const [session] = await db
                            .insert(Sessions)
                            .values({
                                userId: userId, 
                                ip: ip, 
                                userAgent: userAgent
                            })
                            .$returningId()
                            
    return session;
}

export const addHistory = async(userId, meetingCode) => {
    await db
            .insert(History)
            .values({
                userId: userId,
                meetingCode,
            })
}

export const getHistory = async(userId) => {
    const history = await db
                            .select({
                                id: History.id,
                                meetingCode: History.meetingCode,
                                date: History.createdAt
                            })
                            .from(History)
                            .where(eq(History.userId, userId));

    return history;
}

export const deleteHistoryById = async(id) => {
    await db
            .delete(History)
            .where(eq(History.id,id));
}

const createAccessToken = ({userId, name, email, sessionId}) => {
    return jwt.sign({userId, name, email, sessionId}, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
    })
}


const createRefreshToken = (sessionId) => {
    return jwt.sign({sessionId}, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
    })
}


export const authenticateUser = async({req, res, id, name, email}) => {
    const session = await createSession({
        userId: id,
        ip : req.clientIp,
        userAgent : req.headers["user-agent"],
    });

    const accessToken = createAccessToken({
        userId: id,
        name,
        email,
        sessionId: session.id,
    });

    const refreshToken = createRefreshToken(session.id);

    const AccessBaseConfig = { httpOnly: false, withCredentials: true, sameSite: "Lax",  };
    const RefreshBaseConfig = { httpOnly: true, withCredentials:true, sameSite: "Strict"  };


    res.cookie("access_token", accessToken, {
        ...AccessBaseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refresh_token", refreshToken, {
        ...RefreshBaseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return {
        accessToken,
        refreshToken
    }
}


export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}


const findSessionById = async(id) =>{
    const [session] = await db
        .select()
        .from(Sessions)
        .where(eq(Sessions.id, id));

    return session;
}


const findUserById = async(id) => {
    const [user] = await db
        .select({
            id: Users.id,
            name: Users.name,
            email: Users.email
        })
        .from(Users)
        .where(eq(Users.id, id));

    return user;
}


export const newTokensGenerator = async(refreshToken) => {
    try{
        const decodeToken = verifyToken(refreshToken);

        const currentSession = await findSessionById(decodeToken.sessionId)


        if (!currentSession || !currentSession.valid) {
            throw new Error("Invalid session");
        }

        const user = await findUserById(currentSession.userId);

        if (!user) throw new Error("Invalid User");

        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            sessionId: currentSession.id,
        }
        
        const newAccessToken = createAccessToken(userInfo);
        const newRefreshToken = createRefreshToken(currentSession.id);
        
        return {
          newAccessToken,
          newRefreshToken,
          user: userInfo,
        };
        
    }catch(error){
        throw new Error(error);
    }
}


export const createContactMessage = async({userId, message}) => {
    return await db
                    .insert(ContactMessage)
                    .values({userId, message})
                    .$returningId();
}

export const checkIfAdmin = async(userId) => {
    const [res] = await db
                        .select({ isAdmin: Users.isAdmin })
                        .from(Users)
                        .where(eq(Users.id, userId));

    return res ? res.isAdmin : false;
}

export const getAllUsers = async() => {
    const res = await db
                        .select({
                            id: Users.id,
                            username: Users.name,
                            email: Users.email,
                            isAdmin: Users.isAdmin,
                            date: Users.createdAt
                        })
                        .from(Users);

    return res;
}

export const getAllMeetingRooms = async() => {
    const res = await db
                        .select({
                            id: History.id,
                            userId: History.userId,
                            meetingCode: History.meetingCode,
                            date: History.createdAt
                        })
                        .from(History);

    return res;
}

export const getAllMessages = async() => {
    const messages = await db
                        .select({
                            id: ContactMessage.id,
                            userId: ContactMessage.userId,
                            message: ContactMessage.message,
                            date: ContactMessage.createdAt,
                        })
                        .from(ContactMessage);


    const transformMessages = messages.map(async (msg) => {
        const userDetails = await findUserById(msg.userId);

        return {
            id: msg.id,
            username: userDetails?.name || 'Unknown User', 
            email: userDetails?.email || 'N/A',
            message: msg.message,
            date: msg.date,
        };
    });

    const res = await Promise.all(transformMessages);



    return res;
}

export const deleteUserById = async(id) => {
    await db
            .delete(Users)
            .where(eq(Users.id,id));
}

export const deleteMeetingRoomById = async(id) => {
    await db
            .delete(History)
            .where(eq(History.id,id));
}

export const deleteMessageById = async(id) => {
    await db
            .delete(ContactMessage)
            .where(eq(ContactMessage.id,id));
}

export const editUser = async(oldUser, newUser) => {
    await db
            .update(Users)
            .set({
                name: newUser.name,
                email: newUser.email,
            })
            .where(and(eq(Users.name, oldUser.name), eq(Users.email, oldUser.email)));
}

export const editUserPassword = async({email, password}) => {

    await db
            .update(Users)
            .set({
                password: password,
            })
            .where(eq(Users.email, email));
}