import { useState } from "react";
import { postLogin, getUser } from "../api/auth_api";
import "./style.css";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
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
    
    const handleSubmit = async(e) => {
        e.preventDefault(); 
        
        try{
            const res = await postLogin(user);
            
            setError([]);
           
            setUser({email:"",password:"",});
            navigate("/home");
        }
        catch(err){
            setError(err.response.data.error);
            
        }
    }

    return (
        <div className="main">
            <section className="signin">
                <div className="container">
                    <div className="signin-content">
                        <div className="signin-form">
                            <h2 className="form-title">Login</h2>
                            <form 
                                className="login-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group-button form-button">
                                    <input
                                        type="submit"
                                        id="signup"
                                        className="form-submit"
                                        value="Login" 
                                    />
                                </div>
                            </form>
                        </div>
                         <div className="signin-image">
                            <figure>
                                <img src="./R.jpg" alt="sign in image" />
                            </figure>
                        </div>
                    </div>
                </div>
            </section>

            
        </div>
    );
}

export default Login;
