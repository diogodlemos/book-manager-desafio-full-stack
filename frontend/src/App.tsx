import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {LoginPage} from "./pages/LoginPage.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {PrivateRoute} from "./components/PrivateRoute.tsx";
import {Layout} from "./components/Layout.tsx";
import {BooksPage} from "./pages/BooksPage.tsx";
import {BookNewPage} from "./pages/BookNewPage.tsx";
import {BookEditPage} from "./pages/BookEditPage.tsx";
import {AuthorsPage} from "./pages/AuthorsPage.tsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={"register"} element={<RegisterPage />} />
                    <Route path={"login"} element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/register" replace />} />

                    <Route element={<PrivateRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/books" element={<BooksPage />} />
                            <Route path="/books/new" element={<BookNewPage />} />
                            <Route path="/books/:id/edit" element={<BookEditPage />} />
                            <Route path="/authors" element={<AuthorsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    )
}

export default App