import React, { useState } from 'react';
import { HiChat } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ForgotPasswordModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // forgot password logic to be added here
        setMessage('Please check your email for the password reset link if the email entered is correct.');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <HiChat className="text-3xl text-white mr-2" />
                    <h1 className="text-3xl font-bold text-white">ChatNexus</h1>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600">
                        Reset Password
                    </button>
                    {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                </form>
                <p className="text-gray-400 text-sm mt-4 text-center">
                    <Link to="/signin" className="text-blue-500 hover:text-blue-300">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
