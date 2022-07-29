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

function App() {
  return (
    <UserContext.Provider value={JSON.parse(localStorage.getItem("user"))}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/" element={  component={Login}/>} /> */}
            <Route path="/" element={<UserRoute />}>
            <Route path="/clinics" element={<Clinics />}/>
            <Route path="/clinics/register" element={<RegisterClinic />}/>
            <Route path="/clinics/edit/:id" element={<EditClinic />}/>
            <Route path="/clinics/edit/:id" element={<Offers />}/>
            <Route path="/users" element={<Users />}/>
            <Route path="/users/register" element={<UsersRegister />}/>
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
