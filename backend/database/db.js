const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()





const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("connect successfuly, ", `MongoDB Connected : ${connect.connection.host}`.cyan.underline)  // .cyan.underline this is only for color you may remove it
        
    } catch (error) {
        console.log('connection error'.red.bold, error) //.red.bold this is only for color you may remove it
        process.exit(1)
    }
}

module.exports = connectDB


// second method



// const mongoose = require('mongoose')

// const dotenv = require('dotenv')
// dotenv.config()





// const connectDB = async (app) => {
//     try {
//         const connect = await mongoose.connect(process.env.MONGO_URI, {})
        
//         app.listen(process.env.PORT || 3000, () => {
//             console.log("connect successfuly, ", `MongoDB Connected : ${connect.connection.host}`)
//         })
//     } catch (error) {
//         console.log('connection error', error)
//         process.exit(1)
//     }
// }

// module.exports = connectDB

