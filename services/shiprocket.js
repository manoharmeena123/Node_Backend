const axios = require("axios");

// Set your Shiprocket API key here
const API_KEY = "your_api_key_here";

// Set the endpoint URL for the Pincode Serviceability API
const url = "https://apiv2.shiprocket.in/v1/external/courier/serviceability/";

// Function to check pincode serviceability
const checkPincodeServiceability = (pickupPincode, deliveryPincode) => {
    // Set the payload for the API request
    const payload = {
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
    };

    // Set the headers for the API request
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
    };

    // Make the API request and get the response
    return axios
        .post(url, payload, { headers })
        .then((response) => {
            // Parse the JSON response
            const data = response.data;

            // Check if the API request was successful
            if (data.success === true) {
                // Check if the service is available for the given pin code
                if (data.data.is_available === true) {
                    return {
                        serviceAvailable: true,
                        timeToDeliver:
                            data.data.time_min +
                            " - " +
                            data.data.time_max +
                            " days.",
                    };
                } else {
                    return {
                        serviceAvailable: false,
                        message:
                            "Service not available for the given pin codes.",
                    };
                }
            } else {
                return {
                    serviceAvailable: false,
                    message: "Error: " + data.message,
                };
            }
        })
        .catch((error) => {
            return {
                serviceAvailable: false,
                message: "Error: " + error.message,
            };
        });
};
module.exports = { checkPincodeServiceability };

// Example usage
checkPincodeServiceability("110020", "560068")
    .then((result) => {
        if (result.serviceAvailable) {
            console.log("Shipping service is available.");
            console.log("Time to deliver:", result.timeToDeliver);
        } else {
            console.log("Shipping service is not available.");
            console.log(result.message);
        }
    })
    .catch((error) => {
        console.log("Error:", error.message);
    });
