import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/auth";
import Card from '@mui/material/Card';

import { IconButton } from '@mui/material';
import { useEffect } from "react";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

import "./History.css";
import { deleteHistoryOfUser, getHistoryOfUser } from "../api/auth_api";


const History = () => {
    const {userData, cookies, isEmpty} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
            if(isEmpty(userData) && isEmpty(cookies)) navigate("/signup")
    },[userData,cookies])

    const [meetings, setMeetings] = useState([]);
    const [refreshCounter, setRefreshCounter] = useState(0);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                const res = history.data.data;
                setMeetings(res);
            } catch(e) {
                console.log(e);
            }
        }

        fetchHistory();
    }, [refreshCounter])

    let handleDelete = async (id) => {
        try{
          
            const res= await deleteHistoryOfUser(id);
        

            if (res.status === 200) { 
                 setRefreshCounter(prev => prev + 1);
            }
        }catch(e){
            console.log(e);
        }
    }

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    return (
        <div className="history-container">
            <h1>History</h1>
            <div className="history">

                {
                    (meetings.length !== 0) ? meetings.map((e, i) => {
                        return (
                                <Card className="card" key={i} variant="outlined">
                                    <div>
                                        <h3>Code : {e.meetingCode} </h3>
                                        <h4>Date : {formatDate(e.date)} </h4>
                                    </div>
                                    <IconButton className="delete-icon" aria-label="delete" onClick={() => handleDelete(e.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Card>
                        )
                    }) : <></>

                }

        </div>
        </div>
    )
}

export default History;
