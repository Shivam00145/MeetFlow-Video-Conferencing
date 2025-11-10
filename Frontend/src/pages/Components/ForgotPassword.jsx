import { useState } from "react";
import "./components.css";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import { useAuth } from "../../Auth/auth";
import { editPassword } from "../../api/auth_api";

const ForgotPassword = ({setMode, setSuccess}) => {
    const {userData} = useAuth();
    const [password, setPassword] = useState({
            previousPassword: "",
            newPassword: "",
        });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState([]);
    
    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;
    
        setPassword({
            ...password, [name]: value,
        })
    }

    const handleClose = () => setMode(false);

    const handleSubmit = async(e) => {
        e.preventDefault(); 
        
        if(password.newPassword !== confirmPassword) setError(["New password and Confirm password does not match"]);

        const payload = { user: userData, password: password}

        try{
            const res = await editPassword(payload);
            setError([]);
            
            setMode(false);
            }
            catch(err){
                setError(err.response.data.error);
                
            }
    }


    return (
        <div className="component-container">
            <IconButton 
                className="close"
                aria-label="delete" 
                size="large"
                onClick={handleClose}
            >
                <CloseIcon/>
            </IconButton>
            <div className="contant">
                <div className="admin-pass-form">
                    <h2 className="pass-title">Forgot Password</h2>
                    <form 
                        className="pass-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="pass-group">
                            <input
                                type="password"
                                id="previousPassword"
                                name="previousPassword"
                                value={password.previousPassword}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder="Previous Password" />
                            <label htmlFor="previousPassword"><i className="zmdi zmdi-lock"/></label>
                        </div>
                        <div className="pass-group">
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder="New Password" />
                            <label htmlFor="newPassword"><EnhancedEncryptionIcon style={{fontSize: "27px"}}/></label>
                        </div>
                        <div className="pass-group">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="off"
                                placeholder="Confirm Password" />
                            <label htmlFor="confirmPassword"><NoEncryptionIcon style={{fontSize: "27px"}}/></label>
                        </div>
                        <div>
                            {
                                Array.isArray(error) &&
                                error.map((curr, index) => (
                                    <h5 key={index} style={{ color: "red" }}>{curr}</h5>
                                ))
                            }
                        </div>
                        <div className="form-group-button pass-button">
                            <input
                                type="submit"
                                id="signup"
                                className="pass-submit"
                                value="Change" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
