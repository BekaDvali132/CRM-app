import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import "antd/dist/antd.min.css";
import UserRoute from "./components/layout/UserRoute";
import { UserContext } from "./components/hooks/contexts/UserContext";

function App() {
  return (
    <UserContext.Provider value={JSON.parse(localStorage.getItem("user"))}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/" element={  component={Login}/>} /> */}
            <Route path="/" element={<UserRoute />}>
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
