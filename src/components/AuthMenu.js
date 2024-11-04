import React, { useState } from 'react';
import './AuthMenu.css';

const AuthMenu = ({ isAuthenticated, currentUser, onLogin, onRegister, onLogout }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            if (showLogin) {
                await onLogin(email, password);
            } else {
                await onRegister(email, password);
            }
            setEmail('');
            setPassword('');
            setIsExpanded(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-menu">
            {isAuthenticated ? (
                <div className="auth-user">
                    <span>{currentUser}</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            ) : (
                <>
                    <button className="auth-toggle" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? '❌' : '👤'}
                    </button>
                    {isExpanded && (
                        <div className="auth-form-container">
                            <div className="auth-tabs">
                                <button 
                                    className={showLogin ? 'active' : ''} 
                                    onClick={() => setShowLogin(true)}
                                >
                                    Login
                                </button>
                                <button 
                                    className={!showLogin ? 'active' : ''} 
                                    onClick={() => setShowLogin(false)}
                                >
                                    Register
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {error && <div className="auth-error">{error}</div>}
                                <button type="submit">
                                    {showLogin ? 'Login' : 'Register'}
                                </button>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AuthMenu;