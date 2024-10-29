import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SpinPage from "./pages/spinPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/spin" element={<SpinPage />} />
      </Routes>
    </Router>
  );
};

export default App;
