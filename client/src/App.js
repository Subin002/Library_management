import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/home/home';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import AdHome from './components/admin/AdHome';
import AdBookform from './components/admin/newbook/AdBookform';
import AdBookdata from './components/admin/newbook/AdBookdata';
import AdBookUpdate from './components/admin/newbook/AdBookUpdate';
import Newarrivals from './components/home/Newarrivals';
import Interbookform from './components/admin/internationalbook/Interbookform';
import Interbookdata from './components/admin/internationalbook/Interbookdata';
import Interbookupdate from './components/admin/internationalbook/Interbookupdate';
import International from './components/home/International';
import Bestsellerform from './components/admin/bestseller/Bestsellerform';
import Bestsellerdata from './components/admin/bestseller/Bestsellerdata';
import Bestsellerupdate from './components/admin/bestseller/Bestsellerbookupdate'
import Bestseller from './components/home/Bestseller';
import Cart from './components/home/Cart';
import Feedback from './components/admin/feedback/feedback';
import Payment from './components/home/Payment';
import Awardwinsform from './components/admin/awardwins/Awardwinsform';
import Awardwindata from './components/admin/awardwins/Awardwindata';
import Awardwinsupdate from './components/admin/awardwins/Awardwinsupdate';
import Bestsellerbookupdate from './components/admin/bestseller/Bestsellerbookupdate';
import Awardwins from './components/home/Awardwins';
import Orders from './components/admin/Orders/Orders';
import Orderhistory from './components/home/Orderhistory';
import { useEffect, useState } from 'react';

function App() {
  const [user,setuser]=useState({});
  useEffect(()=>{
    setuser(JSON.parse(localStorage.getItem("user")))

  },[])
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/newarrivals" element={<Newarrivals />} />
          <Route path='/international' element={<International/>}/>
          <Route path='/bestseller' element={<Bestseller/>}/>
          <Route path='/awardwins' element={<Awardwins/>}/>

          <Route path='/cart' element={<Cart/>}/>
          <Route path='/orderhistory' element={<Orderhistory/>}/>
          <Route path='/paymentcard' element={<Payment/>}/>
          <Route path='/feedback' element={<Feedback/>}/>

          {/* ADMIN */}
          <Route path="/adminhome/:id" element={<AdHome />} />
          <Route path="/newbookform" element={<AdBookform />} />
          <Route path="/newbookdata" element={<AdBookdata />} />
          <Route path="/newbookupdate/:id" element={<AdBookUpdate />} />

          <Route path="/interbookform" element={<Interbookform />} />
          <Route path="/interbookdata" element={<Interbookdata />} />
          <Route path="/interbookupdate/:id" element={<Interbookupdate/>}/>

          <Route path='/bestsellerform' element={<Bestsellerform/>}/>
          <Route path='/bestsellerdata' element={<Bestsellerdata/>}/>
          <Route path='/bestsellerupdate/:id' element={<Bestsellerbookupdate/>}/>

          <Route path='/awardwinsform' element={<Awardwinsform/>}/>
          <Route path='/awardwinsdata' element={<Awardwindata/>}/>
          <Route path='/awardbookupdate/:id' element={<Awardwinsupdate/>}/>

          <Route path='/orders' element={<Orders/>}/>

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
