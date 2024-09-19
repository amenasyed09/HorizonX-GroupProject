import React from "react";
import { useState } from "react";
import Cookies from 'js-cookie'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
function PriceHelp  () {
    const navigate=useNavigate()
    const suggested_price = Cookies.get('model_params')
    const [price , setPrice] = useState(suggested_price)
    const data = JSON.parse(Cookies.get('data'))
    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log(data)
        try {
            data["price"] = price
            console.log(data);
            
            const response = await axios.post('http://127.0.0.1:8000/api/newProperty/', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.status == 201) {
                Cookies.remove('data');
                Cookies.remove('model_params');
                navigate("/")
            }
          } catch (error) {
            console.error('Error submitting property:', error);
            alert('Failed to submit property');
          }
    }

    return (
        <>
        
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Price</label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            value={price}
                            onChange={(e)=>{setPrice(e.target.value)}}
                            required
                        />
                    </div>
                    <div className="border--black" >
                        <input type="submit" className="border--black" value={"Submit"} />
                    </div>
                </div>
            </form >
            <h1>Suggested Selling Price according to your property features: {suggested_price}</h1>

        </>
    )
}
export default PriceHelp;