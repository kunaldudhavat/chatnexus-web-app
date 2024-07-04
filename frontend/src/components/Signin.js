import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiChat } from 'react-icons/hi';
import { authApi } from '../api/api';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFocus = () => {
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authApi.signIn(formData);
            const { jwt } = response.data;
            if (jwt) {
                localStorage.setItem('token', jwt);
                dispatch({ type: 'SIGN_IN_SUCCESS' });
                navigate('/');
            } else {
                throw new Error('Token not found in response');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <HiChat className="text-3xl text-white mr-2" />
                    <h1 className="text-3xl font-bold text-white">ChatNexus</h1>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600">
                        Sign In
                    </button>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                </form>
                <p className="text-gray-400 text-sm mt-4 text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-300">Sign up</Link>
                </p>
                <p className="text-gray-400 text-sm mt-2 text-center">
                    <Link to="/forgot-password" className="text-blue-500 hover:text-blue-300">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
