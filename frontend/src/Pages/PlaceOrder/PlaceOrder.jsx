import React, { useContext, useEffect, useState,} from 'react'
import {useNavigate} from "react-router-dom"
import "./PlaceOrder.css"
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'


const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

      console.log("Full response:", response);  // Log the full response
      console.log("Response data:", response.data);  // Log the response data

      if (response.data && response.data.success) {
        const { session_url } = response.data;
        console.log("session_url:", session_url);  // Log the session_url
        if (session_url) {
          window.location.replace(session_url);
        } else {
          console.log("Invalid session_url");
          alert("Invalid session URL");
        }
      } else {
        alert("Error: " + (response.data.message || "Unknown error"));
        console.log("Current URL:", window.location.href);
        console.log("Response data:", response.data);  // Log the entire response data for debugging
      }
    } catch (error) {
      console.error("Error placing order:", error);  // Log any error from the request
      alert("An error occurred while placing the order.");
    }
  }

  const navigate = useNavigate()


  useEffect(()=>{
    if (!token) {
      navigate("/cart")
    }
    else if(getTotalCartAmount()===0)
    {
      navigate("/cart")
    }
  },[token])



  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First Name'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last Name'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email address'/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street'/>
        <div className='multi-fields'>
          <input required name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State'/>
        </div>
        <div className='multi-fields'>
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone'/>
      </div>
      <div className='place-order-right'>
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )

}


export default PlaceOrder