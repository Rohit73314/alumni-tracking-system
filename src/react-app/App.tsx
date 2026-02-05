import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// @ts-ignore
import AlumniDirectory from "@/react-app/pages/AlumniDirectory.jsx";
// @ts-ignore
import Events from "@/react-app/pages/Events.jsx";
// @ts-ignore
import Network from "@/react-app/pages/Network.jsx";
// @ts-ignore
import Admin from "@/react-app/pages/Admin.jsx";

export default function App() {
  return (
    <Router basename="/alumni-tracking-system">
      <Routes >
        <Route path="/" element={<AlumniDirectory />} />
        <Route path="/events" element={<Events />} />
        <Route path="/network" element={<Network />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
