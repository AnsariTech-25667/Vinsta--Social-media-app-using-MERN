import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home.jsx";
import Profile from "./components/screens/Profile.jsx";
import Login from "./components/screens/Login.jsx";
import Signup from "./components/screens/Signup.js";
import Createpost from "./components/screens/Createpost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './components/screens/UserProfile.jsx'
import Subscribeuserposts from'./components/screens/Subscribeuserposts.jsx'
export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
   
    } else {
      navigate("/signin");
    }
  },[]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route path="/create" element={<Createpost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/myfollowingposts" element={<Subscribeuserposts />} />
        {/* Define other routes and their corresponding components here */}
      </Routes>
    </>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
