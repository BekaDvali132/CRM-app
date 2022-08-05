import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import "antd/dist/antd.min.css";
import UserRoute from "./components/layout/UserRoute";
import { UserContext } from "./components/hooks/contexts/UserContext";
import Clinics from "./components/clinics/Clinics";
import RegisterClinic from "./components/clinics/RegisterClinic";
import EditClinic from "./components/clinics/EditClinic";
import Offers from "./components/offers/Offers";
import Users from "./components/users/Users";
import UsersRegister from "./components/users/UsersRegister";
import EditUsers from "./components/users/EditUsers";
import { useState } from "react";
import axios from "axios";
import PageScroll from "./components/pageScroll/PageScroll";
import Profile from "./components/profile/Profile";
import RecoverPassword from "./components/auth/RecoverPassword";

function App() {
  const [user, setUser] = useState()

  if (process.env.NODE_ENV !== 'production') {
    axios.defaults.baseURL = "http://localhost:5000";
  }

  return (
    <UserContext.Provider value={user}>
      <Router>
      <PageScroll/>
        <div className="App">
          <Routes>
            <Route path="/recover-password/:id" element={<RecoverPassword setUser={setUser}/>} />
            <Route path="/login" element={<Login setUser={setUser}/>} />
            <Route path="/" element={<UserRoute setUser={setUser}/>}>
            <Route path="/" element={<Clinics />}/>
            <Route path="/clinics" element={<Clinics />}/>
            <Route path="/clinics/register" element={<RegisterClinic />}/>
            <Route path="/clinics/edit/:id" element={<EditClinic />}/>
            <Route path="/clinics/edit/:id" element={<Offers />}/>
            <Route path="/users" element={<Users />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/users/register" element={<UsersRegister />}/>
            <Route path="/users/edit/:id" element={<EditUsers />}/>
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
