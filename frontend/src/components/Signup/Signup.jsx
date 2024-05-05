import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";
import axios from "axios";

const Signup = ({ onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [businessDescription, setBusinessDescription] = useState('');
    const [transportationMethods, setTransportationMethods] = useState('');
    const [constraints, setConstraints] = useState('');
    const [error, setError] = useState('');

    const baseUrl = import.meta.env.VITE_BACKEND_URL

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!email || !password || !businessName || !businessType || !businessDescription || !transportationMethods || !constraints) {
            setError('Please fill in all fields');
            return;
        }

        try {
            // Make API call to store form data
            const businessDetails = {
                "businessName":businessName,
                "businessType":businessType,
                "businessDescription":businessDescription,
                "transportationMethods":transportationMethods,
                "constraints":constraints
            }
            const userData = {
                email,
                password,
                businessDetails
            };
            const response = await axios.post(`${baseUrl}/api/auth/signup`, userData);
            
            if (response.status == 201) {
                // Form data submitted successfully, clear form fields
                setEmail('');
                setPassword('');
                setBusinessName('');
                setBusinessType('');
                setBusinessDescription('');
                setTransportationMethods('');
                setConstraints('');
                setError('');
                onSignup(userData);
                // Optionally, you can show a success message or navigate to another page
            } else {
                // Handle form submission error
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container"> 
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className='signup-form'>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>Business Name:</label>
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>
                <div>
                    <label>Business Type:</label>
                    <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
                </div>
                <div>
                    <label>Business Description:</label>
                    <textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} />
                </div>
                <div>
                    <label>Transportation Methods:</label>
                    <input type="text" value={transportationMethods} onChange={(e) => setTransportationMethods(e.target.value)} />
                </div>
                <div>
                    <label>Constraints:</label>
                    <textarea value={constraints} onChange={(e) => setConstraints(e.target.value)} />
                </div>
                <div className="error">{error}</div>
                <button className='submit' type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Signup;
