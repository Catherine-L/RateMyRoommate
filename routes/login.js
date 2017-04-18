const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/login',
  passport.authenticate('login', {
    successRedirect: '/private',
    failureRedirect: '/',
    failureFlash: true
  })
)

module.exports = router