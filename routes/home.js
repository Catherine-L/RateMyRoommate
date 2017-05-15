const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('home', {
      loggedIn: req.user
  })
})

module.exports = router
