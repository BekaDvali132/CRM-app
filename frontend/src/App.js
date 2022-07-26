import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import 'antd/dist/antd.min.css';
import UserRoute from "./components/layout/UserRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/" element={  component={Login}/>} /> */}
          <Route path="/" element={<UserRoute/>}>
            <Route path="/" element={<Login/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
