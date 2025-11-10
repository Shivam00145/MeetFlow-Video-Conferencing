import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {LandingPage} from "./pages/LandingPage";
import { AppLayout } from "./AppLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./Auth/auth";
import Home from "./pages/Home";
import  { VideoMeetComponent } from "./pages/VideoMeet";
import History from "./pages/History";
import Admin from "./pages/Admin";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: <AppLayout/>,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/signup',
          element: <Signup />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/contact',
          element: <Contact />
        },
        {
          path: '/history',
          element: <History/>
        },
        {
          path: '/admin',
          element: <Admin/>
        },
      ]
    },
    {
      path: '/:url',
      element: <VideoMeetComponent />
    }
  ])
  

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;