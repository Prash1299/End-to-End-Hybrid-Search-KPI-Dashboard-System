import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import "./App.css";

import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Analytics from "./pages/Analytics";
import Evaluation from "./pages/Evaluation";
import Debug from "./pages/Debug";
import Architecture from "./pages/Architecture";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Navbar />

      <main className="page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="/architecture" element={<Architecture />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;