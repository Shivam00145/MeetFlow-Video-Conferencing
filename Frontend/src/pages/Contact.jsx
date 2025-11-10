import { useState } from "react";
import "./style.css";
import { postMessage } from "../api/auth_api";
import { useAuth } from "../Auth/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
    const {userData, isEmpty} = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        message: "",
    });

    useEffect(() => {
        if(!isEmpty(userData)){
            setUser({
                name: userData.name,
                email: userData.email,
                message: "",
            })
        }
    },[])

    const handleInput = (e) => {
        let name =  e.target.name ;
        let value =  e.target.value ;

        setUser({
            ...user, [name]: value,
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault(); 
        
        try{
            const res = await postMessage(user);
          
            navigate("/home");

        }
        catch(err){
            console.log(err.response.data.error);
        }
    }
     return (
        <div className="main">
            <section className="contact">
                <div className="container">
                    <div className="contact-content">
                        <div className="contact-form">
                            <h2 className="form-title">Contact Us</h2>
                            <form 
                                className="contact-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={userData.name || user.name}
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
                                        value={userData.email || user.email}
                                        onChange={handleInput}
                                        autoComplete="off"
                                        placeholder="Your email" />
                                    <label htmlFor="email"><i className="zmdi zmdi-email"/></label>
                                </div>
                                <div className="form-group">
                                    <textarea
                                        type="text"
                                        id="message"
                                        name="message"
                                        value={user.message}
                                        onChange={handleInput}
                                        autoComplete="off"
                                        placeholder="Your message" />
                                    <label htmlFor="message"><i className="zmdi zmdi-comment-text"></i></label>
                                </div>
                                <div className="form-group-button form-button">
                                    <input
                                        type="submit"
                                        id="signup"
                                        className="form-submit"
                                        value="Sent" 
                                    />
                                </div>
                            </form>
                        </div>
                         <div className="contact-image">
                            <figure>
                                <img src="./contact.png" alt="sign in image" 
                                style={{height:"300px"}}/>
                            </figure>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
