import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Remove Navigate import
import axios from 'axios';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Change Navigate to navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:1500/signup', {
                name: name,
                email: email,
                password: password
            });

            console.log(response.data);
            // Handle successful signup, e.g., redirect to another page
            navigate('/login'); // Navigate to login page after successful signup

        } catch (error) {
            console.error('Error during signup:', error.message);
            // Handle signup error, e.g., display error message to the user
        }
    };

    return (
        <div className='full01'>
            <h2 className='h201'>SIGNUP FORM</h2>
            <div className='container01'>
                <form className='form01' onSubmit={handleSubmit}>
                    <div className='box01'>
                        <label>Name:</label>
                        <input
                            autoComplete='on'
                            name='name'
                            className='form-control rounded-0'
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />
                        <br />
                        <label>Email ID:</label>
                        <input
                            autoComplete='email'
                            name='email'
                            className='form-control rounded-0'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br />
                        <br />
                        <label>Password:</label>
                        <input
                            autoComplete='off'
                            name='password'
                            type='password'
                            className='form-control rounded-0'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br />   
                        <br />
                        <button type='submit' className='signup01'>Signup</button>
                    </div>
                </form>
                <p className='q01'>Already have an account?</p>
                <Link to="/login" className='login01'>Login</Link>
            </div>
        </div>
    );
}

export default Signup;
