import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MomentForm from "./pages/MomentForm.jsx";
import MomentView from "./pages/MomentView.jsx";
import Memories from "./pages/Memories.jsx";
import MemoryDetail from "./pages/MemoryDetail.jsx";
import Analytics from "./pages/Analytics.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* public */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* protected */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/moments/new"
                    element={
                        <ProtectedRoute>
                            <MomentForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/moments/:id"
                    element={
                        <ProtectedRoute>
                            <MomentView />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/memories"
                    element={
                        <ProtectedRoute>
                            <Memories />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/memories/:id"
                    element={
                        <ProtectedRoute>
                            <MemoryDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
