import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import MainChat from './components/MainChat';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchUser } from './actions/authActions';

const App = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUser());
        }
    }, [isAuthenticated, dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/forgot-password" element={<ForgotPasswordModal />} />
                <Route path="/reset-password/:token" element={<ResetPasswordModal />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainChat />
                        </ProtectedRoute>
                    }
                />
                {/* Redirect any unknown routes to signin if not authenticated */}
                <Route
                    path="*"
                    element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/signin" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
