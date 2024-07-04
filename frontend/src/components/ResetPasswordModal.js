import React, { useState } from 'react';
import axios from 'axios';

const api_url = process.env.REACT_APP_API_URL;

const ResetPasswordModal = ({ closeModal, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
        const isPasswordValid = passwordRegex.test(password);
        assessPasswordStrength(password);

        setShowPasswordValidation(!isPasswordValid || password.length < 8);
    };

    const assessPasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength('Too short');
        } else if (password.length < 12) {
            setPasswordStrength('Weak');
        } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(password)) {
            setPasswordStrength('Strong');
        } else {
            setPasswordStrength('Medium');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            validatePassword(value);
        }
        setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${api_url}/auth/reset-password`, {
                token,
                password
            });

            if (response.data) {
                setMessage('Password reset successful');
                setErrorMessage('');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your new password"
                            required
                            onFocus={() => setShowPasswordValidation(true)}
                            onBlur={() => setShowPasswordValidation(false)}
                        />
                        {showPasswordValidation && (
                            <ul className="text-gray-400 text-sm">
                                <li className={password.match(/(?=.*[a-z])/) ? 'text-green-500' : 'text-red-500'}>
                                    At least one lowercase letter
                                </li>
                                <li className={password.match(/(?=.*[A-Z])/) ? 'text-green-500' : 'text-red-500'}>
                                    At least one uppercase letter
                                </li>
                                <li className={password.match(/(?=.*\d)/) ? 'text-green-500' : 'text-red-500'}>
                                    At least one number
                                </li>
                                <li className={password.match(/(?=.*[@$!%*?&])/) ? 'text-green-500' : 'text-red-500'}>
                                    At least one special character
                                </li>
                                <li className={password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                                    Minimum 8 characters
                                </li>
                            </ul>
                        )}
                        <p className="text-gray-400 text-sm">Strength: {passwordStrength}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Confirm your new password"
                            required
                        />
                        {password !== confirmPassword && confirmPassword.length > 0 && (
                            <p className="text-red-500 text-sm">Passwords do not match.</p>
                        )}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600">
                        Reset Password
                    </button>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                </form>
                <button onClick={closeModal} className="mt-4 text-gray-400 hover:text-white">Close</button>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
