// import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import { UserContext } from "./context/UserContext";
import ReadStoryPage from "./pages/ReadStoryPage";

function App() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={user ? <DashboardPage /> : <AuthPage />} />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <AuthPage />}
        />
        <Route
          path="/dashboard/:sid/ReadStory"
          element={user ? <ReadStoryPage /> : <AuthPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
