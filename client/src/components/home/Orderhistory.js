import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../../components/Nav';

function Orderhistory() {
    const [orderedData, setOrderData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:1500/ordered');
                console.log('API response:', response.data); // Log the response to check the format
                
                // Check if the response data is an array and update the state accordingly
                if (Array.isArray(response.data)) {
                    setOrderData(response.data);
                } else if (response.data && response.data.books) {
                    setOrderData(response.data.books);
                } else {
                    console.error('Invalid response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching orders books:', error);
                setError('Error fetching orders books: ' + error.message);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className='full06'>
            <Nav />
            <h2 className='h207'>ORDER HISTORY</h2>
            <div className='orderhistory-container'>
                {error && <p className='error'>{error}</p>}
                <table className='order-styled-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Product Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderedData.length > 0 ? (
                            orderedData.map(ordered => (
                                <tr key={ordered._id}>
                                    <td>{ordered.name}</td>
                                    <td>{ordered.email}</td>
                                    <td className='order-description'>{ordered.address}</td>
                                    <td>{ordered.productname}</td>
                                    <td>{ordered.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No new books found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orderhistory
