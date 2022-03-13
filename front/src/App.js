import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import SignIn from "./pages/signIn/Sign";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signIn/SignUp";

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    if (localStorage.getItem('user_id'))
    {
      setUser({
        user_id: localStorage.getItem('user_id'),
        role: localStorage.getItem('role'),
        email: localStorage.getItem('email')
      })
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn user={user} setUser={setUser} />} />
          <Route path="/login" element={<SignIn user={user} setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
