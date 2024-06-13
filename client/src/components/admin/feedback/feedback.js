import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../../Nav';
import './feedback.css'

function Feedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:1500/getfeedback');
        if (response.data) {
          setFeedbackData(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Error fetching feedback: ' + error.message);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className='full07'>
      <Nav />
      <h2 className='h207'>FEEDBACK</h2>
      <div className='table-container07'>
        {error && <p className='error-message'>{error}</p>}
        <table className='styled-table07'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map(userfeedback => (
              <tr key={userfeedback._id}>
                <td>{userfeedback.name}</td>
                <td>{userfeedback.email}</td>
                <td className='feedback07'>{userfeedback.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Feedback;
