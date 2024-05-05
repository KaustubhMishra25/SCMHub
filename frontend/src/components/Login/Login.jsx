import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import axios from "axios";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');

    const baseUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate();
    const handleLogin = async () => {
        // Validate email and password
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            // Make API call to verify user credentials
            const response = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
            console.log(response);
            if (response.status == 200) {
                // User logged in successfully
                const userData =  response.data.user;
                onLogin(userData); // Pass user data to parent component
            } else {
                // Handle login error
                const errorMessage = await response.message;
                setError(errorMessage);
            }
            navigate("/home");
        } catch (error) {
            if(error.response.data.message == "User does not exist!"){
                setError(error.response.data.message);
                console.log("routing to signup!");
                onLogin("User does not exist!");
            }
            console.error('Error logging in:', error);
            setError(error.response.data.message);
        }
    };


    return (
        <>
        <div className="login-container"> 
            <p className='nav'><span style={{ fontSize: "30px", color: "#3103a3" }}>SCM</span> Hub </p>
            
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
