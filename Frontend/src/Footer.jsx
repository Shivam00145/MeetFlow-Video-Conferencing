import "./HeaderFooter.css";
import { NavLink } from "react-router-dom";
import { FaFacebook } from "react-icons/fa"
import { FaInstagram } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub } from 'react-icons/fa6';
import { FaCopyright } from 'react-icons/fa6';


export const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="grid grid-two-cols footer-content">
                        <h2>Doom</h2>
                        <div className="list">
                            <FaFacebook />
                            <FaInstagram />
                            <FaXTwitter />
                            <FaGithub />
                        </div>
                </div>
                
                <div className="grid grid-two-cols copyright">
                    <h3> <FaCopyright /> 2025 MeetFlow</h3>
                    <div className="list">
                        <NavLink to="#">Privacy Policy</NavLink>
                        <NavLink to="#">Legal Notice</NavLink>
                        <NavLink to="#">Terms of Servie</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}




