import React, { useEffect } from 'react';
import io, { Socket } from "socket.io-client"
import server from '../environment';
import { useRef } from 'react';
import { useState } from 'react';
import { useAuth } from '../Auth/auth';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, IconButton, Badge} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';

import "./VideoMeet.css";


const server_url = server;

var connections = {}

const peerConfigConnections = {
    "iceServers": [
        {"urls": "stun:stun.l.google.com:19302"}
    ]
}


export const VideoMeetComponent = () => {

    const {userData, cookies, isEmpty} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(isEmpty(userData) && isEmpty(cookies)) navigate("/signup")
    },[userData,cookies])

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();
    const videoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [askForUsername, setAskForUsername] = useState(true);
    let [showModal, setShowModal] = useState(false);

    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(3);
    let [username, setUsername] = useState("");
    let [usernameError, setUsernameError] = useState("");
    let [videos, setVideos] = useState([]);

    let [focusVideo, setFocusVideo] = useState();

    let [privateRecipient, setPrivateRecipient] = useState(null); 
    let [privateMessages, setPrivateMessages] = useState({}); ;

    // webRTC work in chromium based web browser
    // todo
    // if(isChrome() ===false){

    // }



    const getPermissions = async () => {
        try {
            let videoAccess = false;
            let audioAccess = false;

           

            try{
                const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

                if (videoPermission.getVideoTracks().length > 0) {
                    videoAccess = true;
                }
                videoPermission.getTracks().forEach(track => track.stop());
            }catch(e) {

            }

            try{
                const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

                if (audioPermission.getAudioTracks().length > 0) {
                    audioAccess = true;
                }
            }catch(e) {

            }

            setVideoAvailable(videoAccess);
            setAudioAvailable(audioAccess);

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAccess || audioAccess) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAccess, audio: audioAccess });

                if (userMediaStream) {
                    window.localStream = userMediaStream;

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        } catch (error) {
            console.error("General Error in getPermissions:", error);
        }
    }

    useEffect(() => {
      
        getPermissions();
    },[])

    useEffect(() => {
        if (window.localStream && localVideoRef.current) {
            
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [askForUsername]); 
   

    useEffect(() =>{
    
        if(video !== undefined && audio !== undefined){
            getUserMedia();
            
        }
    }, [video, audio]);


    useEffect(() => {
        if (videoRef.current && focusVideo?.stream) {
          videoRef.current.srcObject = focusVideo.stream;
        }
    }, [focusVideo]);



    const getUserMediaSuccess = (stream) => {
    
        try{
            window.localStream.getTracks().forEach(track => track.stop());
        } catch(error) {
            console.log(error);
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;
      

        for(let id in connections){
            
            if(id === socketIdRef.current) continue;


            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
                });
            }

            connections[id].createOffer()
                .then(description => {
                    console.log("Offer SDP:", description);
                    return connections[id].setLocalDescription(description);
                })
                .then(() => {
                    socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
                })
                .catch(error => console.log("Offer error:", error));

        }




        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }catch(error){
                console.log(error);
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream;

            for(let id in connections){
                connections[id].addStream(window.localStream);

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description).then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({'sdp': connections[id].localDescription}));
                    }).catch(error => console.log(error));
                })
            }

        })

    }

    const getUserMedia = () => {

        if (!window.localStream) {
            console.error("window.localStream is not initialized. Cannot toggle tracks.");
         
            if ((video && videoAvailable) || (audio && audioAvailable)) {
                navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                    .then(getUserMediaSuccess)
                    .then((stream) => {}) 
                    .catch((error) => console.log(error));
            }
            return;
        }

     
        const videoTrack = window.localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = video; 
                                      
        } else {
            console.warn("No video track found on window.localStream");
        }

        const audioTrack = window.localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = audio; 
                                       
        } else {
            console.warn("No audio track found on window.localStream");
        }

    }



    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen]);


    const getDislayMediaSuccess = (stream) =>{
        

        try{
            window.localStream.getTracks().forEach(track => track.stop());
        } catch(e){
            console.log(e);
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for(let id in connections){
            if(id === socketIdRef.current) continue;

            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
                });
            }

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({'sdp': connections[id].localDescription}));
                    })
                    .catch(e => console.log(e));
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    const getDislayMedia = () => {
        if(screen){
            if(navigator.mediaDevices.getDisplayMedia){
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(getDislayMediaSuccess)
                .then((stream) => {})
                .catch( e => console.log(e));
            }
        }
    }


    const getMedia = () => {
       
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    } 

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if(fromId !== socketIdRef.current){
            if(signal.sdp){
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if(signal.sdp.type === 'offer'){
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription}));

                                }).catch(error => console.log(error));
                            }).catch(error => console.log(error));
                        }
                    }).catch(error => console.log(error));
            }

            if(signal.ice){
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(error => console.log(error));
            }
        }
    }

    
    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });


     
        socketRef.current.on("join-success", () => {
            
            setAskForUsername(false); 
        });

       
        socketRef.current.on("username-taken", () => {
            console.error("Username is taken.");
            setUsernameError("This username is already taken. Please try another.");
            socketRef.current.disconnect(); 
        });
      



        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {

            socketRef.current.emit("join-call", window.location.href, username);
            socketIdRef.current = socketRef.current.id;


            
            if (window.localStream) {
                const myVideo = {
                    socketId: socketIdRef.current,
                    username: username, 
                    stream: window.localStream,
                    autoplay: true,
                    playsinline: true
                };
                
             
                setVideos(prevVideos => [myVideo, ...prevVideos]); 
                
              
            }
           


            socketRef.current.on("chat-message", addMessage);

            socketRef.current.on("private-message", addPrivateMessage);

            socketRef.current.on("user-left", (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

    
            socketRef.current.on("user-joined", (id, clients) => {
                
                clients.forEach((user) => {
                  
                    const { socketId: socketListId, username: userUsername } = user;

                    
                    if (socketListId === socketIdRef.current) return;
                    
                 
                    if (!connections[socketListId]) {
                        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                   
                        connections[socketListId].onicecandidate = function (event) {
                            if (event.candidate != null) {
                                socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }));
                            }
                        }

                    
                        connections[socketListId].ontrack = (event) => {
                            const remoteStream = event.streams[0]; 
                            if (!remoteStream) {
                                console.warn('Received track event without a MediaStream.');
                                return;
                            }

                            setVideos(prevVideos => {
                                const videoExist = prevVideos.find(v => v.socketId === socketListId);

                                if (videoExist) {
                                    
                                    return prevVideos.map(video =>
                                        video.socketId === socketListId ? { ...video, stream: remoteStream, username: userUsername } : video
                                    );
                                } else {
                                    
                                    let newVideo = {
                                        socketId: socketListId,
                                        stream: remoteStream,
                                        username: userUsername, 
                                        autoplay: true,
                                        playsinline: true
                                    };
                                    return [...prevVideos, newVideo];
                                }
                            });
                        };


                            if (window.localStream) {
                                window.localStream.getTracks().forEach(track => {
                                    connections[socketListId].addTrack(track, window.localStream);
                                });
                            } else {
                                
                                let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                                window.localStream = blackSilence();
                            
                                window.localStream.getTracks().forEach(track => {
                                    connections[socketListId].addTrack(track, window.localStream);
                                });
                            }
                    }
                });

               
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
                        
                        
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                }).catch(error => console.log(error));
                        });
                    }
                }
            });
            
        });
    
    };

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();

        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();

        return Object.assign(dst.stream.getAudioTracks()[0], {enabled : false});
    }

    let black = ({width = 640, height = 480} = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), {width, height});
        canvas.getContext('2d').fillRect(0,0,width,height);

        let stream = canvas.captureStream();

        return Object.assign(stream.getVideoTracks()[0], {enabled: false});
    }

    const connect = () => {
        if (username.trim() === "") {
            setUsernameError("Username cannot be empty.");
            return;
        }
        
        setUsernameError(""); 
        getMedia(); 

    }

    let handleVideo = () => {
        setVideo(!video);
    }
    
    let handleAudio = () => {
        setAudio(!audio)
    }

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/home"
    }

    let openChat = (recipient = null) => { 
        setPrivateRecipient(recipient);
        setShowModal(true);
        setNewMessages(0);
    }

    let closeChat = () => {
        setShowModal(false);
        setPrivateRecipient(null);
    }

    let handleToggleChat = () => {
        if(showModal) {
            closeChat(); 
        } else {
            openChat(null);
    }
}

    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    let handlePrivateMessgae = (fromId, fromUsername) => {
        if(fromUsername === username) return ;

        const recipient = {socketId: fromId, username: fromUsername};

        openChat(recipient);
    }


    const addPrivateMessage = (data, sender, socketIdSender, recipientId = null) => {

        let conversationId;
    
  
        if (socketIdSender === socketIdRef.current) {

            conversationId = recipientId; 
        } 
  
        else {
            
            conversationId = socketIdSender;
        }


        if (!conversationId) {
            console.error("Cannot save private message: Conversation ID is missing.", {data, sender, socketIdSender, recipientId});
            return; 
        }

        setPrivateMessages((prevPrivateMessages) => {
            const newMessage = { sender: sender, data: data, socketId: socketIdSender };
            const updatedMessages = prevPrivateMessages[conversationId] 
                ? [...prevPrivateMessages[conversationId], newMessage]
                : [newMessage];
                
            
            return {
                ...prevPrivateMessages,
                [conversationId]: updatedMessages,
            };
        });
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data, socketId: socketIdSender }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        if (message.trim() === "") return;
    
        if (privateRecipient) {
            const toId = privateRecipient.socketId;
            socketRef.current.emit('private-message', privateRecipient.socketId, message, username)

            addPrivateMessage(message, username, socketIdRef.current, toId);
        } else {
            
            socketRef.current.emit('chat-message', message, username)
            
        }

        setMessage("");
    }

    return (
        <div>

            {askForUsername ? 
                <div className='video-background'>
                    <div className='video-container'>

                        <h2>Enter the Lobby</h2>
                        <TextField 
                            id="outlined-basic" 
                            style={{backgroundColor: "white", borderRadius: "5px"}}
                            label="username" value={username} 
                            onChange={e=> setUsername(e.target.value)} 
                            variant="outlined" 
                            error={usernameError !== ""} 
                            helperText={usernameError}
                        />
                        <Button variant="contained" onClick={connect}>Contained</Button>

                        <div className='video-lobby'>
                            <video ref={localVideoRef} autoPlay muted></video>
                           
                        </div>
                    </div>
                </div> 
                :
                <div className='videoMeetContainer'>
                    {focusVideo ? 
                        <div className='focus-container'>
                            <div className='bar'>
                                <h1 className='focus-username'>{focusVideo.username}</h1>
                                <h1  className='focus-icon' onClick={() => setFocusVideo()}><CloseIcon/></h1>
                            </div>
                            <video className='focusVideo' ref={videoRef} autoPlay muted></video>
                        </div> 
                    :
                    ""
                    }


                        
                    {showModal ? <div className='showMotion chatRoom'>
                        <div className='chat-heading'>
                            <h2>{privateRecipient ? `${privateRecipient.username}` : 'Public Chat'}</h2>
                            {privateRecipient && (
                                <IconButton 
                                    onClick={() => setPrivateRecipient(null)} 
                                    style={{ color: "blue", marginRight: '10px'}}
                                    title="Switch to Public Chat"
                                >
                                    <i className='fas fa-users to-public'/> <p style={{fontSize: '15px', textDecoration: "underline"}}>Public Chat</p>
                                </IconButton>
                            )}
                            <IconButton 
                                className='message-close' 
                                aria-label="delete" 
                                size="large" 
                                onClick={closeChat}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </div>
                        <div className='chat-container'>
                        
                            <div className="chattingDisplay">
                        
                             
                                {(() => {
                                    const currentMessages = privateRecipient 
                                        ? (privateMessages[privateRecipient.socketId] || []) 
                                        : messages;
                                
                                    if (currentMessages.length === 0) {
                                        return <p style={{padding: '10px'}}>{privateRecipient ? 'No private messages yet.' : 'No Public Messages Yet'}</p>
                                    }

                                
                                    return currentMessages.map((item, index) => {
                                        const isMyMessage = item.socketId === socketIdRef.current;
                                        return (
                                            <div className={`message-box ${isMyMessage ? 'mine' : ''}`} key={index}>
                                                <p className='message-username'>{item.sender}</p>
                                                <p className='message-data'>{item.data}</p>
                                            </div>
                                        )
                                    });
                                })()}

                            </div>
                            
                            <div className="chattingArea">
                                <TextField value={message}
                                    onChange={handleMessage} 
                                    id="outlined-basic" 
                                    label="Enter Your chat" 
                                    placeholder="Enter Your chat"
                                    variant="outlined"  
                                    multiline 
                                    minRows={2}
                                />
                                <Button variant="contained" onClick={sendMessage}>
                                    <SendIcon />
                                </Button>
                            </div>
                        </div>
                    </div> : <></>}



                    <div className="buttonContainers">
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton 
                                
                                onClick={handleToggleChat}
                                style={{ color: "white" }}>
                                <ChatIcon />                        
                            </IconButton>
                        </Badge>


                    </div>

                    <video className='userVideo' ref={localVideoRef} autoPlay muted></video>
                   
                    <div className='joinedVideos'>
                        {videos.map((video) => (
                            <div className="video-card" key={video.socketId} onClick={() => setFocusVideo(video)}>
                                 <h2 className='username'>{video.username}</h2> 
                                <video
                                    className='videos'
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                >
                                </video>
                                <IconButton 
                                    className='private-message' 
                                    aria-label="delete" 
                                    size="large"
                                    onClick={(e) =>{
                                        e.stopPropagation();
                                        handlePrivateMessgae(video.socketId, video.username);
                                    }}
                                >
                                    <MessageIcon/>
                                </IconButton>
                            </div>

                        ))}
                    </div>
                </div>  
            }

        </div>
    );
}

