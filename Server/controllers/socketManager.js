import { Server} from "socket.io"

let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log("CONNECTED---")

        socket.on("join-call", (path, username) => {

            if (connections[path] === undefined) {
                connections[path] = []
            }

            const isUsernameTaken = connections[path].some(user => user.username === username);

            if (isUsernameTaken) {
                socket.emit("username-taken");
                return; 
            }

            socket.emit("join-success");


            connections[path].push({socketId: socket.id, username})

            timeOnline[socket.id] = new Date();


            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a].socketId).emit("user-joined", socket.id, connections[path])
            }
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, userList]) => {
                    
                    const userExistsInRoom = userList.some(user => user.socketId === socket.id);

                    if (!isFound && userExistsInRoom) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })

                connections[matchingRoom].forEach((user) => {
                    io.to(user.socketId).emit("chat-message", data, sender, socket.id)
                })
            }

        })


        socket.on("private-message", (toId, data, sender) => {
         
            io.to(toId).emit("private-message", data, sender, socket.id);
            
       
            io.to(socket.id).emit("private-message", data, sender, socket.id); 
            
        });


        socket.on("disconnect", () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            var roomKey; 

            for (const [key, userList] of Object.entries(connections)) {
                
                const index = userList.findIndex(user => user.socketId === socket.id);

                
                if (index !== -1) {
                    roomKey = key;

                    userList.forEach(user => {
                        io.to(user.socketId).emit('user-left', socket.id);
                    });

                    
                    userList.splice(index, 1);

                    
                    if (userList.length === 0) {
                        delete connections[roomKey];
                    }

                   
                    delete timeOnline[socket.id];
                    
                    break;
                }
            }

        })


    })

    return io;
}