import { useState } from 'react';
import "./Login.css";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Validate email and password
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            // Make API call to verify user credentials
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // User logged in successfully
                const userData = await response.json();
                onLogin(userData); // Pass user data to parent component
            } else {
                // Handle login error
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    const handleSignup = async () => {
        // Validate email and password
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            // Make API call to create new user
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // User signed up successfully, clear form fields
                setEmail('');
                setPassword('');
                setError('');
                // Optionally, you can navigate the user to the next step of the signup process
            } else {
                // Handle signup error
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            <p className='nav'><span style={{ fontSize: "30px", color: "#3103a3" }}>SCM</span> Hub </p>
            <div className="login-container"> 
                <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="error">{error}</div>
                <div>
                    <button onClick={isLoginMode ? handleLogin : handleSignup}>{isLoginMode ? 'Login' : 'Sign Up'}</button>
                </div>
                <div>
                    <button onClick={() => setIsLoginMode((prevMode) => !prevMode)}>
                        {isLoginMode ? 'Switch to Sign Up' : 'Switch to Login'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;
