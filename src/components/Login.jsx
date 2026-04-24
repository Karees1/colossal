import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
    );
};
export default Login;