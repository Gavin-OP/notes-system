import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotePage from "../pages/NotePage";
import HomePage from "../pages/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/notes-system">
      <Routes>
        <Route path="note/:note_url" element={<NotePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
