import React from "react";
import Cookies from 'js-cookie'
function PriceHelp  () {

    const ModelPrice = Cookies.get('model_params')

    return (
        <>
            <form action="">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Price</label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            name="price"
                            // value={propertyData.price}
                            // onChange={handleInputChange}
                            placeholder="Price"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            required
                        />
                    </div>
                </div>
            </form >
            <h1>Suggested Selling Price according to your property features: {ModelPrice}</h1>

        </>
    )
}
export default PriceHelp;