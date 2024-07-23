import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log to check form submission

    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    setLoading(true);
    setIncorrectPassword(false);
    setUserNotFound(false);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:1500/login', { email, password });
      setLoading(false);
      console.log('Response received:', response.data);
      localStorage.setItem("user",JSON.stringify(response.data))// Debug log to check response

      const userData = {
        name: response.data.name,
        email: response.data.email,
        isAdmin: response.data.isAdmin,
        _id: response.data._id,
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('Login successful', response.data);

      if (response.data.isAdmin) {
        navigate(`/adminhome/${response.data._id}`);
      } else {
        // navigate(`/home/${response.data._id}`);
        navigate('/home');
     
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);

      if (err.response && err.response.status === 400) {
        if (err.response.data.error === 'Incorrect password') {
          setIncorrectPassword(true);
        } else if (err.response.data.error === 'User not found') {
          setUserNotFound(true);
        }
      } else {
        console.error('An unexpected error occurred:', err);
      }
    }
  };

  const handleSignup = () => {
    navigate('/');
  };

  return (
    <div className='full01'>
      <h2 className='h201'>LOGIN FORM</h2>
      <div className='container01'>
        <form className='form01' onSubmit={handleSubmit}>
          <div className='box01'>
            <label>E-mail ID:</label>
            <input
              name='email'
              className='form-control rounded-0'
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='box01'>
            <label>Password:</label>
            <input
              autoComplete='off'
              name='password' // Corrected name attribute
              type='password'
              className='form-control rounded-0'
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' className='login01' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        {errorMessage && <p className='alert01'>{errorMessage}</p>}
        {incorrectPassword && <p className='alert01'>Incorrect email or password. Please try again.</p>}
        {userNotFound && <p className='alert01'>User not found. Please sign up first.</p>}
        <p className='q01'>Do not have an account?</p>
        <button onClick={handleSignup} className='signup01'>Sign up</button>
      </div>
    </div>
  );
}

export default Login;
