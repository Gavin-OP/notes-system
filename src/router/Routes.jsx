import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoteLayout from "../common/layouts/NoteLayout";
import NotePage from "../pages/NotePage";
import HomePage from "../pages/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/notes-system">
      <Routes>
        <Route path="note/*" element={<NoteLayout />}>
          <Route path="*" element={<NotePage />} />
        </Route>
        <Route path="home" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
