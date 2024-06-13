import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../../Nav';
import { useNavigate } from 'react-router-dom';

function Interbookdata() {
    const [interbookData, setInterbookData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterBooks = async () => {
            try {
                const response = await axios.get('http://localhost:1500/getinterbook');
                if (response.data && response.data.interbook) {
                    setInterbookData(response.data.interbook);
                } else {
                    console.error('Invalid response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching new books:', error);
                setError('Error fetching new books: ' + error.message);
            }
        };

        fetchInterBooks();
    }, []);

    const handleDeleteConfirmation = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this Book?');
        if (isConfirmed) {
            handleDelete(id);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:1500/deleteinterbook/${id}`)
            .then(res => {
                setInterbookData(interbookData.filter(interbook => interbook._id !== id));
            })
            .catch(error => {
                console.error('Error deleting Book:', error);
                setError('Error deleting Book: ' + error.message);
            });
    };

    const handleUpdate = (id) => {
        navigate(`/interbookupdate/${id}`);
    };

    return (
        <div className='full06'>
            <Nav />
            <h2 className='h206'>INTERNATIONALS</h2>
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
                        {interbookData.map(interbook => (
                            <tr key={interbook._id}>
                                <td><img src={`http://localhost:1500/images/${interbook.image}`} alt='newbookimage' width={100} height={100} /></td>
                                <td>{interbook.name}</td>
                                <td>{interbook.author}</td>
                                <td className='description05'>{interbook.description}</td>
                                <td>{interbook.price}</td>
                                <td>
                                    <button className='action-button' onClick={() => handleUpdate(interbook._id)}>Update</button>
                                    <button className='action-button' onClick={() => handleDeleteConfirmation(interbook._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Interbookdata;
