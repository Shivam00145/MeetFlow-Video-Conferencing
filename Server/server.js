import express from "express";
import { authRoute } from "./routes/authRoute.js";
import bodyParser from "body-parser";
import requestIP from "request-ip";
import cookieParser from "cookie-parser";
import cors from "cors";
import {createServer} from "node:http";
import {Server} from "socket.io";
import { connectToSocket } from "./controllers/socketManager.js";
import server_URL from "./environment.js"


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const Port = process.env.PORT || 8080;
app.set("port", Port);



app.use(cors(
    {
        origin: server_URL,
        methods: ["GET", "POST", "DELETE", "PATCH"],
        credentials: true,
    }
))

app.use(cookieParser())

app.use(bodyParser.json());
app.use(express.json({ limit: "50kb"}));

app.use(express.urlencoded({ limit: "50kb", extended: true }));

app.use(requestIP.mw())

app.get("/", (req, res) => {
    if(!req.user) res.status(200).json({messgae: "Please Signup or Login"})
    try{
        res.status(200).json({message: "Welcome to home page-- Please Signup"})
    }catch(error){
        res.status(400).json({errors: error})
    }
})

app.use(authRoute)

server.listen(app.get("port"), ( ) => {
    console.log("Server Starts---");
})



