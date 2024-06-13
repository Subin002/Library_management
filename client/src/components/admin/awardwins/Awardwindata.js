import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../../Nav';
import { useNavigate } from 'react-router-dom';

function Awardwindata() {
    const [awardbookData, setAwardbookData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNewBooks = async () => {
            try {
                const response = await axios.get('http://localhost:1500/getawardbook');
                if (response.data && response.data.books) {
                    setAwardbookData(response.data.books);
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
        axios.delete(`http://localhost:1500/deleteawardbook/${id}`)
            .then(res => {
                setAwardbookData(awardbookData.filter(awardbook => awardbook._id !== id));
            })
            .catch(error => {
                console.error('Error deleting Book:', error);
                setError('Error deleting Book: ' + error.message);
            });
    };

    const handleUpdate = (id) => {
        navigate(`/awardbookupdate/${id}`);
    };

    return (
        <div className='full06'>
            <Nav />
            <h2 className='h206'>AWARD WINS</h2>
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
                        {awardbookData.map(awardbook => (
                            <tr key={awardbook._id}>
                                <td><img src={`http://localhost:1500/images/${awardbook.image}`} alt='newbookimage' width={100} height={100} /></td>
                                <td>{awardbook.name}</td>
                                <td>{awardbook.author}</td>
                                <td className='description05'>{awardbook.description}</td>
                                <td>{awardbook.price}</td>
                                <td>
                                    <button className='action-button' onClick={() => handleUpdate(awardbook._id)}>Update</button>
                                    <button className='action-button' onClick={() => handleDeleteConfirmation(awardbook._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Awardwindata;
