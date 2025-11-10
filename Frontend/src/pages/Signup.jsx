import { useState } from "react";
import "./style.css";
import {NavLink} from "react-router-dom";
import { postRegister } from "../api/auth_api";


const Signup = () => {
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

    const handleSubmit = async(e) => {
        e.preventDefault(); 
       
        try{
            const res = await postRegister(user);
            setError([]);
          
            setUser({name:"",email:"",password:"",});
        }
        catch(err){
            setError(err.response.data.error);
         
        }
    }

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">SignUp</h2>
                            <form 
                                className="register-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="form-group">
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
                                        value="SignUp" 
                                    />
                                </div>
                            </form>
                        </div>
                         <div className="signup-image">
                            <figure>
                                <img src="./S.jpg" alt="sign up image" />
                            </figure>
                            <NavLink href="/login" className="signup-image-link">I am already member</NavLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Signup;
