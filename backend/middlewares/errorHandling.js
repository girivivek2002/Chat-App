

const notFound = async (req, res, next) => {
    const error = new Error(`not found ${req.originalUrl}`)
    res.status(400)
    next(error)
}

const errorHandler = async (err, req, res, next) => {
    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err.message,

    })
}

module.exports = { notFound, errorHandler }