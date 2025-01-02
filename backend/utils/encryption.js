const crypto = require('crypto');

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
    const publicKey = publicKey //fs.readFileSync('public_key.pem', 'utf8');

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
    const privateKey = privateKey //fs.readFileSync('private_key.pem', 'utf8');

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
    decryptPayload
};