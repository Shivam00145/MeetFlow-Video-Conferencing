import { NavLink } from 'react-router-dom';
import "./LandingPage.css"
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from 'react';


export const LandingPage = () => {
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

    return (
        <div className='landing'>
            <div className='landingNavbar'>
                <h2>MeetFlow</h2>
                <div className={showMenu ? "navListApp" : "navList"}>
                    <NavLink to="#">Join As Guest</NavLink>
                    <NavLink to="/signup">Register</NavLink>
                    <NavLink to="/signup">Register</NavLink>
                    <NavLink to="/login">Login</NavLink>
                </div>
                <div className='hambur'>
                    <button onClick={handleToggleButton}>
                        <RxHamburgerMenu />
                    </button>
                </div>
            </div>

            <div className='landingHero'>
                <div className='landingContent'>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>
                    <p>Cover a distance by <span style={{ color: "#FF9839" }}>Doom</span></p>
                    <div role='button'>
                        <NavLink to="#">Get Started </NavLink>
                    </div>
                </div>
                <div className='landingImage'>
                    <img src='.\3.png' alt='Vedio_Calling_Image'></img>
                </div>
            </div>
        </div>
    );
}

