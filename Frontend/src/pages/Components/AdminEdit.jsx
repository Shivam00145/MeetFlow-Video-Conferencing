import { useState } from "react";
import "./components.css";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { editUser } from "../../api/auth_api";
import { useAuth } from "../../Auth/auth";

const AdminEdit = ({setEditMode, name, email, setCounter=null}) => {
    const {userData, setUserData} = useAuth();

    const [user, setUser] = useState({
            prevName: name,
            prevEmail: email,
            newName: "",
            newEmail: "",
        });
    const [error, setError] = useState([]);
    
    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;
    
        setUser({
            ...user, [name]: value,
        })
    }

    const handleClose = () => {
        setEditMode(false);
    }

    const handleSubmit = async(e) => {
        e.preventDefault(); 
       
        try{
            const res = await editUser(user);
            setError([]);
            
            if (res.status === 200) { 
                if(userData.name===user.prevName && userData.email===user.prevEmail){
                    setUserData({
                        name: user.newName,
                        email : user.newEmail,
                    })
                }
                setCounter ? setCounter(prev => prev + 1): "";
                
            }
            setEditMode(false);
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
                onClick={(handleClose)} 
            >
                <CloseIcon/>
            </IconButton>
            <div className="contant">
                <div className="admin-edit-form">
                    <h2 className="edit-title">Edit</h2>
                    <form 
                        className="edit-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="edit-group">
                            <input
                                type="text"
                                id="newName"
                                name="newName"
                                value={user.newName}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder={user.prevName} />
                            <label htmlFor="newName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                        </div>
                        <div className="edit-group">
                            <input
                                type="email"
                                id="newEmail"
                                name="newEmail"
                                value={user.newEmail}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder={user.prevEmail} />
                            <label htmlFor="newEmail"><i className="zmdi zmdi-email"/></label>
                        </div>
                        <div>
                            {
                                Array.isArray(error) &&
                                error.map((curr, index) => (
                                    <h5 key={index} style={{ color: "red" }}>{curr}</h5>
                                ))
                            }
                        </div>
                        <div className="form-group-button edit-button">
                            <input
                                type="submit"
                                id="signup"
                                className="edit-submit"
                                value="Edit" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminEdit;
