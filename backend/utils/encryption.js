const crypto = require('crypto');

// Function to generate a random salt
const generateSalt = (length = 16) => {
  return crypto.randomBytes(length).toString('hex');  // Generate a random hex salt
};

// Function to hash a password with a salt
// Hash password with a work factor (key stretching)
const hashPassword = async (password, salt) => {
    let hashed = password;  // Start with the password as the initial value

    // Apply the hash workFactor number of times (key stretching)
    const hash = crypto.createHmac('sha256', salt);  // Create SHA-256 HMAC with the salt
    hash.update(hashed);  // Update the hash with the current password (or previous hash)
    hashed = hash.digest('hex');  // Update hashed value for next iteration
    const halfLength = Math.floor(hashed.length / 2);
    
    const password1 = hashed.slice(0,halfLength);
    const password2 = hashed.slice((halfLength+1),hashed.length);
    const password_hash =`${password1}.${salt}.${password2}`

    return password_hash;  // Return the final hashed password after work factor rounds
};
const comparePassword = async (newpassword, hashedpassword)=>{
    const [password1,salt, password2]= hashedpassword.split('.');
    const newhashedPassword = await hashPassword(newpassword, salt);  // Hash the password with the salt
    if (newhashedPassword === hashedpassword){
        return true;
    }
    return false;
}

const generateKeyPair =()=>{
    // Generate RSA key pair
    return { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
}

const encryptPayload = (payload,publicKey) => {
    // Read the public key from the file
    
    // Convert the payload to a string
    const textToEncrypt = JSON.stringify(payload);

    // Generate a random AES key and IV
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt the text with AES
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'base64');
    encryptedText += cipher.final('base64');

    // Encrypt the AES key with RSA
    const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);

    // Format data to store as a string
    const dataToStore = `${iv.toString('base64')}$${encryptedKey.toString('base64')}$${encryptedText}`;

    // Store the encrypted data in a file
    // fs.writeFileSync('encrypted_data.txt', dataToStore, 'utf8');

    // console.log('Encrypted data stored in encrypted_data.txt');
    return dataToStore
}

const decryptPayload = (encryptedData,privateKey) =>{
    // Read the private key from the file
    
    // Read the encrypted data from file
    const encryptedDataString = encryptedData //fs.readFileSync('encrypted_data.txt', 'utf8');

    // Split the encrypted data string by '$' to retrieve iv, encryptedKey, and encryptedText
    const [iv, encryptedKey, encryptedText] = encryptedDataString.split('$');

    // Decrypt the AES key with RSA
    const decryptedKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedKey, 'base64'));

    // Decrypt the text with AES
    const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedKey, Buffer.from(iv, 'base64'));
    let decryptedText = decipher.update(encryptedText, 'base64', 'utf8');
    decryptedText += decipher.final('utf8');

    // Parse the decrypted text back to a JSON object
    return JSON.parse(decryptedText)
}

module.exports = {
    generateKeyPair,
    encryptPayload,
    decryptPayload,
    generateSalt,
    hashPassword,
    comparePassword
};