import { useState } from "react";
import "./components.css";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { addUser } from "../../api/auth_api";

const AdminAddUser = ({setEditMode, setCounter}) => {
    const [user, setUser] = useState({
            name: "",
            email: "",
            password: "",
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
                const res = await addUser(user);
                setError([]);
                
                if (res.status === 200) { 
                    setCounter(prev => prev + 1);
                }
                setEditMode(false);
                setUser({name:"",email:"",password:"",});
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
                <div className="admin-add-form">
                    <h2 className="add-title">Add User</h2>
                    <form 
                        className="add-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="add-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={user.name}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder="Your name" />
                            <label htmlFor="name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                        </div>
                        <div className="add-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder="Your email" />
                            <label htmlFor="email"><i className="zmdi zmdi-email"/></label>
                        </div>
                        <div className="add-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handleInput}
                                autoComplete="off"
                                placeholder="Password" />
                            <label htmlFor="password"><i className="zmdi zmdi-lock"/></label>
                        </div>
                        <div>
                            {
                                Array.isArray(error) &&
                                error.map((curr, index) => (
                                    <h5 key={index} style={{ color: "red" }}>{curr}</h5>
                                ))
                            }
                        </div>
                        <div className="form-group-button add-button">
                            <input
                                type="submit"
                                id="signup"
                                className="add-submit"
                                value="Add" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminAddUser;
