import React, { useState, useEffect } from 'react';
import './paymentcard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import Swal from 'sweetalert2';
import image20 from '../../images/20.png';
import image21 from '../../images/21.png';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { price: queryPrice, name: queryName } = queryString.parse(location.search);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [debitCardNumber, setDebitCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (queryPrice) {
      setPrice(queryPrice);
    }
    if (queryName) {
      setProductName(queryName);
    }
  }, [queryPrice, queryName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [month, year] = expiryDate.split('/');
    const parsedExpiryDate = new Date(`20${year}-${month}-01`).getTime();

    const paymentDetails = {
      name,
      email,
      address,
      productname: productName,
      price,
      debitCardNumber,
      expiryDate: parsedExpiryDate,
      cvv
    };

    try {
      const response = await axios.post('http://localhost:1500/payment', paymentDetails);
      console.log('Payment successful:', response.data);

      // Show success alert using SweetAlert2 and navigate to home page on confirmation
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Thank you for your purchase.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/cart'); // Navigate to home page with the specified id
        }
      });

      // Clear the form fields
      setName('');
      setEmail('');
      setAddress('');
      setProductName('');
      setPrice('');
      setDebitCardNumber('');
      setExpiryDate('');
      setCvv('');
    } catch (error) {
      console.error('Payment failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h3 className='h309'>PAYMENT FORM</h3>
      <div className='payment-container09'>
        <div className="payment-card">
          <form onSubmit={handleSubmit}>
            <div className="card-header">
              <label htmlFor="name">Name:</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="address">Address:</label>
              <input 
                type="text" 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label htmlFor="productname">Product Name:</label>
              <input className='productname08'
                type="text" 
                id="productname" 
                value={productName}
                readOnly 
              />

              <div className="card-amount">
                <label htmlFor="amount" className='amount'>Amount:</label>
                <input 
                  type="text" 
                  id="amount" 
                  value={price}
                  readOnly 
                />
                <img src={image20} height="20" width="70" alt="Payment Logo" />
                <img src={image21} height="18" width="65" alt="Rupay Logo" />
              </div>

              <label htmlFor="debitCardNumber" className='debitcard09'>Debit Card Number:</label>
              <input 
                type="text" 
                id="debitCardNumber" 
                maxLength={16}
                value={debitCardNumber}
                onChange={(e) => setDebitCardNumber(e.target.value)}
              />

              <div className="card-expiry">
                <label htmlFor="expiryDate" className='expiryDate'>Expiry Date:</label>
                <input 
                  type="text" 
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />

                <label htmlFor="cvv" className='cvv'>CVV:</label>
                <input 
                  type="text" 
                  id="cvv" 
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>
            <button className='button09' type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
