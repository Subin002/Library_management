import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import image02 from '../../images/02.png';
import './cart.css';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [bookData, setInterbookData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:1500/getcart');
                if (response.data && Array.isArray(response.data)) {
                    setInterbookData(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching new books:', error);
                setError('Error fetching new books: ' + error.message);
            }
        };

        fetchBooks();
    }, []);

    const handleRemove = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this Book?');
        if (isConfirmed) {
            axios.delete(`http://localhost:1500/deletecart/${id}`)
                .then(res => {
                    setInterbookData(bookData.filter(book => book._id !== id));
                })
                .catch(error => {
                    console.error('Error deleting Book:', error);
                    setError('Error deleting Book: ' + error.message);
                });
        }
    };

    const handleBuy = (id, price, name) => {
        navigate(`/paymentcard/${id}?price=${price}&name=${encodeURIComponent(name)}`);
    };
    const [openProfile, setOpenProfile] = useState(false);

    const handlelogout = () => {
        navigate('/');
    };

    const handleDropdown = () => {
        setOpenProfile(!openProfile); // Toggles the state
    };

    const handleOrderhistory = () => {
        navigate('/orderhistory');
    };
    const DropdownProfile = () => {
        return (
            <div className='dropDownProfile'>
                <ul className='flex flex-col gap-4 ul02'>
                    <ul className='about02'>About</ul>
                    <ul className='contact02'>Contact</ul>
                    <ul onClick={handlelogout} className='logout02'>Logout</ul>
                </ul>
            </div>
        );
    };

    return (
        <div className='full08'>
          <div className='navcontainer02 navbar-expand-lg navbar-light bg-light fixed-top'>
            <div className='nav02'>
                <img src={image02} alt='logo' height={50} />
                <h4 className='h402cart'>BOOK/GALLERY</h4>
                <div className='navright02'>
                    <div className='orderhistory' onClick={handleOrderhistory}>Order-History</div>
                    <img className='img202' src='https://kalytapartners.com/images/icon-menu.png' alt='menu' height={30} onClick={handleDropdown} />
                    {openProfile && <DropdownProfile />}
                </div>
            </div>
            <hr />
        </div>
            <h2 className='h208'>CART</h2>
            <div className='table-container08'>
                <table className='styled-table08'>
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
                        {bookData.map(book => (
                            <tr key={book._id}>
                                <td><img src={`http://localhost:1500/images/${book.image}`} alt='newbookimage' width={100} height={100} /></td>
                                <td>{book.name}</td>
                                <td>{book.author}</td>
                                <td className='description08'>{book.description}</td>
                                <td>{book.price}</td>
                                <td>
                                    <button className='action-button08' onClick={() => handleBuy(book._id, book.price, book.name)}>Buy</button>
                                    <button className='action-button08' onClick={() => handleRemove(book._id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Cart;
