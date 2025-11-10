// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom"
// import { useAuth } from "../Auth/auth";
// import { getUser } from "../api/auth_api";

// const withAuth = (WrappedComponent ) => {
//     const AuthComponent = (props) => {
//         const router = useNavigate();
//         const { userData, setUserData, cookies, removeCookie, isEmpty} = useAuth();

//         const checkAuth = async () => {
//             try{
        
//                 const res = await getUser();
//                 const {data, status} = res;
//                 console.log(data.user);
//                 setUserData(data.user);
//                 // console.log(status)
//                 console.log(cookies);
        
//                 return status ? true: (removeCookie("access_toek"), setUserData({}), navigate('/login')), false;
//             }catch(err){
//                 if (err.response && err.response.data && err.response.data.error) {
//                     console.log(err.response.data.error);
//                 } else {
//                     console.log("Network or unknown error occurred during login:", err.message);
//                 }
//             }
//         };

//         useEffect(() => {
//             if(isEmpty(userData) && isEmpty(cookies) && !checkAuth()) router("/signup")
//         }, [])

//         return <WrappedComponent {...props} />
//     }

//     return AuthComponent;
// }

// export default withAuth;