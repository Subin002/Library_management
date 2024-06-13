import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdBookdata.css';
import Nav from '../../Nav';
import { useNavigate } from 'react-router-dom'; // Import Link and useNavigate for routing

function AdBookdata() {
  const [newbookData, setNewbookData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchNewBooks = async () => {
      try {
        const response = await axios.get('http://localhost:1500/getnewbook');
        if (response.data && response.data.books) {
          setNewbookData(response.data.books);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching new books:', error);
        setError('Error fetching new books: ' + error.message);
      }
    };

    fetchNewBooks();
  }, []);

  const handleDeleteConfirmation = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this Book?');
    if (isConfirmed) {
      handleDelete(id);
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:1500/deletenewbook/${id}`)
      .then(res => {
        setNewbookData(newbookData.filter(newbook => newbook._id !== id));
      })
      .catch(error => {
        console.error('Error deleting Book:', error);
        setError('Error deleting Book: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    navigate(`/newbookupdate/${id}`); // Navigate to update page with book ID
  };

  return (
    <div className='full06'>
      <Nav />
      <h2 className='h206'>NEW ARRIVALS</h2>
      <div className='table-container'>
        <table className='styled-table'>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Author</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Conditional rendering */}
            {newbookData.map(newbook => (
              <tr key={newbook._id}>
                <td><img src={`http://localhost:1500/images/${newbook.image}`} alt='newbookimage' width={100} height={100} /></td>
                <td>{newbook.name}</td>
                <td>{newbook.author}</td>
                <td className='description05'>{newbook.description}</td>
                <td>{newbook.price}</td>
                <td>
                  <button className='action-button' onClick={() => handleUpdate(newbook._id)}>Update</button>
                  <button className='action-button' onClick={() => handleDeleteConfirmation(newbook._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdBookdata;
