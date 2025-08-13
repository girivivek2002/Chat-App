const jwt = require('jsonwebtoken')
const User = require('../models/user.models')
const asyncHandler = require('express-async-handler')


const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")   // check req ki authorization field
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];   // give only token except bearer on first place
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN) // compare token with env token
            req.user = await User.findById(decoded.id).select("-password") // save user info find by decoded.id and save it in req.field without password
            next()
        } catch (error) {
            res.status(401);
            throw new Error("not authorized, token failed")
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("not authorized no token")
    }
})

module.exports = { protect }


// example
// {
//     "_id": "abc123xyz",
//     "name": "Alice",
//     "email": "alice@example.com"
// }

// const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN); // after this is stored in decoded
// {
//     "id": "abc123xyz"
// }
// decoded = { id: "abc123xyz", iat: 123456789 }
// decoded.id = "abc123xyz"