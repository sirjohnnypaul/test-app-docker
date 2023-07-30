import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../components/Home/Home";

export const Routing = () => (
    <Router>
        <Routes>
            <Route path='/' element={<Home />} />
        </Routes>
    </Router>
);
