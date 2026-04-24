import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', user_type: 'user' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.password, formData.user_type);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to register');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
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
                <div className="form-group">
                    <label>User Type</label>
                    <select name="user_type" value={formData.user_type} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};
export default Register;