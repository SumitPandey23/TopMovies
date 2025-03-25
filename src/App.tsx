import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import AddMovies from "./Components/AddMovies";
import DeleteMovies from "./Components/DeleteMovies";
import EditMovies from "./Components/EditMovies";

const App = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <div>
                <Navbar />
                <Home />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/addMovies"
          element={
            token ? (
              <div>
                <Navbar />
                <AddMovies />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/editMovies"
          element={
            token ? (
              <div>
                <Navbar />
                <EditMovies />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/deleteMovies"
          element={
            token ? (
              <div>
                <Navbar />
                <DeleteMovies />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;
