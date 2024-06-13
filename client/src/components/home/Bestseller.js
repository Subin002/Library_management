import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import Nav from '../Nav.js';
import Swal from 'sweetalert2';
function Bestseller() {
    const [bestsellerbookData, setBestsellerbookData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchBestsellerBooks = async () => {
        try {
          const response = await axios.get('http://localhost:1500/bestsellerbook');
          if (response.data && response.data.bestsellerbook) { // Corrected key
            setBestsellerbookData(response.data.bestsellerbook);
          } else {
            console.error('Invalid response format:', response.data);
          }
        } catch (error) {
          console.error('Error fetching international books:', error);
        }
      };

      fetchBestsellerBooks();
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
          <h2>BEST SELLER</h2>

          <div className='card-container03'>
            {bestsellerbookData.map((bestsellerbook, index) => (
              <div key={index} className='card03'>
                <img src={`http://localhost:1500/images/${bestsellerbook.image}`} alt='interbookimage' width={150} height={170} />
                <h5>{bestsellerbook.name}</h5>
                <p>{bestsellerbook.author}</p>
                <p className='description03'>{bestsellerbook.description}</p>

                <p className='price03'>{bestsellerbook.price}</p>
                <button className='addtocartbutton03' onClick={() => addToCart(bestsellerbook)}>Add to cart</button>
                <button className='buynowbutton03' onClick={() => handleBuy(bestsellerbook._id, bestsellerbook.price, bestsellerbook.name)}>Buy now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default Bestseller
