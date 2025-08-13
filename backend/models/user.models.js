const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            minlength: 10

        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        image: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",

        }


    },
    { timestamps: true }
)
// it is a middelware
UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
})

// it will compare the password
UserSchema.methods.isMatchedPassword = async function (password) {
    return await bcrypt.compare(password, this.password)

}

const User = mongoose.model("User", UserSchema)
module.exports = User;