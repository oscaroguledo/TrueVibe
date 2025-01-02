const zlib = require('zlib');

// Function to compress a string using gzip with adjustable compression level
exports.compressString = function(inputString) {
    return new Promise((resolve, reject) => {
        // Convert the input string to a buffer
        const inputBuffer = Buffer.from(inputString, 'utf-8');
        
        // Get size of original buffer
        console.log(`Original size: ${inputBuffer.length} bytes`);

        // Create gzip options with specified compression level
        const gzipOptions = { level: 9 };

        zlib.gzip(inputBuffer, gzipOptions, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                // Convert the compressed buffer to a Base64 string
                const compressedString = buffer.toString('base64');

                // Get size of compressed buffer
                //console.log(`Compressed size: ${buffer.length} bytes`);

                resolve(compressedString);
            }
        });
    });
}

// Function to decompress a gzip-compressed Base64 string and display sizes
exports.decompressString = function(compressedString) {
    return new Promise((resolve, reject) => {
        // Convert Base64 string back to a buffer
        const buffer = Buffer.from(compressedString, 'base64');
        
        // Get size of compressed buffer
        console.log(`Compressed size: ${buffer.length} bytes`);

        zlib.gunzip(buffer, (err, decompressedBuffer) => {
            if (err) {
                reject(err);
            } else {
                // Convert the decompressed buffer to a string
                const decompressedString = decompressedBuffer.toString();

                // Get size of decompressed buffer
                //console.log(`Decompressed size: ${decompressedBuffer.length} bytes`);

                resolve(decompressedString);
            }
        });
    });
}