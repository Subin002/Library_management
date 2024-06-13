import React from 'react';
import image02 from '../../images/02.png';
import './Adhome.css';
import { useNavigate } from 'react-router-dom';

function AdHome() {
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate('/orders');
  };

  const handleFeedback = () => {
    navigate('/feedback');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handlenewbook=()=>{
    navigate('/newbookform')
  }
  
  const handleinter=()=>{
    navigate('/interbookform')
  }

  const handlebest=()=>{
    navigate('/bestsellerform')
  }
  
  const handleaward=()=>{
    navigate('/awardwinsform')
  }



  return (
    <div>
      <div className='nav04'>
        <img src={image02} alt='image' height={50} />
        <h4 className='h4admin'>BOOK/GALLERY</h4>
        <h3 className='h304'>ADMIN_PAGE</h3>
        <div className='navright04'>
          <h6 className='h605'>Book</h6>
          <h6 className='h604' onClick={handleOrder}>Orders</h6>
          <h6 className='h604' onClick={handleFeedback}>Feedback</h6>
          <h6 className='h604' onClick={handleLogout}>Logout</h6>
        </div>
      </div>

      <div className='full04'>
        <div className='card-container'>
          <div className='card'  onClick={handlenewbook}>
            <h3>New Arrivals</h3>
          </div>

          <div className='card'  onClick={handleinter}>
            <h3>International</h3>
          </div>

          <div className='card'  onClick={handlebest}>
            <h3>Bestseller</h3>
          </div>

          <div className='card'  onClick={handleaward}>
            <h3>Award Wins</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdHome;
