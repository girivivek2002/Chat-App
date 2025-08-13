const asyncHandler = require('express-async-handler')
const User = require('../models/user.models')
const generateToken = require('../database/generateToken')


// this is for create user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phoneNumber, password, image } = req.body;

    if (!name || !email || !password || !phoneNumber) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        phoneNumber,
        password,
        image

    });

    if (user) {
        res.status(201).json({
            success: "success",
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("failed to generate user");
    }
});

// this is for check email or password
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }
    const user = await User.findOne({ email })

    if (user && (await user.isMatchedPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }
    else {
        res.status(401)
        throw new Error('Invalid email id')
    }



})


// for search user in chatbox
// /api/user?search=vivek
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {      // because after question mark is always query . if the query is search what happen otherwise what happen
        $or: [      // it is use to select data on the basis of below. or opearator if any cobdition true from below it will give data
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]

    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })   // it will all user except current login person
    res.send(users)

})

module.exports = { registerUser, authUser, allUsers }

