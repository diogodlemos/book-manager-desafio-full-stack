import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {LoginPage} from "./pages/LoginPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"register"} element={<RegisterPage />} />
                <Route path={"login"} element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/register" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App