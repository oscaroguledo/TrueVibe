const { generateDefaultResponseObject } = require("../utils/defaultResponseObject").default;

// 404 controller handler
exports.handle_404_requests = (req, res, next) => {
    res.status(404).send(generateDefaultResponseObject({
        "success": false,
        "message": "Requested resource unavailable!"
    }));
}