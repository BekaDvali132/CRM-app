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

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  return (
    <UserContext.Provider value={user}>
      <Router>
        <a download={true} href="/resources/Excel.xlsx" >excel</a>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser}/>} />
            <Route path="/" element={<UserRoute setUser={setUser}/>}>
            <Route path="/clinics" element={<Clinics />}/>
            <Route path="/clinics/register" element={<RegisterClinic />}/>
            <Route path="/clinics/edit/:id" element={<EditClinic />}/>
            <Route path="/clinics/edit/:id" element={<Offers />}/>
            <Route path="/users" element={<Users />}/>
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
