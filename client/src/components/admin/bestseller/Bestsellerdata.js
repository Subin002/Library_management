import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../../Nav';
import { useNavigate } from 'react-router-dom';

function Bestsellerdata() {
    const [bestsellerbookData, setBestsellerbookData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBestsellerBooks = async () => {
            try {
                const response = await axios.get('http://localhost:1500/bestsellerbook');
                if (response.data && response.data.bestsellerbook) {
                    setBestsellerbookData(response.data.bestsellerbook);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching new books:', error);
                setError('Error fetching new books: ' + error.message);
            }
        };

        fetchBestsellerBooks();
    }, []);

    const handleDeleteConfirmation = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this Book?');
        if (isConfirmed) {
            handleDelete(id);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:1500/deletebestseller/${id}`)
            .then(res => {
                setBestsellerbookData(prevData => prevData.filter(bestsellerbook => bestsellerbook._id !== id));
            })
            .catch(error => {
                console.error('Error deleting Book:', error);
                setError('Error deleting Book: ' + error.message);
            });
    };

    const handleUpdate = (id) => {
        navigate(`/bestsellerupdate/${id}`);
    };

    return (
        <div className='full06'>
            <Nav />
            <h2 className='h206'>BEST SELLER</h2>
            {error && <div>Error: {error}</div>}
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
                        {bestsellerbookData.map(bestsellerbook => (
                            <tr key={bestsellerbook._id}>
                                <td><img src={`http://localhost:1500/images/${bestsellerbook.image}`} alt='newbookimage' width={100} height={100} /></td>
                                <td>{bestsellerbook.name}</td>
                                <td>{bestsellerbook.author}</td>
                                <td className='description05'>{bestsellerbook.description}</td>
                                <td>{bestsellerbook.price}</td>
                                <td>
                                    <button className='action-button' onClick={() => handleUpdate(bestsellerbook._id)}>Update</button>
                                    <button className='action-button' onClick={() => handleDeleteConfirmation(bestsellerbook._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Bestsellerdata;
