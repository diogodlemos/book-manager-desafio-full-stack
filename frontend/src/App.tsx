import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {LoginPage} from "./pages/LoginPage.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={"register"} element={<RegisterPage />} />
                    <Route path={"login"} element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/register" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    )
}

export default App