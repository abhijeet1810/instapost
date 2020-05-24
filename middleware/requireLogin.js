const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const JSON_SECRET_KEY = process.env.JWT_SECRET
const User = mongoose.model('User')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: 'you must be logged in!!' })
  }

  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, JSON_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized user' })
    }

    const { _id } = payload
    User.findById(_id).then((userdata) => {
      req.user = userdata
    })
    next()
  })
  next()
}
