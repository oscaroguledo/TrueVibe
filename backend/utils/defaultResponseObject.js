/**
 * Response function to send HTTP responses with the appropriate status code and message.
 * @param {Object} res - Express response object.
 * @param {number} status - HTTP status code (e.g., 200, 400, 404).
 * @param {string|null} [message=null] - Custom message to be included in the response.
 * @param {Object|null} [data=null] - Data to be included in the response body.
 * @param {string|null} [error=null] - Error message to be included if any error occurs.
 * @returns {Object} The response sent to the client.
 */
const Response = (res, status, message = null, data = null, error = null) => {
    // Default response structure
    const response = {
        success: status >= 200 && status < 300, // Mark success if status code is in the range of 200-299
        message: message || getMessageForStatus(status), // Use provided message or default message based on status code
        data: data || null, // Include data if provided, otherwise null
        error: error || null, // Include error if provided, otherwise null
    };

    // If data is null, remove it from the response object
    if (data === null) {
        delete response.data;
    }

    // If error is null, remove it from the response object
    if (error === null) {
        delete response.error;
    }

    // Send the response based on the status code
    switch (status) {
        case 400: // Bad Request
            return res.status(400).json(response);

        case 401: // Unauthorized
            return res.status(401).json({
                ...response,
                message: message || 'Unauthorized access. Please log in.'
            });

        case 403: // Forbidden
            return res.status(403).json({
                ...response,
                message: message || 'You do not have access.',
                error: error || 'Access forbidden.'
            });

        case 404: // Not Found
            return res.status(404).json({
                ...response,
                message: message || 'Resource not found.',
                error: error || 'The requested resource could not be found.'
            });

        case 500: // Internal Server Error
            return res.status(500).json({
                ...response,
                message: message || 'An unexpected error occurred.',
                error: error || 'Internal server error.'
            });

        // Default case for other status codes
        default:
            return res.status(200).json(response);
    }
};

/**
 * Helper function to return default messages for various status codes.
 * @param {number} status - HTTP status code (e.g., 200, 400, 404).
 * @returns {string} A default message for the given status code.
 */
const getMessageForStatus = (status) => {
    switch (status) {
        case 200:
            return 'Request successful';
        case 201:
            return 'Resource created successfully';
        case 204:
            return 'No content to return';
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not Found';
        case 500:
            return 'Internal Server Error';
        default:
            return 'Unknown error'; // Default message for unknown status codes
    }
};

export default Response;
