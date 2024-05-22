
import { useEffect, useState } from "react";
import { login, logout } from "./store/authSlice";
import { useDispatch } from "react-redux";
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/Footer.jsx";
import { Outlet } from "react-router-dom";
import axios from "axios";
// import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation.js";


function App() {
  // const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    
    (async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user");
        // console.log(userData.data.data);
        const userData = response.data.data;
        // console.log(userData);
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log(error.message);
      }
      finally {
        () => {
          setLoading(false);
        }
      };
  }
    )()
    // authService
    //   .getCurrentUser()
    //   .then((userData) => {
    //     if (userData) {
    //       dispatch(login(userData));
    //     } else {
    //       dispatch(logout());
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
       
      <div>
          <Header />
          <Outlet />
          <Footer/>
      </div>
     
    </>
  );
}

export default App;
