import { Outlet, useNavigate } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { useAuth } from "./Auth/auth";
import { useEffect } from "react";
import { checkIsAdmin, getUser } from "./api/auth_api";
import { useState } from "react";
import Profile from "./pages/Components/Profile";


export const AppLayout = () => {
    const navigate = useNavigate();
    const { userData, setUserData, cookies, removeCookie, isEmpty, isAdmin, setIsAdmin} = useAuth();
    
    useEffect(() => {
        const publicRoutes = ['/login', '/signup']; 

        const check = async() => {
            if (isEmpty(userData) && isEmpty(cookies)) {
                await new Promise(resolve => setTimeout(resolve, 0));
                if (!publicRoutes.includes(location.pathname.toLowerCase())) {
                    navigate('/login');
                }
                return;
            }
            else if (publicRoutes.includes(location.pathname.toLowerCase())){
                navigate("/home")
            }


            await checkAuth();
        }
        
        const checkAuth = async () => {
          try{

                const res = await getUser();
                const admin = await checkIsAdmin();
                const {data, status} = res;
                setUserData(data.user);
                setIsAdmin(admin.data.isAdmin);

                return status ? "": (removeCookie("access_toek"), setUserData({}), navigate('/login'));
            }catch(err){
                if (err.response && err.response.data && err.response.data.error) {
                    console.log(err.response.data.error);
                } else {
                    console.log("Network or unknown error occurred during login:", err.message);
                }
            }
        };
        check();
        
      }, [cookies, removeCookie, navigate]);


    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
        {
            showProfile ?
                <Profile
                    setProfileMode={setShowProfile}
                /> 
            :
            <></>
        }
        <Header profile= {showProfile} setProfileMode= {setShowProfile}/>
        <Outlet />
        <Footer />
        </>
    )
}