const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/', (req, res) => {
  res.render('login', {message: req.flash('message')})
})

router.post('/',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    console.log("Attempting a user login...")
  }
)

module.exports = router