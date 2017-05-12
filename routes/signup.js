const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/', (req, res) => {
  res.render('signup', {message: req.flash('message'), loggedIn: req.user})
});

router.post('/',
  passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  })
);

module.exports = router
