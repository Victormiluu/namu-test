import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeScreen from "./pages/home";
import ContentDetailScreen from "./pages/contendDetail";
import PageNotFound from "./pages/pageNotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />

        <Route
          path="/contents/:id"
          element={<ContentDetailScreen />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}