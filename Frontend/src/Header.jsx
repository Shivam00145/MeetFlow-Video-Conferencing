import { useState, useEffect } from "react"
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";
import "./HeaderFooter.css";
import { useAuth } from "./Auth/auth";


export const Header = ({profile,setProfileMode}) => {
    const {userData, setUserData, LogOut, isAdmin, isEmpty} = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleToggleButton = () =>{
        setShowMenu(!showMenu);
    }
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 880) {
              setShowMenu(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        handleResize();
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = () => {
        LogOut();
        
        navigate("/login");
    }

    const handleProfile = () => {
        
        setProfileMode(!profile);
    };

    const handleNavLinkClick = (callback) => {
    if (showMenu) {
        setShowMenu(false);
    }
    
    if (callback) {
        callback();
    }
}

    return (
        <div className="header">
            <div className="navbar">
                <h2><NavLink to="/home">MeetFlow</NavLink></h2>
                <div className={showMenu ?"appNavList" : "webNavList"}>
                    <NavLink to="/contact" onClick={() => handleNavLinkClick()}>Contact Us</NavLink>
                    <NavLink to="#" onClick={() => handleNavLinkClick()}>Join As Guest</NavLink>
                    {!isEmpty(userData) ? (
                        <>
                            <NavLink to="#" onClick={() => handleNavLinkClick(handleProfile)}>Profile</NavLink>
                            <NavLink to="/history" onClick={() => handleNavLinkClick()}>History</NavLink>
                            {isAdmin ? (
                                <>
                                    <NavLink to="/admin" onClick={() => handleNavLinkClick()}>Admin</NavLink>
                                </>
                            ) : (
                                <></>
                            )}
                            <NavLink to="#" onClick={handleLogout}>Logout</NavLink>
                        </>
                    ):(
                        <>
                            <NavLink to="/signup" onClick={() => handleNavLinkClick()}>Register</NavLink>
                            <NavLink to="/login" onClick={() => handleNavLinkClick()}>Login</NavLink>
                        </>
                    )}
                </div>
                <div className='hambur'>
                    <button onClick={handleToggleButton}>
                        <RxHamburgerMenu />
                    </button>
                </div>
            </div>
        </div>
    )
}