import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/Login" Component={Login} />
        <Route exact path="/Signin" Component={Signin} />
        <Route path="/Signin/Dashboard" Component={Dashboard} />
        <Route path="/Login/Dashboard" Component={Dashboard} />
      </Routes>
    </div>
  );
}

export default App;
