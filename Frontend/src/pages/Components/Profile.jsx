import { useState } from "react";
import "./components.css";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { useAuth } from "../../Auth/auth";
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { NavLink } from "react-router-dom";
import AdminEdit from "./AdminEdit";
import ForgotPassword from "./ForgotPassword";
import { useEffect } from "react";

const Profile = ({setProfileMode}) => {
    const {userData, cookies, isEmpty, isAdmin, setUserData} = useAuth();

    useEffect(() => {
        if(isEmpty(userData) && isEmpty(cookies)){
            setProfileMode(false);
        }
    },[userData, cookies])

    const [showEdit, setShowEdit] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [success, setSuccess] = useState([]);

    const handleClose = () => {
        setProfileMode(false);
    }

    return (
        <div className="profile-container">
            {
                showEdit ?
                    <AdminEdit
                        setEditMode={setShowEdit}
                        name={userData.name}
                        email={userData.email}
                    />
                :
                <></>
            }

            {
                showChangePassword ?
                    <ForgotPassword
                        setMode={setShowChangePassword}
                        setSuccess={setSuccess}
                    />
                :
                <></>
            }

            <IconButton 
                className="profile-close"
                aria-label="delete" 
                size="large"
                onClick={handleClose}
            >
                <CloseIcon/>
            </IconButton>
            <div className="profile-content">
                <div className="profile">
                    <div className="logo">
                        <div>{userData && userData.name && 
                                <span>{ userData.name.charAt(0).toUpperCase() }</span>
                            }</div>
                    </div>
                    <div className="info">
                        <div className="p1">
                            <h1>{userData.name}</h1>
                            <h4> <div><EmailIcon/> {userData.email}</div></h4>
                        </div>
                        <div className="p2">
                            <IconButton onClick={() => setShowEdit(!showEdit)} className='edit-icon'  aria-label="delete">
                                <EditIcon />
                            </IconButton>
                            <IconButton className='edit-icon'  aria-label="delete">
                                <NavLink to="/history" onClick={handleClose}><HistoryIcon style={{color: "black"}}/></NavLink>
                            </IconButton>    
                        </div>
                        
                    </div>
                </div>
                <div className="forgot">
                    <div className="form-group-button pass-button" onClick={() => setShowChangePassword(!showChangePassword)}>
                        <input
                            type="submit"
                            id="signup"
                            className="pass-submit"
                            value="Change Password" 
                        />
                    </div>
                    <div>
                        {
                            Array.isArray(success) &&
                            success.map((curr, index) => (
                                <h5 key={index} style={{ color: "green" }}>{curr}</h5>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
