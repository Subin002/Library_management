import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav';
import Swal from 'sweetalert2';
import './home.css';
import image04 from '../../images/04.jpg';
import image05 from '../../images/08.png';
import image09 from '../../images/09.png';
import image10 from '../../images/10.png';
import image11 from '../../images/11.png';
import image12 from '../../images/12.png';
import image15 from '../../images/15.jpg';
import image17 from '../../images/17.png';

function Home() {
  const [newbookData, setNewbookData] = useState([]);
  const [interbookData, setInterbookData] = useState([]);
  const [bestsellerbookData, setBestsellerbookData] = useState([]);
  const [awardbookData, setAwardbookData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllInter, setShowAllInter] = useState(false);
  const [showAllBestseller, setShowAllBestseller] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);
  const [feedback, setFeedback] = useState({ name: '', email: '', feedback: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [newBooksResponse, interBooksResponse, bestsellerBookResponse, awardBookResponse] = await Promise.all([
          axios.get('http://localhost:1500/getnewbook'),
          axios.get('http://localhost:1500/getinterbook'),
          axios.get('http://localhost:1500/bestsellerbook'),
          axios.get('http://localhost:1500/getawardbook')
        ]);

        console.log('New Books Response:', newBooksResponse.data);
        console.log('Inter Books Response:', interBooksResponse.data);
        console.log('Bestseller Books Response:', bestsellerBookResponse.data);
        console.log('Award Books Response:', awardBookResponse.data);

        if (newBooksResponse.data?.books) {
          setNewbookData(newBooksResponse.data.books);
        } else {
          console.error('Invalid new books response format:', newBooksResponse.data);
        }

        if (interBooksResponse.data?.interbook) {
          setInterbookData(interBooksResponse.data.interbook);
        } else {
          console.error('Invalid international books response format:', interBooksResponse.data);
        }

        if (bestsellerBookResponse.data?.bestsellerbook) {
          setBestsellerbookData(bestsellerBookResponse.data.bestsellerbook);
        } else {
          console.error('Invalid bestseller books response format:', bestsellerBookResponse.data);
        }

        if (awardBookResponse.data?.books) {
          setAwardbookData(awardBookResponse.data.books);
        } else {
          console.error('Invalid award books response format:', awardBookResponse.data);
        }

      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const visibleNewBooks = showAllNew ? newbookData : newbookData.slice(0, 5);
  const visibleInterBooks = showAllInter ? interbookData : interbookData.slice(0, 5);
  const visibleBestsellerBooks = showAllBestseller ? bestsellerbookData : bestsellerbookData.slice(0, 5);
  const visibleAwardBooks = showAllAwards ? awardbookData : awardbookData.slice(0, 5);

  const handleSeeAllNew = () => navigate('/newarrivals');
  const handleSeeAllInter = () => navigate('/international');
  const handleSeeAllBestseller = () => navigate('/bestseller');
  const handleSeeAllAwards = () => navigate('/awardwins');
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user._id;
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
     
    
      await axios.post(`http://localhost:1500/postcart/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Display success alert using SweetAlert
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '',
        text: `Added to cart!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Display error alert using SweetAlert
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Oops...',
        text: `Failed to add to cart. Please try again.${id}`,
      })
    }
  };
  const handleBuy = (id, price, name) => {
    axios.post(`http://localhost:1500/paymentcard?id=${id}&price=${price}&name=${encodeURIComponent(name)}`)
        .then((res) => {
            console.log("payment...");
        })
        .catch((err) => {
            console.log(err);
        });
};

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1500/feedback', feedback);
      Swal.fire({
        title: 'Thank you!',
        text: 'Thank you for your feedback!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success',
        },
        buttonsStyling: false,
      });
      setFeedback({ name: '', email: '', feedback: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit feedback. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className='home-container'>
      <div className='nav03'>
        <Nav  />
      </div>

      <div className='container03'>
        <div className="carousel" style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}>
          <img src={image04} alt='image04' />
          <img src={image05} alt='image05' />
          <img src={image15} alt='image15' />
        </div>
      </div>

      <hr className='hr03' />
      <div className='badges03'>
        <div className='badge4'>
          <a href='#newarrivals'><img src={image12} alt='image12' className='image12' /></a>
          <h4>New Arrivals</h4>
        </div>
        <div className='badge2'>
          <a href='#international'><img src={image10} alt='image10' className='image10' /></a>
          <h4>International</h4>
        </div>
        <div className='badge3'>
          <a href='#bestseller'><img src={image11} alt='image11' className='image11' /></a>
          <h4>Best seller</h4>
        </div>
        <div className='badge1'>
          <a href='#awardwins'><img src={image09} alt='image09' className='image09' /></a>
          <h4>Award wins</h4>
        </div>
      </div>
      <hr className='hr03' />
      <h6 id='newarrivals' className='homequotes'>"Discover new perspectives through the power of reading"</h6>

      <h2 className='card-h203' >NEW ARRIVALS</h2>
      <div className='card-container03'>
        {visibleNewBooks.map((newbook, index) => (
          <div key={index} className='card03'>
            <img src={`http://localhost:1500/images/${newbook.image}`} alt='newbookimage' width={140} height={150} />
            <h5>{newbook.name}</h5>
            <p>{newbook.author}</p>
            <p className='description03'>{newbook.description}</p>
            <p className='price03'>{newbook.price}</p>
            <button className='addtocartbutton03' onClick={() => addToCart(newbook)}>Add to cart</button>
            <button className='buynowbutton03' onClick={() => handleBuy(newbook._id, newbook.price, newbook.name)}>Buy now</button>
          </div>
        ))}
      </div>
      {!showAllNew && (
        <button className='seeall03' onClick={handleSeeAllNew}>See All</button>
      )}

      <hr />
      <h6 id='international' className='homequotes02'>"The journey of a lifetime starts with the turning of a page."</h6>

      <h2 >INTERNATIONAL</h2>
      <div className='card-container03'>
        {visibleInterBooks.map((interbook, index) => (
          <div key={index} className='card03'>
            <img src={`http://localhost:1500/images/${interbook.image}`} alt='interbookimage' width={140} height={150} />
            <h5>{interbook.name}</h5>
            <p>{interbook.author}</p>
            <p className='description03'>{interbook.description}</p>
            <p className='price03'>{interbook.price}</p>
            <button className='addtocartbutton03' onClick={() => addToCart(interbook)}>Add to cart</button>
            <button className='buynowbutton03' onClick={() => handleBuy(interbook._id, interbook.price, interbook.name)}>Buy now</button>
          </div>
        ))}
      </div>
      {!showAllInter && (
        <button className='seeall03' onClick={handleSeeAllInter}>See All</button>
      )}

      <hr />
      <h6 id='bestseller' className='homequotes03'>"Books are a uniquely portable magic." - Stephen King </h6>

      <h2 >BEST SELLER</h2>
      <div className='card-container03'>
        {visibleBestsellerBooks.map((bestsellerbook, index) => (
          <div key={index} className='card03'>
            <img src={`http://localhost:1500/images/${bestsellerbook.image}`} alt='bestsellerbookimage' width={140} height={150} />
            <h5>{bestsellerbook.name}</h5>
            <p>{bestsellerbook.author}</p>
            <p className='description03'>{bestsellerbook.description}</p>
            <p className='price03'>{bestsellerbook.price}</p>
            <button className='addtocartbutton03' onClick={() => addToCart(bestsellerbook)}>Add to cart</button>
            <button className='buynowbutton03' onClick={() => handleBuy(bestsellerbook._id, bestsellerbook.price, bestsellerbook.name)}>Buy now</button>
          </div>
        ))}
      </div>
      {!showAllBestseller && (
        <button className='seeall03' onClick={handleSeeAllBestseller}>See All</button>
      )}

      <hr />
      <h6 id='awardwins' className='homequotes04'>“There is always something left to love”</h6>

      <h2 >AWARD WINS</h2>
      <div className='card-container03'>
        {visibleAwardBooks.map((awardbook, index) => (
          <div key={index} className='card03'>
            <img src={`http://localhost:1500/images/${awardbook.image}`} alt='awardbookimage' width={140} height={150} />
            <h5>{awardbook.name}</h5>
            <p>{awardbook.author}</p>
            <p className='description03'>{awardbook.description}</p>
            <p className='price03'>{awardbook.price}</p>
            <button className='addtocartbutton03' onClick={() => addToCart(awardbook)}>Add to cart</button>
            <button className='buynowbutton03' onClick={() => handleBuy(awardbook._id, awardbook.price, awardbook.name)}>Buy now</button>
          </div>
        ))}
      </div>
      {!showAllAwards && (
        <button className='seeall03' onClick={handleSeeAllAwards}>See All</button>
      )}
      <hr className='hr03' />

      <div className='feedbackform'>
        <form className='feedback03' onSubmit={handleFeedbackSubmit}>
          <div className='fdimg'><img src={image17} alt='feedbackimage' width={170} height={150} /></div>
          <div className='fdform'>
            <div className='fdname'>
              <label>Name:</label>
              <input
                type='text'
                name='name'
                value={feedback.name}
                onChange={handleFeedbackChange}
              />
            </div>
            <div className='fdemail'>
              <label>Email:</label>
              <input
                type='text'
                name='email'
                value={feedback.email}
                onChange={handleFeedbackChange}
              />
            </div>
            <div className='fdfeedback'>
              <label>Feedback:</label>
              <input
                type='text'
                name='feedback'
                value={feedback.feedback}
                maxLength={220}
                onChange={handleFeedbackChange}
              />
            </div>
          </div>
          <button className='fdsubmit' type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
