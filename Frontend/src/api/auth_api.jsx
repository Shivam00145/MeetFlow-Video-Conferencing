import axios from "axios";
import server from "../environment";

const BASE_URL = server;
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
          "Content-Type": "application/json",
        },
    withCredentials: true,
})

export const postRegister = async (user) => {
    console.log(user);
    return await api.post("/register", user);
};

export const postLogin = async (user) => {
   return await api.post("/login", user);
}

export const postMessage = async (user) => {
    return await api.post("/contact", user);
}

export const getUser = async () => {
    return await api.get("/user");
}

export const addToUserHistory = async (meetingCode) => {
    const payload = { meetingCode: meetingCode }; 

    return await api.post("/addHistory", payload);
}

export const getHistoryOfUser = async () => {  
    return await api.get("/getHistory");
}

export const deleteHistoryOfUser = async (id) => {
    return await api.delete(`/removeHistory/${id}`);
}


export const checkIsAdmin = async () => {
    return await api.get("/isAdmin");
}

export const getAllUsers = async () => {
    return await api.get("/getAllUsers");
}

export const getAllMeetingRooms = async () => {
    return await api.get("/getAllMeetingRoom");
}

export const getAllMeessages = async () => {
    return await api.get("/getAllMessage");
}

export const deleteUser = async (id) => {
    return await api.delete(`/removeUser/${id}`);
}

export const deleteMeetingRoom = async (id) => {
    return await api.delete(`/removeMeetingRoom/${id}`);
}

export const deleteMessage = async (id) => {
    return await api.delete(`/removeMessage/${id}`);
}

export const addUser = async (user) => {
    return await api.post("/addUser", user);
};

export const editUser = async (user) => {
    return await api.patch("/editUser", user);
};

export const editPassword = async (payload) => {
    return await api.patch("/editPassword", payload);
};

