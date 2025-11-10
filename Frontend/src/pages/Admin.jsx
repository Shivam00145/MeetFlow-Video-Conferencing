import React, { useState } from 'react'; 
import { Box, Tab, Card, IconButton, colors } from "@mui/material"; 
import { TabContext, TabList, TabPanel } from '@mui/lab'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./Admin.css"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/auth';
import { useEffect } from 'react';
import { deleteMeetingRoom, deleteMessage, deleteUser, getAllMeessages, getAllMeetingRooms, getAllUsers } from '../api/auth_api';
import AdminEdit from './Components/AdminEdit';
import AdminAddUser from './Components/AdminAddUser';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Admin = () => {
    const {userData, cookies, isEmpty, isAdmin} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
            if(isEmpty(userData) && isEmpty(cookies)) navigate("/signup");

            const timeoutId = setTimeout(() => {
      
                if (!isAdmin) {
                  navigate("/home");
                }
      
            }, 1000);

            return () => {
              clearTimeout(timeoutId);
            };

    },[userData,cookies, isAdmin])

    const [user, setUser] = useState({
        name: "",
        email: ""
    });
    const [value, setValue] = useState('1');
    const [refreshCounterUser, setRefreshCounterUser] = useState(0);
    const [refreshCounterMeetingRoom, setRefreshCounterMeetingRoom] = useState(0);
    const [refreshCounterMessages, setRefreshCounterMessages] = useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [users, setUsers] = useState([]);
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const res = await getAllUsers();
                   
                    setUsers(res.data);
                } catch(e) {
                    console.log(e);
                }
            }
    
            fetchUsers();
    }, [refreshCounterUser])

    useEffect(() => {
            const fetchMeetingRooms = async () => {
                try {
                    const res = await getAllMeetingRooms();
                    
                    setMeetingRooms(res.data);
                } catch(e) {
                    console.log(e);
                }
            }
    
            fetchMeetingRooms();
    }, [refreshCounterMeetingRoom])

    useEffect(() => {
            const fetchMessages = async () => {
                try {
                    const res = await getAllMeessages();
                    
                    setMessages(res.data);
                } catch(e) {
                    console.log(e);
                }
            }
    
            fetchMessages();
    }, [refreshCounterMessages])



    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    let handleDeleteUser = async (id) => {
        try{
          
            const res= await deleteUser(id);
          

            if (res.status === 200) { 
                 setRefreshCounterUser(prev => prev + 1);
            }
        }catch(e){
            console.log(e);
        }
    }

    let handleDeleteMeetingRoom = async (id) => {
        try{
       
            const res= await deleteMeetingRoom(id);

            if (res.status === 200) { 
                 setRefreshCounterMeetingRoom(prev => prev + 1);
            }
        }catch(e){
            console.log(e);
        }
    }

    let handleDeleteMessage = async (id) => {
        try{
            
            const res= await deleteMessage(id);

            if (res.status === 200) { 
                 setRefreshCounterMessages(prev => prev + 1);
            }
        }catch(e){
            console.log(e);
        }
    }

    let handleEdit = (name, email) => {
        setUser({
            name: name,
            email: email
        });
        setShowEdit(!showEdit)
    }

    return (
        <div className='admin-container'>
            {
                showEdit ?
                    <AdminEdit
                        setEditMode={setShowEdit} 
                        name={user.name}
                        email={user.email}
                        setCounter={setRefreshCounterUser}  
                    />
                :
                <></>
            }
            {
                showAdd ?
                    <AdminAddUser
                        setEditMode={setShowAdd}
                        setCounter={setRefreshCounterUser}
                    /> 
                :
                <></>
            }
            
            <TabContext value={value}> 
                <Box className="nav" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example"> 
                        <Tab label="Users" value="1"/>
                        <Tab label="Meeting Rooms" value="2" />
                        <Tab label="Messages" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <h1 style={{padding: "5px"}}>Users</h1>
                        <IconButton onClick={() => setShowAdd(!showAdd)} className='edit-icon'  aria-label="delete">
                            <AddCircleOutlineIcon style={{color: "blue"}}/>
                        </IconButton> 
                    </div>
                    <div className='ad-container'>
                        {
                            (users.length !== 0) ? users.map((user, idx) => {
                                return (
                                    <Card className="card" key={idx} variant="outlined">
                                        <div>
                                            <h4>Username : {user.username}</h4>
                                            <h4>E-mail : {user.email} </h4>
                                            <h4>IsAdmin : {user.isAdmin ? "True" : "False"} </h4>
                                            <h4>CreatedAt : {formatDate(user.date)} </h4>
                                        </div>
                                        <div>
                                            <IconButton onClick={() => handleEdit(user.username, user.email)} className='edit-icon'  aria-label="delete">
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton onClick={() => handleDeleteUser(user.id)} className="delete-icon" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </Card>
                                )
                            })
                            :
                            <></>
                        } 

                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <div className='ad-container'>
                        {
                            (meetingRooms.length !== 0) ?meetingRooms.map((meetingRoom, idx) => {
                                return (
                                    <Card className="card" key={idx} variant="outlined">
                                        <div>
                                            <h4>MeetingCode : {meetingRoom.meetingCode} </h4>
                                            <h4>Date : {formatDate(meetingRoom.date)} </h4>
                                        </div>
                                        <div>
                                            <IconButton onClick={() => handleDeleteMeetingRoom(meetingRoom.id)} className="delete-icon" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </Card>
                                )
                            })
                            :
                            <></>
                        } 

                    </div>
                </TabPanel>
                <TabPanel value="3">
                    <div className='ad-container'>
                        {
                            (messages.length !== 0) ?messages.map((message, idx) => {
                                return (
                                    <Card className="card" key={idx} variant="outlined">
                                        <div>
                                            <h4>Username : {message.username} </h4>
                                            <h4>E-mail : {message.email} </h4>
                                            <h4>date : {formatDate(message.date)} </h4>
                                            <h4>Message : {message.message} </h4>
                                        </div>
                                        <div>
                                            <IconButton onClick={() => handleDeleteMessage(message.id)} className="delete-icon" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </Card>
                                )
                            })
                            :
                            <></>
                        } 

                    </div>
                </TabPanel>
            </TabContext>
        </div>
    );
}

export default Admin;