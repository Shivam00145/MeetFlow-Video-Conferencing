import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/auth";
import { useEffect, useState } from "react";
import {TextField, Button} from '@mui/material';
import "./Home.css";
import { addToUserHistory } from "../api/auth_api";


const Home = () => {
    const {userData, cookies, isEmpty} = useAuth();
    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");
    const [codeError, setCodeError] = useState("");

    useEffect(() => {
        if(isEmpty(userData) && isEmpty(cookies)) navigate("/signup")
    },[userData,cookies])



    const validateCode = (code) => {
        const numericCode = code.replace(/\D/g, ''); 
        
        if (numericCode.length < 6) {
            setCodeError("Code must be at least 6 digits long.");
            return false;
        }
        setCodeError("");
        return true;
    };


    const handleJoin = async() => {
        if (validateCode(meetingCode)) {
            const res=await addToUserHistory(meetingCode)
            
            navigate(`/${meetingCode}`)
        }
    };

    return (
        <div className="Home">
            <div className="meetContainer">
                <div className="leftPanel">
                   
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div className="join">

                            <TextField 
                                onChange={e => {
                                    
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 20); 
                                    setMeetingCode(value);
                                    
                                    validateCode(value); 
                                }}
                                className="join-input"
                                id="outlined-basic" 
                                label="Meeting Code" 
                                value={meetingCode}
                                variant="outlined" 
                                error={!!codeError}
                                helperText={codeError}
                            />
                            <Button className="join-button"  onClick={handleJoin} variant='contained'>Join</Button>

                        </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Home;
