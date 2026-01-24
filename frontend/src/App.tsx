import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Users } from "./pages/Users";
import { Screenings } from "./pages/Screenings";
import { LandingPage } from "./pages/LandingPage";
import { AuthProvider } from "./context/AuthContext";
import { Movies } from "./pages/Movies";
import { MovieDetails } from "./pages/MovieDetails";
import { ScreeningDetails } from "./pages/ScreeningDetails";
import { UserReservations } from "./pages/UserReservations";
import { User } from "lucide-react";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/screenings" element={<Screenings />} />
          <Route
            path="/screenings/:screeningId"
            element={<ScreeningDetails />}
          />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/reservations" element={<UserReservations />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
