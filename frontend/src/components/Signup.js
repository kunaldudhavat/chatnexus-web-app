import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signUp } from '../actions/authActions';
import { HiChat } from 'react-icons/hi';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });
    const [touched, setTouched] = useState({
        password: false,
        confirmPassword: false
    });
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const dispatch = useDispatch();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const length = password.length >= 8;
        const lowercase = /[a-z]/.test(password);
        const uppercase = /[A-Z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[@$!%*?&]/.test(password);

        const isValid = length && lowercase && uppercase && number && specialChar;

        setPasswordCriteria({
            length,
            lowercase,
            uppercase,
            number,
            specialChar,
        });

        setIsPasswordValid(isValid);

        return isValid;
    };

    const validateUsername = (name) => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        return usernameRegex.test(name);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setSuccessMessage('');

        let newErrors = { ...errors };

        // Validate fields dynamically
        if (name === 'name') {
            if (!validateUsername(value)) {
                newErrors.name = 'Username can only contain letters, numbers, and underscores.';
            } else {
                newErrors.name = '';
            }
        }

        if (name === 'email') {
            if (!validateEmail(value)) {
                newErrors.email = 'Please enter a valid email address.';
            } else {
                newErrors.email = '';
            }
        }

        if (name === 'password') {
            if (!validatePassword(value)) {
                newErrors.password = 'Password must meet all criteria.';
            } else {
                newErrors.password = '';
            }
        }

        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match.';
            } else {
                newErrors.confirmPassword = '';
            }
        }

        setErrors(newErrors);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    const handleFocus = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (errors.name || errors.email || errors.password || errors.confirmPassword) {
            return;
        }

        try {
            await dispatch(signUp(formData));
            setSuccessMessage('Account creation successful');
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                name: ''
            });
            setErrors({ name: '', email: '', password: '', confirmPassword: '' });
            setPasswordCriteria({
                length: false,
                lowercase: false,
                uppercase: false,
                number: false,
                specialChar: false,
            });
            setTouched({
                password: false,
                confirmPassword: false
            });
        } catch (error) {
            setErrors({ ...errors, form: 'Account creation failed' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <HiChat className="text-3xl text-white mr-2" />
                    <h1 className="text-3xl font-bold text-white">ChatNexus</h1>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your name"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        {touched.password && !isPasswordValid && (
                            <ul className="text-sm mt-2">
                                <li className={`mb-1 ${passwordCriteria.length ? 'text-green-500' : 'text-red-500'}`}>
                                    Password must be at least 8 characters long
                                </li>
                                <li className={`mb-1 ${passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                                    Must contain at least one lowercase letter
                                </li>
                                <li className={`mb-1 ${passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                                    Must contain at least one uppercase letter
                                </li>
                                <li className={`mb-1 ${passwordCriteria.number ? 'text-green-500' : 'text-red-500'}`}>
                                    Must contain at least one number
                                </li>
                                <li className={`mb-1 ${passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                                    Must contain at least one special character (@$!%*?&)
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                            placeholder="Confirm your password"
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600">
                        Sign Up
                    </button>
                    {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}
                    {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
                </form>
                {successMessage && (
                    <div className="text-center mt-4">
                        <Link
                            to="/signin"
                            className="text-blue-500 hover:text-blue-300"
                        >
                            Go to Sign In
                        </Link>
                    </div>
                )}
                {!successMessage && (
                    <p className="text-gray-400 text-sm mt-4 text-center">
                        Already have an account?{' '}
                        <Link
                            to="/signin"
                            className="text-blue-500 hover:text-blue-300"
                        >
                            Sign In
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
