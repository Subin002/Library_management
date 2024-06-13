import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import Nav from '../Nav.js';
import Swal from 'sweetalert2';

function Newarrivals() {
  const [newbookData, setNewbookData] = useState([]);
  const navigate=useNavigate();

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
      }
    };

    fetchNewBooks();
  }, []); // Empty dependency array ensures useEffect runs only once
  
  const addToCart = async (book) => {
    try {
      // Fetch the image file from the server
      const imageResponse = await axios.get(`http://localhost:1500/images/${book.image}`, {
        responseType: 'arraybuffer',
      });
  
      // Convert the image data to a Blob
      const imageBlob = new Blob([imageResponse.data], { type: 'image/jpeg' });
  
      // Create a File object from the Blob
      const imageFile = new File([imageBlob], book.image, { type: 'image/jpeg' });
  
      const formData = new FormData();
      formData.append('name', book.name);
      formData.append('author', book.author);
      formData.append('description', book.description);
      formData.append('price', book.price);
      formData.append('image', imageFile);
  
      // Debugging: log FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      await axios.post('http://localhost:1500/postcart', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        toast: true, // make it a toast notification
        position: 'top-end', // position at top-end of the screen
        icon: 'success',
        title: '', // no title, just an icon
        text: `Added to cart!`, // short and sweet text
        showConfirmButton: false, // no confirm button needed
        timer: 1500,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };
  const handleBuy = (id, price, name) => {
    navigate(`/paymentcard/${id}?price=${price}&name=${encodeURIComponent(name)}`);
};

  return (
    <div>
      <div className='nav03'>
        <Nav />
      </div>

      <div className='viewallbook04'>
      <h2>NEW ARRIVALS</h2>

        <div className='card-container03'>
          {/* Conditional rendering */}
          {newbookData.map((newbook, index) => (
            <div key={index} className='card03'>
              <img src={`http://localhost:1500/images/${newbook.image}`} alt='newbookimage' width={150} height={170} />
              <h5>{newbook.name}</h5>
              <p>{newbook.author}</p>
              <p className='description03'>{newbook.description}</p>

              <p className='price03'>{newbook.price}</p>
              <button className='addtocartbutton03' onClick={() => addToCart(newbook)}>Add to cart</button>
              <button className='buynowbutton03' onClick={() => handleBuy(newbook._id, newbook.price, newbook.name)}>Buy now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Newarrivals;
