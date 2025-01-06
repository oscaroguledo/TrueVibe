const { User } = require("../models/userModel");
const crypto = require('crypto');

const HEADER = {
    alg: 'HS256',
    type: 'JWT'
  };
  
// Base64Url encoding function
const base64UrlEncode = (data) => {
  const jsonString = JSON.stringify(data);
  const base64 = Buffer.from(jsonString).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Base64Url decoding function
const base64UrlDecode = (base64Url) => {
    // Replace URL-safe characters to get valid Base64 string
    const base64 = base64Url
      .replace(/-/g, '+')    // Replace '-' with '+'
      .replace(/_/g, '/')    // Replace '_' with '/'
      .concat('=');          // Add the '=' padding at the end (required for Base64)
  
    // Decode the Base64 string back to a buffer
    const buffer = Buffer.from(base64, 'base64');
  
    // Convert the buffer back to a JSON string
    const jsonString = buffer.toString('utf-8');
  
    // Parse and return the original object
    return JSON.parse(jsonString);
  };

// Function to generate HMAC SHA-256 signature
const generateSignature = (header, payload,duration, currentdatetime, secretKey) => {
  const data = `${header}.${payload}.${duration}.${currentdatetime}`;
  return crypto.createHmac('sha256', secretKey)
               .update(data)
               .digest('base64')
               .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Function to create JWT Token
const createJwtToken = (payload, secretKey, duration=86400) => {
    /**
     * Creates a JWT token from the provided header, payload, and other parameters.
     *
     * @param {Object} HEADER - The JWT header containing metadata (e.g., algorithm, token type).
     * @param {Object} payload - The JWT payload containing the claims (e.g., user data, expiry).
     * @param {string} secretKey - The secret key used for signing the token.
     * @param {number} [duration=86400] - The duration (in seconds) for the token's validity, default is 86400 seconds (1 day).
     * 
     * @returns {string} - The generated JWT token, which is a string in the format: 
     * 'Bearer <encodedHeader>.<encodedPayload>.<encodedDuration>.<signature>'.
     */

    // Encode the header using base64url encoding
    const encodedHeader = base64UrlEncode(HEADER);
    
    // Encode the payload using base64url encoding
    const encodedPayload = base64UrlEncode(payload);

    // Encode the duration (expiry time) using base64url encoding
    const encodedDuration = base64UrlEncode(duration);

    const encodedDateTime = base64UrlEncode(new Date().toISOString());


    // Generate the signature by concatenating encodedHeader, encodedPayload, and encodedDuration,
    // and then signing it using the secretKey.
    const signature = generateSignature(encodedHeader, encodedPayload, encodedDuration,encodedDateTime, secretKey);

    // Return the complete JWT token as a string in the 'Bearer' format.
    return `Bearer ${encodedHeader}.${encodedPayload}.${encodedDuration}.${encodedDateTime}.${signature}`;
};

// Function to verify JWT Token
const verifyJwtToken = (token, secretKey) => {
    const [encodedHeader, encodedPayload, encodedDuration,encodedDateTime, signature] = token.split('.');
    const expectedSignature = generateSignature(encodedHeader, encodedPayload, encodedDuration,encodedDateTime, secretKey);
    
    if (signature !== expectedSignature) {
        throw new Error('Invalid token');
    }
    
    // Decode the encoded date-time string back to original ISO string
    const decodedDateTimeString = JSON.parse(Buffer.from(encodedDateTime, 'base64').toString());

    // Convert the decoded ISO string to a JavaScript Date object
    const decodedDateTime = new Date(decodedDateTimeString);

    const currentDate = new Date();
    const duration = (currentDate - decodedDateTime)/ 1000;
    
    const decodedDuration = parseFloat(JSON.parse(Buffer.from(encodedDuration, 'base64').toString()));

    if (duration > decodedDuration) {
        throw new Error('Expired token');
    }
    const decodedPayload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
    return {decodedPayload, isvalid:true};
};

// Example usage


    // const payload = {
    //     _id:'677b40756770feaa9cfa357a',
    //     email: "johndoe@example.com",
    //     full_name: "John Doe",
    //     username: "johndoe",
    //     password_hash: "password12565",
    // };

    // const secretKey = payload.password_hash;

    // const token = createJwtToken(payload, secretKey);
    // console.log('Generated JWT Token:', token);


const IsAuthenticated = async (req,user) =>{
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return false
    }
    if (!authHeader.startsWith('Bearer ')){
      return false
    }
    const bearerToken = authHeader.slice(7, authHeader.length);
    try {
        const decoded = verifyJwtToken(bearerToken, user.password_hash);
        // console.log('Decoded Payload:', decoded);
        return decoded;
    } catch (err) {
        // console.error('Verification failed:', err.message);
        return false
        }
}

const Permission = async (req, isAdmin = false, isGuest = false) => {
    // Extract the user_id from the URL params
    const { user_id } = req.params;
  
    // If user_id is not present, immediately return false
    if (!user_id) {
      return false; // No user ID provided in the request parameters
    }
  
    try {
      // Fetch the user from the database using the user_id
      const user = await User.findOne({ id: user_id });
  
      // If user doesn't exist in the database, return false
      if (!user) {
        return false; // User with the provided ID was not found
      }
  
      // If isAdmin is true, check if the user is an 'admin'
      if (isAdmin === true && user.role !== 'admin') {
        return false; // User is not an admin, permission denied
      }
  
      // If isGuest is true, check if the user is a 'guest'
      if (isGuest === true && user.role !== 'guest') {
        return false; // User is not a guest, permission denied
      }
  
      // Check if the user is authenticated

      
      return IsAuthenticated(req,user);
  
    } catch (error) {
      // In case of any error (e.g., database issues), log and return false
    //   console.error("Error checking permissions:", error);
      return false;
    }
  };
  

module.exports ={Permission, createJwtToken};