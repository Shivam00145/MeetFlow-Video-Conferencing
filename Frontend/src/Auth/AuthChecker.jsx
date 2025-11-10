// import { useNavigate } from 'react-router-dom';
// import { useAuth } from './auth'; 
// import { useCookies } from "react-cookie";
// import { getUser } from "../api/auth_api";

// export const AuthChecker = ({ children }) => {
//   const navigate = useNavigate();
//   const { userData, setUserData, cookies, removeCookie } = useAuth(); 
//   // const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

//   useEffect(() => {
    
//     const checkAuth = async () => {
//       try{
//             const res = await getUser();
//             console.log(res.data.user);
//             setUserData(res.data.user);
//         }catch(err){
//             if (err.response && err.response.data && err.response.data.error) {
//                 console.log(err.response.data.error);
//             } else {
//                 console.log("Network or unknown error occurred during login:", err.message);
//             }
//         }
//     };

//     checkAuth();
    
//   }, [cookies, removeCookie, navigate, setUserData])

//   return <>{children}</>;
// }