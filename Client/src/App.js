import "./App.css";
import React, {useState} from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import About from "./Components/About";
import Alert from "./Components/Alert";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import NoteState from "./Context/Notes/NoteState";
function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      mesg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
        <div className="container mt-5">
          <Routes>
            <Route exact path="/" element={<Home showAlert={showAlert}/>} />
            <Route exact path="/login" element={<Login showAlert={showAlert} />} />
            <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
      </NoteState>
    </>
  );
}

export default App;
