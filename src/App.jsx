import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarbershopList from "./components/BarbershopList/BarbershopList";
import BarbershopDetail from "./components/BarbershopDetail/BarbershopDetail";
import Auth from "./components/Auth/Auth";
import Header from "./components/header/Header";
import Profile from "./components/profile/Profile";
function App() {
  return (
    <div className="wrapper">
      <Router>
        <Header />
        <main className="main">
          <Routes>
            {" "}
            <Route path="/" element={<BarbershopList />} />
            <Route path="/barbershops/:id" element={<BarbershopDetail />} />
            <Route path="/auth" element={<Auth />} />{" "}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </Router>{" "}
    </div>
  );
}

export default App;
